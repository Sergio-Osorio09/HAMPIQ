from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from .. import models, schemas, serializers
from ..database import get_db
from ..deps import require_role
from ..util import gen_code, now_utc, to_ms

router = APIRouter(prefix="/api", tags=["tokens"])


def _ip(request: Request) -> str | None:
    return request.client.host if request.client else None


@router.get("/tokens")
def list_tokens(user: models.User = Depends(require_role("paciente")), db: Session = Depends(get_db)):
    toks = db.query(models.Token).filter(models.Token.patient_dni == user.dni).order_by(models.Token.created_at.desc()).all()
    return [serializers.token_out(t) for t in toks]


@router.post("/tokens")
def create_token(body: schemas.TokenCreate, request: Request, user: models.User = Depends(require_role("paciente")), db: Session = Depends(get_db)):
    now = now_utc()
    t = models.Token(
        code=gen_code(), patient_dni=user.dni, created_at=now,
        expires_at=now + timedelta(minutes=body.duration), duration_min=body.duration,
        uses=body.uses, uses_left=body.uses, status="activa", medico="—",
    )
    db.add(t)
    db.add(models.AuditEntry(ts=now, patient_dni=user.dni, actor=f"{user.nombres} {user.apellidos}", actor_dni=user.dni,
                             rol="paciente", accion="Generó token médico", ref=t.code, ip=_ip(request), disp="Web · Hampiq"))
    db.commit()
    db.refresh(t)
    return serializers.token_out(t)


@router.post("/tokens/{code}/revoke")
def revoke_token(code: str, request: Request, user: models.User = Depends(require_role("paciente")), db: Session = Depends(get_db)):
    t = db.query(models.Token).filter(models.Token.code == code, models.Token.patient_dni == user.dni).first()
    if not t:
        raise HTTPException(status_code=404, detail="Token no encontrado")
    t.status = "revocada"
    db.add(models.AuditEntry(ts=now_utc(), patient_dni=user.dni, actor=f"{user.nombres} {user.apellidos}", actor_dni=user.dni,
                             rol="paciente", accion="Revocó token médico", ref=code, ip=_ip(request), disp="Web · Hampiq"))
    db.commit()
    db.refresh(t)
    return serializers.token_out(t)


@router.post("/access/validate")
def validate_token(body: schemas.CodeRequest, request: Request, user: models.User = Depends(require_role("medico")), db: Session = Depends(get_db)):
    raw = (body.code or "").upper().replace(" ", "")
    now = now_utc()
    t = db.query(models.Token).filter(models.Token.code == raw).first()
    if not t:
        raise HTTPException(status_code=404, detail="Token no encontrado. Verifica el código con el paciente.")
    if t.status == "revocada":
        raise HTTPException(status_code=403, detail="Este token fue revocado por el paciente.")
    if now > t.expires_at or t.status == "expirada":
        raise HTTPException(status_code=403, detail="El token ha expirado. Solicita uno nuevo al paciente.")
    if t.uses_left <= 0:
        raise HTTPException(status_code=403, detail="El token agotó su número de usos.")
    med_name = f"{user.nombres} {user.apellidos}"
    t.uses_left -= 1
    t.medico = med_name
    if t.uses_left <= 0:
        t.status = "agotada"
    db.add(models.AuditEntry(ts=now, patient_dni=t.patient_dni, actor=med_name, actor_dni=user.dni,
                             rol="medico", accion="Consultó historial mediante token", ref=raw, ip=_ip(request), disp="Web · Consultorio"))
    db.commit()
    return {"granted": True, "grantCode": t.code, "grantExpires": to_ms(t.expires_at), "patientDni": t.patient_dni}
