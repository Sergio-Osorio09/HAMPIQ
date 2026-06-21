import time

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from .. import data, models, schemas, serializers
from ..database import get_db
from ..deps import get_current_user, require_role
from ..util import now_utc, today_iso

router = APIRouter(prefix="/api", tags=["clinical"])


def _patient_for(user: models.User) -> str:
    # En este prototipo solo el paciente Juan tiene historial; médico/admin lo consultan.
    return user.dni if user.role == "paciente" else data.PATIENT_DNI


def _ip(request: Request) -> str | None:
    return request.client.host if request.client else None


@router.get("/vitals")
def vitals(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    v = db.query(models.Vitals).filter(models.Vitals.patient_dni == _patient_for(user)).first()
    if not v:
        raise HTTPException(status_code=404, detail="Sin datos vitales")
    return serializers.vitals_out(v)


@router.get("/history")
def history(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    evs = (
        db.query(models.ClinicalEvent)
        .filter(models.ClinicalEvent.patient_dni == _patient_for(user), models.ClinicalEvent.deleted_at.is_(None))
        .order_by(models.ClinicalEvent.created_ts.desc())
        .all()
    )
    return [serializers.event_out(e) for e in evs]


@router.post("/history")
def add_note(body: schemas.NoteCreate, request: Request, user: models.User = Depends(require_role("medico")), db: Session = Depends(get_db)):
    if not body.titulo.strip() or not body.diagnostico.strip():
        raise HTTPException(status_code=400, detail="Completa al menos el título y el diagnóstico.")
    now = time.time()
    med = f"{user.nombres} {user.apellidos}"
    ev = models.ClinicalEvent(
        id="x" + str(int(now * 1000)), patient_dni=data.PATIENT_DNI, ts=today_iso(), tipo=body.tipo,
        titulo=body.titulo.strip(), medico=med, colegiatura=user.extra or "CMP 58213", especialidad="Neumología",
        estab="Hospital Nacional Arzobispo Loayza", sev="Leve",
        motivo="Registro clínico generado durante el acceso autorizado por token.", diagnostico=body.diagnostico.strip(),
        examen="—", signos={"pa": "—", "fc": "—", "fr": "—", "temp": "—", "sat": "—", "peso": "—", "talla": "—", "imc": "—"},
        medicamentos=[], indicaciones=body.indicaciones.strip() or "Sin indicaciones adicionales.", estudios=[],
        nuevo=True, created_ts=now,
    )
    db.add(ev)
    db.add(models.AuditEntry(ts=now_utc(), patient_dni=data.PATIENT_DNI, actor=med, actor_dni=user.dni,
                             rol="medico", accion="Registró nota clínica en el historial", ref="—", ip=_ip(request), disp="Web · Consultorio"))
    db.commit()
    db.refresh(ev)
    return serializers.event_out(ev)


@router.get("/recetas")
def list_recetas(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    rs = db.query(models.Receta).filter(models.Receta.patient_dni == _patient_for(user)).order_by(models.Receta.created_ts.desc()).all()
    return [serializers.receta_out(r) for r in rs]


@router.post("/recetas")
def add_receta(body: schemas.RxCreate, request: Request, user: models.User = Depends(require_role("medico")), db: Session = Depends(get_db)):
    if not body.medNombre.strip() or not body.dosis.strip():
        raise HTTPException(status_code=400, detail="Indica el medicamento y la dosis.")
    now = time.time()
    med = f"{user.nombres} {user.apellidos}"
    r = models.Receta(
        id="rx" + str(int(now * 1000)), patient_dni=data.PATIENT_DNI, ts=today_iso(),
        paciente="Juan Carlos Pérez Quispe", medico=med, estado="Vigente",
        items=[{"nombre": body.medNombre.strip(), "dosis": body.dosis.strip(), "duracion": body.duracion.strip() or "Según indicación"}],
        nuevo=True, created_ts=now,
    )
    db.add(r)
    db.add(models.AuditEntry(ts=now_utc(), patient_dni=data.PATIENT_DNI, actor=med, actor_dni=user.dni,
                             rol="medico", accion="Emitió receta electrónica", ref="—", ip=_ip(request), disp="Web · Consultorio"))
    db.commit()
    db.refresh(r)
    return serializers.receta_out(r)


@router.get("/studies")
def list_studies(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    ps = db.query(models.PendingStudy).filter(models.PendingStudy.patient_dni == _patient_for(user)).order_by(models.PendingStudy.created_ts.desc()).all()
    return [serializers.study_out(p) for p in ps]


@router.post("/studies")
def add_study(body: schemas.StudyCreate, request: Request, user: models.User = Depends(require_role("medico")), db: Session = Depends(get_db)):
    if not body.nombre.strip():
        raise HTTPException(status_code=400, detail="Indica el estudio a solicitar.")
    now = time.time()
    med = f"{user.nombres} {user.apellidos}"
    p = models.PendingStudy(
        id="ps" + str(int(now * 1000)), patient_dni=data.PATIENT_DNI, ts=today_iso(), tipo=body.tipo,
        nombre=body.nombre.strip(), indicacion=body.indicacion.strip(), medico=med, estado="Pendiente", created_ts=now,
    )
    db.add(p)
    db.add(models.AuditEntry(ts=now_utc(), patient_dni=data.PATIENT_DNI, actor=med, actor_dni=user.dni,
                             rol="medico", accion="Solicitó estudio: " + body.nombre.strip(), ref="—", ip=_ip(request), disp="Web · Consultorio"))
    db.commit()
    db.refresh(p)
    return serializers.study_out(p)
