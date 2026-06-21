"""Rate limiting simple en memoria (ventana deslizante por IP).

Suficiente para el prototipo local (se reinicia con el proceso). En producción
se usaría un limitador respaldado por Redis. Se puede desactivar con la variable
de entorno HAMPIQ_DISABLE_RATELIMIT=1 (útil en pruebas).
"""
import os
import time
from collections import defaultdict

from fastapi import HTTPException, Request

_hits: dict[str, list[float]] = defaultdict(list)
_DISABLED = bool(os.environ.get("HAMPIQ_DISABLE_RATELIMIT"))


def rate_limit(bucket: str, max_calls: int, window_sec: int):
    """Devuelve una dependencia de FastAPI que limita llamadas por IP."""

    def dep(request: Request) -> None:
        if _DISABLED:
            return
        ip = request.client.host if request.client else "desconocido"
        key = f"{bucket}:{ip}"
        now = time.time()
        recent = [t for t in _hits[key] if now - t < window_sec]
        if len(recent) >= max_calls:
            raise HTTPException(status_code=429, detail="Demasiados intentos. Espera un momento e inténtalo de nuevo.")
        recent.append(now)
        _hits[key] = recent

    return dep
