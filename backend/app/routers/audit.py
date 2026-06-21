from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, serializers
from ..database import get_db
from ..deps import get_current_user, require_role

router = APIRouter(prefix="/api", tags=["audit"])


@router.get("/audit")
def audit(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    q = db.query(models.AuditEntry)
    if user.role == "paciente":
        q = q.filter(models.AuditEntry.patient_dni == user.dni)
    elif user.role == "medico":
        q = q.filter(models.AuditEntry.rol == "medico", models.AuditEntry.actor == f"{user.nombres} {user.apellidos}")
    # admin: auditoría global (sin filtro)
    entries = q.order_by(models.AuditEntry.ts.desc()).all()
    return [serializers.audit_out(a) for a in entries]


@router.get("/sessions")
def sessions(user: models.User = Depends(require_role("paciente")), db: Session = Depends(get_db)):
    ss = db.query(models.SessionDevice).filter(models.SessionDevice.user_dni == user.dni).all()
    return [serializers.session_out(s) for s in ss]


@router.delete("/sessions/{sid}")
def close_session(sid: str, user: models.User = Depends(require_role("paciente")), db: Session = Depends(get_db)):
    s = db.query(models.SessionDevice).filter(models.SessionDevice.id == sid, models.SessionDevice.user_dni == user.dni).first()
    if not s:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")
    if s.actual:
        raise HTTPException(status_code=400, detail="No puedes cerrar la sesión actual")
    db.delete(s)
    db.commit()
    return {"ok": True}
