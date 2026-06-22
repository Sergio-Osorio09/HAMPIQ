"""Configuración del backend Hampiq (arranque local con SQLite).

En producción, mover los secretos a variables de entorno y cambiar la base de
datos a PostgreSQL + Redis (según el DAS). Aquí se priorizó correr sin instalar
nada más que Python.
"""
import os
import secrets
from pathlib import Path

# Base de datos: SQLite local (archivo hampiq.db en backend/).
DATABASE_URL = os.environ.get("HAMPIQ_DATABASE_URL", "sqlite:///./hampiq.db")


# JWT — el secreto se toma de la variable de entorno HAMPIQ_JWT_SECRET. Si no existe,
# se genera uno aleatorio y se persiste localmente (.jwt_secret, gitignored), para nunca
# usar un valor fijo conocido embebido en el código.
def _jwt_secret() -> str:
    env = os.environ.get("HAMPIQ_JWT_SECRET")
    if env:
        return env
    path = Path(__file__).resolve().parent.parent / ".jwt_secret"
    if path.exists():
        return path.read_text(encoding="utf-8").strip()
    token = secrets.token_urlsafe(48)
    try:
        path.write_text(token, encoding="utf-8")
    except OSError:
        pass
    return token


JWT_SECRET = _jwt_secret()
JWT_ALG = "HS256"
JWT_EXPIRE_MIN = 60 * 8  # 8 horas

# Tokens médicos: alfabeto sin caracteres ambiguos (igual que el prototipo).
TOKEN_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"


# Demo: el código de emergencia de cada paciente es aleatorio (ver seed.py) y la
# pantalla de Emergencia es pre-login, así que no puede conocerlo. Con esta bandera
# activada, GET /emergency/demo-code expone el código del paciente semilla para que
# el botón "Simular escaneo de QR" resuelva un código real. Apagada por defecto;
# debe permanecer apagada en producción para no filtrar el código aleatorio.
def _env_flag(name: str) -> bool:
    return os.environ.get(name, "").strip().lower() in {"1", "true", "yes", "on"}


DEMO_EMERGENCY = _env_flag("HAMPIQ_DEMO_EMERGENCY")

# CORS: orígenes del frontend en desarrollo (Vite).
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
