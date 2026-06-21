import time
from datetime import timedelta

from sqlalchemy.orm import Session

from . import data, models
from .security import hash_password
from .util import now_utc


def seed_if_empty(db: Session) -> None:
    if db.query(models.User).first():
        return

    for u in data.USERS:
        db.add(models.User(
            dni=u["dni"], password_hash=hash_password(u["password"]), role=u["role"],
            nombres=u["nombres"], apellidos=u["apellidos"], extra=u["extra"],
        ))

    for dni, r in data.RENIEC.items():
        db.add(models.ReniecRecord(dni=dni, **r))

    v = data.VITALS
    db.add(models.Vitals(
        patient_dni=data.PATIENT_DNI, sangre=v["sangre"], alergias=v["alergias"],
        enfermedades=v["enfermedades"], medicacion=v["medicacion"], contacto=v["contacto"],
    ))

    base = time.time()
    for i, e in enumerate(data.HISTORY):
        db.add(models.ClinicalEvent(
            id=e["id"], patient_dni=data.PATIENT_DNI, ts=e["ts"], tipo=e["tipo"], titulo=e["titulo"],
            medico=e["medico"], colegiatura=e["colegiatura"], especialidad=e["especialidad"],
            estab=e["estab"], sev=e["sev"], motivo=e["motivo"], diagnostico=e["diagnostico"],
            examen=e["examen"], signos=e["signos"], medicamentos=e["medicamentos"],
            indicaciones=e["indicaciones"], estudios=e["estudios"], nuevo=False,
            created_ts=base - i,
        ))

    for i, r in enumerate(data.RECETAS):
        db.add(models.Receta(
            id=r["id"], patient_dni=data.PATIENT_DNI, ts=r["ts"], paciente=r["paciente"],
            medico=r["medico"], estado=r["estado"], items=r["items"], nuevo=False,
            created_ts=base - i,
        ))

    for sdv in data.SESSIONS:
        db.add(models.SessionDevice(
            id=sdv["id"], user_dni=data.PATIENT_DNI, disp=sdv["disp"], ip=sdv["ip"],
            lugar=sdv["lugar"], actual=sdv["actual"], ultimo=sdv["ultimo"],
        ))

    now = now_utc()
    db.add(models.Token(code="HMPQ-7K2D-9F4X", patient_dni=data.PATIENT_DNI,
                        created_at=now - timedelta(minutes=8), expires_at=now + timedelta(seconds=892),
                        duration_min=30, uses=3, uses_left=2, status="activa", medico="—"))
    db.add(models.Token(code="HMPQ-3B8M-2P5T", patient_dni=data.PATIENT_DNI,
                        created_at=now - timedelta(days=3), expires_at=now - timedelta(days=3) + timedelta(minutes=30),
                        duration_min=30, uses=1, uses_left=0, status="expirada", medico="Dra. Ana Flores"))

    audits = [
        (now - timedelta(hours=2), "Dra. Ana Flores", "medico", "Consultó historial mediante token", "HMPQ-3B8M-2P5T", "190.233.45.18", "Chrome · Windows 11"),
        (now - timedelta(days=3), "Personal de emergencia", "emergencia", "Acceso en modo emergencia (datos vitales)", "EMG-45872136", "191.98.12.4", "Tablet · Hospital Loayza"),
        (now - timedelta(days=6), "Juan C. Pérez", "paciente", "Generó token médico", "HMPQ-9X1K-7L2N", "190.233.45.12", "Chrome · Windows 11"),
        (now - timedelta(days=9), "Dr. Luis Tello", "medico", "Consultó historial mediante token", "HMPQ-5R4D-8C3V", "200.48.225.9", "Edge · Windows 10"),
    ]
    for ts, actor, rol, accion, ref, ip, disp in audits:
        db.add(models.AuditEntry(ts=ts, patient_dni=data.PATIENT_DNI, actor=actor, rol=rol,
                                 accion=accion, ref=ref, ip=ip, disp=disp))

    db.commit()
