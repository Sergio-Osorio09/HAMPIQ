from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from .. import data, models, schemas, serializers
from ..database import get_db
from ..util import now_utc

router = APIRouter(prefix="/api", tags=["emergency"])


@router.post("/emergency/validate")
def emergency_validate(body: schemas.CodeRequest, request: Request, db: Session = Depends(get_db)):
    raw = (body.code or "").upper().replace(" ", "")
    if raw != data.EMERGENCY_CODE:
        raise HTTPException(status_code=400, detail="Código de emergencia inválido. No se muestra información del paciente.")
    db.add(models.AuditEntry(
        ts=now_utc(), patient_dni=data.PATIENT_DNI, actor="Personal de emergencia", rol="emergencia",
        accion="Acceso en modo emergencia (datos vitales)", ref=data.EMERGENCY_CODE,
        ip=request.client.host if request.client else None, disp="Web · Emergencias",
    ))
    db.commit()
    v = db.query(models.Vitals).filter(models.Vitals.patient_dni == data.PATIENT_DNI).first()
    return {
        "paciente": {"nombre": "Juan Carlos Pérez Quispe", "dni": data.PATIENT_DNI, "edad": 35, "sexo": "Masculino"},
        "vitals": serializers.vitals_out(v),
    }
