from . import models
from .util import to_ms


def user_out(u: models.User) -> dict:
    return {"dni": u.dni, "role": u.role, "nombres": u.nombres, "apellidos": u.apellidos, "extra": u.extra}


def token_out(t: models.Token) -> dict:
    return {
        "code": t.code, "createdAt": to_ms(t.created_at), "expiresAt": to_ms(t.expires_at),
        "durationMin": t.duration_min, "uses": t.uses, "usesLeft": t.uses_left,
        "status": t.status, "medico": t.medico,
    }


def audit_out(a: models.AuditEntry) -> dict:
    return {"ts": to_ms(a.ts), "actor": a.actor, "rol": a.rol, "accion": a.accion, "ref": a.ref, "ip": a.ip, "disp": a.disp}


def event_out(e: models.ClinicalEvent) -> dict:
    return {
        "id": e.id, "ts": e.ts, "tipo": e.tipo, "titulo": e.titulo, "medico": e.medico,
        "colegiatura": e.colegiatura, "especialidad": e.especialidad, "estab": e.estab, "sev": e.sev,
        "motivo": e.motivo, "diagnostico": e.diagnostico, "examen": e.examen,
        "signos": e.signos, "medicamentos": e.medicamentos or [], "indicaciones": e.indicaciones,
        "estudios": e.estudios or [], "nuevo": bool(e.nuevo),
    }


def receta_out(r: models.Receta) -> dict:
    return {"id": r.id, "ts": r.ts, "paciente": r.paciente, "medico": r.medico, "estado": r.estado, "items": r.items, "nuevo": bool(r.nuevo)}


def study_out(p: models.PendingStudy) -> dict:
    return {"id": p.id, "ts": p.ts, "tipo": p.tipo, "nombre": p.nombre, "indicacion": p.indicacion, "medico": p.medico, "estado": p.estado}


def session_out(s: models.SessionDevice) -> dict:
    return {"id": s.id, "disp": s.disp, "ip": s.ip, "lugar": s.lugar, "actual": bool(s.actual), "ultimo": s.ultimo}


def vitals_out(v: models.Vitals) -> dict:
    return {"sangre": v.sangre, "alergias": v.alergias, "enfermedades": v.enfermedades, "medicacion": v.medicacion, "contacto": v.contacto}
