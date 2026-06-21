"""Hash de contraseñas (PBKDF2, stdlib) y JWT (PyJWT)."""
import base64
import hashlib
import hmac
import os
import time

import jwt

from .config import JWT_ALG, JWT_EXPIRE_MIN, JWT_SECRET

# 600k iteraciones PBKDF2-SHA256 (alineado con la guía OWASP actual).
# verify_password lee el nº de iteraciones del propio hash, así que los hashes
# antiguos siguen verificándose; solo los nuevos usan este valor.
_ITERATIONS = 600_000


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, _ITERATIONS)
    return f"pbkdf2_sha256${_ITERATIONS}${base64.b64encode(salt).decode()}${base64.b64encode(dk).decode()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        _algo, iters, salt_b64, hash_b64 = stored.split("$")
        salt = base64.b64decode(salt_b64)
        expected = base64.b64decode(hash_b64)
        dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, int(iters))
        return hmac.compare_digest(dk, expected)
    except Exception:
        return False


def create_access_token(dni: str, role: str) -> str:
    now = int(time.time())
    payload = {"sub": dni, "role": role, "iat": now, "exp": now + JWT_EXPIRE_MIN * 60}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
