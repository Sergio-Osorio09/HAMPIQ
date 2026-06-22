import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas, serializers
from ..database import get_db
from ..deps import get_current_user
from ..ratelimit import rate_limit
from ..security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/api", tags=["auth"])

# Hash "señuelo": cuando el DNI no existe, igualamos el coste de verificación para
# no revelar por temporización si una cuenta existe (anti-enumeración de usuarios).
_DUMMY_HASH = hash_password("hampiq-dummy-password-no-account")


@router.get("/reniec/{dni}")
def reniec_lookup(dni: str, db: Session = Depends(get_db), _rl: None = Depends(rate_limit("reniec", 20, 60))):
    if not re.fullmatch(r"\d{8}", dni):
        raise HTTPException(status_code=400, detail="El DNI debe tener exactamente 8 dígitos.")
    r = db.query(models.ReniecRecord).filter(models.ReniecRecord.dni == dni).first()
    if not r:
        raise HTTPException(status_code=404, detail="No se encontraron datos para este DNI en RENIEC (demo: prueba 45872136, 70112233 u 08456712).")
    return {"nombres": r.nombres, "apellidos": r.apellidos, "nacimiento": r.nacimiento, "sexo": r.sexo}


@router.post("/auth/register")
def register(body: schemas.RegisterRequest, db: Session = Depends(get_db), _rl: None = Depends(rate_limit("register", 10, 60))):
    dni = body.dni.strip()
    if not re.fullmatch(r"\d{8}", dni):
        raise HTTPException(status_code=400, detail="El DNI debe tener exactamente 8 dígitos.")
    if len(re.sub(r"\D", "", body.telefono)) < 9:
        raise HTTPException(status_code=400, detail="Ingresa un teléfono válido (9 dígitos).")
    if len(body.password) < 8:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 8 caracteres.")
    r = db.query(models.ReniecRecord).filter(models.ReniecRecord.dni == dni).first()
    if not r:
        raise HTTPException(status_code=404, detail="No se encontraron datos para este DNI en RENIEC.")
    if db.query(models.User).filter(models.User.dni == dni).first():
        raise HTTPException(status_code=409, detail="Ya existe una cuenta asociada a este DNI. Inicia sesión.")
    user = models.User(dni=dni, password_hash=hash_password(body.password), role="paciente", nombres=r.nombres, apellidos=r.apellidos)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"token": create_access_token(user.dni, user.role), "user": serializers.user_out(user)}


@router.post("/auth/login")
def login(body: schemas.LoginRequest, db: Session = Depends(get_db), _rl: None = Depends(rate_limit("login", 20, 60))):
    user = db.query(models.User).filter(models.User.dni == body.dni.strip()).first()
    # Verificamos siempre (contra un hash señuelo si el usuario no existe) para que
    # el tiempo de respuesta no delate la existencia de la cuenta.
    if not user:
        verify_password(body.password, _DUMMY_HASH)
        raise HTTPException(status_code=401, detail="DNI o contraseña incorrectos.")
    if not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="DNI o contraseña incorrectos.")
    return {"token": create_access_token(user.dni, user.role), "user": serializers.user_out(user)}


@router.get("/me")
def me(user: models.User = Depends(get_current_user)):
    return serializers.user_out(user)
