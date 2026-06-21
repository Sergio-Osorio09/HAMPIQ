from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from .. import models, schemas, serializers
from ..database import get_db
from ..ratelimit import rate_limit
from ..util import now_utc

router = APIRouter(prefix="/api", tags=["emergency"])


@router.post("/emergency/validate")
def emergency_validate(body: schemas.CodeRequest, request: Request, db: Session = Depends(get_db), _rl: None = Depends(rate_limit("emergency", 10, 60))):
    raw = (body.code or "").upper().replace(" ", "")
    v = db.query(models.Vitals).filter(models.Vitals.emergency_code == raw).first() if raw else None
    if not v:
        raise HTTPException(status_code=400, detail="Código de emergencia inválido. No se muestra información del paciente.")
    db.add(models.AuditEntry(
        ts=now_utc(), patient_dni=v.patient_dni, actor="Personal de emergencia", rol="emergencia",
        accion="Acceso en modo emergencia (datos vitales)", ref=raw,
        ip=request.client.host if request.client else None, disp="Web · Emergencias",
    ))
    db.commit()
    return {
        "paciente": {"nombre": "Juan Carlos Pérez Quispe", "dni": v.patient_dni, "edad": 35, "sexo": "Masculino"},
        "vitals": serializers.vitals_out(v),
    }
