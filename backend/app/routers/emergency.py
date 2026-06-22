from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from .. import config, data, models, schemas, serializers
from ..database import get_db
from ..ratelimit import rate_limit
from ..util import now_utc

router = APIRouter(prefix="/api", tags=["emergency"])


@router.get("/emergency/demo-code")
def emergency_demo_code(db: Session = Depends(get_db)):
    """Solo-demo: devuelve el código de emergencia (aleatorio) del paciente semilla
    para que el botón "Simular escaneo de QR" resuelva un código real sin login.
    Deshabilitado salvo que HAMPIQ_DEMO_EMERGENCY esté activo (404 en caso contrario),
    de modo que el código del paciente nunca se filtra en producción."""
    if not config.DEMO_EMERGENCY:
        raise HTTPException(status_code=404, detail="No encontrado")
    v = db.query(models.Vitals).filter(models.Vitals.patient_dni == data.PATIENT_DNI).first()
    if not v or not v.emergency_code:
        raise HTTPException(status_code=404, detail="No encontrado")
    return {"code": v.emergency_code}


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
