"""Pruebas de seguridad (V&V) de la API Hampiq.

Cubren los controles de seguridad de una app de datos clínicos (PHI):
autenticación, RBAC, aislamiento entre pacientes (IDOR), integridad del JWT,
inyección SQL, limitación de tasa, cabeceras de seguridad, no fuga de secretos
y ciclo de vida de tokens (expirado/revocado/agotado).

El cliente de pruebas desactiva el rate-limiting globalmente (conftest); el test
de rate-limiting lo reactiva localmente.
"""
import time

import jwt as pyjwt
import pytest

from app import util
from app.config import JWT_ALG, JWT_SECRET


def _login(client, dni, pw):
    r = client.post("/api/auth/login", json={"dni": dni, "password": pw})
    assert r.status_code == 200, r.text
    return r.json()["token"]


def _h(token):
    return {"Authorization": f"Bearer {token}"}


# Credenciales sembradas
PAC = ("45872136", "hampiq123")
MED = ("40221785", "medico123")
ADM = ("10000001", "admin123")

# Endpoints protegidos que SIEMPRE deben exigir autenticación.
PROTECTED_GET = ["/api/me", "/api/vitals", "/api/history", "/api/recetas",
                 "/api/studies", "/api/tokens", "/api/audit", "/api/sessions",
                 "/api/admin/users", "/api/admin/tokens", "/api/admin/audit"]


# --------------------------------------------------------------------------- #
# 1. Autenticación requerida y cabeceras de Authorization malformadas
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize("path", PROTECTED_GET)
def test_endpoints_protegidos_exigen_token(client, path):
    assert client.get(path).status_code == 401


@pytest.mark.parametrize("header", [
    "", "Bearer", "Bearer ", "Basic abc", "token123", "Bearer a.b",
    "Bearer eyJ.FALSO.firma",
])
def test_authorization_malformado_rechazado(client, header):
    assert client.get("/api/me", headers={"Authorization": header}).status_code == 401


# --------------------------------------------------------------------------- #
# 2. Integridad del JWT: firma, algoritmo "none" y manipulación de payload
# --------------------------------------------------------------------------- #
def test_jwt_firmado_con_secreto_incorrecto_rechazado(client):
    forged = pyjwt.encode({"sub": "10000001", "role": "admin",
                           "iat": int(time.time()), "exp": int(time.time()) + 3600},
                          "secreto-equivocado-de-longitud-suficiente-0123456789", algorithm="HS256")
    assert client.get("/api/admin/users", headers=_h(forged)).status_code == 401


def test_jwt_algoritmo_none_rechazado(client):
    # Ataque clásico "alg: none": token sin firma. decode_token fija algorithms=[HS256].
    token_none = pyjwt.encode({"sub": "10000001", "role": "admin",
                              "exp": int(time.time()) + 3600}, "", algorithm="none")
    assert client.get("/api/admin/users", headers=_h(token_none)).status_code == 401


def test_jwt_payload_manipulado_rechazado(client):
    # Token válido de paciente, se le altera el rol a admin sin re-firmar.
    pac = _login(client, *PAC)
    header_b64, payload_b64, sig = pac.split(".")
    import base64
    import json
    pad = lambda s: s + "=" * (-len(s) % 4)
    payload = json.loads(base64.urlsafe_b64decode(pad(payload_b64)))
    payload["role"] = "admin"
    new_payload = base64.urlsafe_b64encode(json.dumps(payload).encode()).rstrip(b"=").decode()
    tampered = f"{header_b64}.{new_payload}.{sig}"
    assert client.get("/api/admin/users", headers=_h(tampered)).status_code == 401


def test_jwt_expirado_rechazado(client):
    expired = pyjwt.encode({"sub": "45872136", "role": "paciente",
                           "iat": int(time.time()) - 7200, "exp": int(time.time()) - 3600},
                          JWT_SECRET, algorithm=JWT_ALG)
    assert client.get("/api/me", headers=_h(expired)).status_code == 401


# --------------------------------------------------------------------------- #
# 3. RBAC: matriz de roles contra endpoints ajenos
# --------------------------------------------------------------------------- #
def test_rbac_paciente_no_accede_a_admin_ni_medico(client):
    pac = _login(client, *PAC)
    assert client.get("/api/admin/users", headers=_h(pac)).status_code == 403
    assert client.get("/api/admin/audit", headers=_h(pac)).status_code == 403
    assert client.post("/api/access/validate", headers=_h(pac), json={"code": "x"}).status_code == 403


def test_rbac_medico_no_accede_a_paciente_ni_admin(client):
    med = _login(client, *MED)
    assert client.get("/api/tokens", headers=_h(med)).status_code == 403
    assert client.get("/api/sessions", headers=_h(med)).status_code == 403
    assert client.get("/api/admin/users", headers=_h(med)).status_code == 403
    assert client.post("/api/tokens", headers=_h(med), json={"duration": 30, "uses": 1}).status_code == 403


def test_rbac_admin_no_emite_clinico_sin_rol_medico(client):
    adm = _login(client, *ADM)
    # admin no es médico: no puede crear notas/recetas/estudios
    assert client.post("/api/history", headers=_h(adm), json={"tipo": "Consulta", "titulo": "x", "diagnostico": "y"}).status_code == 403
    assert client.post("/api/recetas", headers=_h(adm), json={"medNombre": "x", "dosis": "y"}).status_code == 403


# --------------------------------------------------------------------------- #
# 4. Aislamiento entre pacientes (IDOR / multi-tenant)
# --------------------------------------------------------------------------- #
def _patient_b(client):
    """Registra (o inicia sesión) un segundo paciente real (DNI 70112233)."""
    body = {"dni": "70112233", "correo": "lucia@correo.com", "telefono": "987654321", "password": "claveSegura9"}
    r = client.post("/api/auth/register", json=body)
    if r.status_code == 409:
        return _login(client, "70112233", "claveSegura9")
    assert r.status_code == 200, r.text
    return r.json()["token"]


def test_paciente_no_ve_datos_de_otro_paciente(client):
    b = _patient_b(client)
    # El paciente B (recién creado) no tiene historial/vitales/tokens del paciente A.
    assert client.get("/api/history", headers=_h(b)).json() == []
    assert client.get("/api/tokens", headers=_h(b)).json() == []
    assert client.get("/api/vitals", headers=_h(b)).status_code == 404


def test_paciente_no_revoca_token_de_otro(client):
    pac = _login(client, *PAC)  # paciente A
    b = _patient_b(client)      # paciente B
    code = client.post("/api/tokens", headers=_h(pac), json={"duration": 30, "uses": 1}).json()["code"]
    # B intenta revocar el token de A -> 404 (no existe para él), no 200.
    assert client.post(f"/api/tokens/{code}/revoke", headers=_h(b)).status_code == 404
    # Sigue activo para A.
    codes = [t["code"] for t in client.get("/api/tokens", headers=_h(pac)).json()]
    assert code in codes


def test_auditoria_filtrada_por_paciente(client):
    b = _patient_b(client)
    # El paciente B no debe ver entradas de auditoría del paciente A.
    for entry in client.get("/api/audit", headers=_h(b)).json():
        assert entry.get("ref") != "HMPQ-7K2D-9F4X"


# --------------------------------------------------------------------------- #
# 5. Inyección SQL en parámetros de entrada
# --------------------------------------------------------------------------- #
@pytest.mark.parametrize("payload", [
    "' OR '1'='1", "45872136' --", "'; DROP TABLE usuarios;--", "\" OR 1=1--",
])
def test_inyeccion_sql_en_login(client, payload):
    r = client.post("/api/auth/login", json={"dni": payload, "password": payload})
    assert r.status_code == 401  # nunca autentica
    # La tabla sigue intacta: un login legítimo sigue funcionando.
    assert client.post("/api/auth/login", json={"dni": PAC[0], "password": PAC[1]}).status_code == 200


def test_inyeccion_sql_en_reniec(client):
    r = client.get("/api/reniec/' OR '1'='1")
    assert r.status_code == 400  # falla validación de formato DNI (8 dígitos)


# --------------------------------------------------------------------------- #
# 6. No fuga de secretos (hash de contraseña) en las respuestas
# --------------------------------------------------------------------------- #
def test_me_no_filtra_hash(client):
    pac = _login(client, *PAC)
    data = client.get("/api/me", headers=_h(pac)).json()
    assert "password" not in data and "password_hash" not in data and "hash" not in data


def test_admin_users_no_filtra_hash(client):
    adm = _login(client, *ADM)
    for u in client.get("/api/admin/users", headers=_h(adm)).json():
        assert "password" not in u and "password_hash" not in u and "hash" not in u


# --------------------------------------------------------------------------- #
# 7. Cabeceras de seguridad
# --------------------------------------------------------------------------- #
def test_cabeceras_de_seguridad_presentes(client):
    h = client.get("/api/health").headers
    assert h.get("X-Content-Type-Options") == "nosniff"
    assert h.get("X-Frame-Options") == "DENY"
    assert h.get("Referrer-Policy") == "no-referrer"
    assert h.get("Cache-Control") == "no-store"
    assert "frame-ancestors 'none'" in h.get("Content-Security-Policy", "")


# --------------------------------------------------------------------------- #
# 8. Ciclo de vida de tokens: expirado, revocado, agotado
# --------------------------------------------------------------------------- #
def test_token_revocado_no_concede_acceso(client):
    pac = _login(client, *PAC)
    med = _login(client, *MED)
    code = client.post("/api/tokens", headers=_h(pac), json={"duration": 30, "uses": 3}).json()["code"]
    assert client.post(f"/api/tokens/{code}/revoke", headers=_h(pac)).status_code == 200
    assert client.post("/api/access/validate", headers=_h(med), json={"code": code}).status_code == 403


def test_token_expirado_del_seed_rechazado(client):
    med = _login(client, *MED)
    # HMPQ-3B8M-2P5T está sembrado como expirado.
    assert client.post("/api/access/validate", headers=_h(med), json={"code": "HMPQ-3B8M-2P5T"}).status_code == 403


# --------------------------------------------------------------------------- #
# 9. Calidad criptográfica de los códigos de token
# --------------------------------------------------------------------------- #
def test_codigos_de_token_unicos_y_con_formato(client):
    import re
    codes = {util.gen_code() for _ in range(500)}
    assert len(codes) == 500  # sin colisiones
    assert all(re.fullmatch(r"HMPQ-[A-Z2-9]{4}-[A-Z2-9]{4}", c) for c in codes)


def test_gen_code_usa_csprng():
    # El generador debe usar `secrets` (CSPRNG), no el módulo `random`.
    import inspect
    src = inspect.getsource(util)
    assert "import secrets" in src
    assert "import random" not in src


# --------------------------------------------------------------------------- #
# 10. Limitación de tasa (rate limiting) realmente activa
# --------------------------------------------------------------------------- #
def test_rate_limit_bloquea_fuerza_bruta(client):
    from app import ratelimit
    ratelimit._hits.clear()
    ratelimit._DISABLED = False
    try:
        # Bucket "emergency": 10 llamadas/60s. La 11ª debe dar 429.
        statuses = [client.post("/api/emergency/validate", json={"code": "EMG-INVALIDO"}).status_code
                    for _ in range(11)]
        assert 429 in statuses
        assert statuses[-1] == 429
    finally:
        ratelimit._DISABLED = True
        ratelimit._hits.clear()


# --------------------------------------------------------------------------- #
# 11. Validación de entrada (límites de negocio)
# --------------------------------------------------------------------------- #
def test_registro_exige_password_minima(client):
    body = {"dni": "08456712", "correo": "pedro@correo.com", "telefono": "987654321", "password": "corta"}
    assert client.post("/api/auth/register", json=body).status_code == 400


def test_emergencia_codigo_invalido_no_filtra(client):
    r = client.post("/api/emergency/validate", json={"code": "EMG-00000000"})
    assert r.status_code == 400
    assert "paciente" not in r.json()  # no devuelve datos del paciente
