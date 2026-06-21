from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from . import models
from .database import get_db
from .security import decode_token


def get_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> models.User:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="No autenticado")
    token = authorization.split(" ", 1)[1]
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    user = db.query(models.User).filter(models.User.dni == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return user


def require_role(*roles: str):
    def dep(user: models.User = Depends(get_current_user)) -> models.User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="No autorizado para este recurso")
        return user

    return dep
