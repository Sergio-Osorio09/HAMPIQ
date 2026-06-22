import secrets
from datetime import datetime, timezone

from .config import TOKEN_ALPHABET


def now_utc() -> datetime:
    """UTC naive: consistente con lo que SQLite devuelve (evita comparar aware vs naive)."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def to_ms(dt: datetime | None) -> int:
    """Convierte un datetime (de la BD) a epoch ms UTC, como usa el frontend."""
    if dt is None:
        return 0
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return int(dt.timestamp() * 1000)


def gen_code() -> str:
    # Token de acceso al historial clínico: usa un PRNG criptográfico (secrets),
    # no random/Mersenne Twister, para que el código no sea predecible a partir
    # de otros emitidos.
    part = lambda: "".join(secrets.choice(TOKEN_ALPHABET) for _ in range(4))  # noqa: E731
    return f"HMPQ-{part()}-{part()}"


def today_iso() -> str:
    return datetime.now().strftime("%Y-%m-%d")
