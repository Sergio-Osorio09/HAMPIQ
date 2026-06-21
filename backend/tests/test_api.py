"""Pruebas de la API Hampiq: autenticación, RBAC, control de acceso por
concesión, validación de entrada, ciclo de vida de tokens y emergencia."""


def _login(client, dni, pw):
    r = client.post("/api/auth/login", json={"dni": dni, "password": pw})
    assert r.status_code == 200, r.text
    return r.json()["token"]


def _h(token):
    return {"Authorization": f"Bearer {token}"}


def test_health(client):
    assert client.get("/api/health").json()["status"] == "ok"


def test_login_ok_y_fallido(client):
    assert client.post("/api/auth/login", json={"dni": "45872136", "password": "hampiq123"}).status_code == 200
    assert client.post("/api/auth/login", json={"dni": "45872136", "password": "malo"}).status_code == 401


def test_requiere_autenticacion(client):
    assert client.get("/api/tokens").status_code == 401


def test_jwt_manipulado(client):
    assert client.get("/api/me", headers=_h("eyJ.FALSO.firma")).status_code == 401


def test_rbac_por_rol(client):
    pac = _login(client, "45872136", "hampiq123")
    med = _login(client, "40221785", "medico123")
    assert client.get("/api/admin/users", headers=_h(pac)).status_code == 403
    assert client.get("/api/tokens", headers=_h(med)).status_code == 403
    assert client.post("/api/access/validate", headers=_h(pac), json={"code": "x"}).status_code == 403


def test_historial_exige_concesion(client):
    med = _login(client, "40221785", "medico123")
    # sin concesión vigente -> 403 (regla de negocio)
    assert client.get("/api/history", headers=_h(med)).status_code == 403
    assert client.post("/api/history", headers=_h(med), json={"tipo": "Consulta", "titulo": "x", "diagnostico": "y"}).status_code == 403
    # validar token activo del seed crea la concesión
    assert client.post("/api/access/validate", headers=_h(med), json={"code": "HMPQ-7K2D-9F4X"}).status_code == 200
    h = client.get("/api/history", headers=_h(med))
    assert h.status_code == 200 and len(h.json()) >= 5
    assert client.post("/api/history", headers=_h(med), json={"tipo": "Consulta", "titulo": "Nota", "diagnostico": "dx"}).status_code == 200


def test_paciente_ve_su_historial(client):
    pac = _login(client, "45872136", "hampiq123")
    h = client.get("/api/history", headers=_h(pac))
    assert h.status_code == 200 and len(h.json()) >= 5


def test_validacion_tokens(client):
    pac = _login(client, "45872136", "hampiq123")
    assert client.post("/api/tokens", headers=_h(pac), json={"duration": 999999, "uses": 1}).status_code == 422
    assert client.post("/api/tokens", headers=_h(pac), json={"duration": 30, "uses": -5}).status_code == 422
    assert client.post("/api/tokens", headers=_h(pac), json={"duration": 30, "uses": 1}).status_code == 200


def test_ciclo_vida_token(client):
    pac = _login(client, "45872136", "hampiq123")
    med = _login(client, "40221785", "medico123")
    code = client.post("/api/tokens", headers=_h(pac), json={"duration": 15, "uses": 1}).json()["code"]
    assert client.post("/api/access/validate", headers=_h(med), json={"code": code}).status_code == 200
    assert client.post("/api/access/validate", headers=_h(med), json={"code": code}).status_code == 403  # agotado
    assert client.post("/api/access/validate", headers=_h(med), json={"code": "HMPQ-NOEXISTE"}).status_code == 404


def test_emergencia_codigo_aleatorio(client):
    pac = _login(client, "45872136", "hampiq123")
    code = client.get("/api/vitals", headers=_h(pac)).json().get("emergencyCode")
    assert code and code.startswith("EMG-")
    assert client.post("/api/emergency/validate", json={"code": code}).status_code == 200
    assert client.post("/api/emergency/validate", json={"code": "EMG-00000000"}).status_code == 400


def test_medico_no_recibe_codigo_emergencia(client):
    med = _login(client, "40221785", "medico123")
    assert "emergencyCode" not in client.get("/api/vitals", headers=_h(med)).json()
