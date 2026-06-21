"""Entidades persistentes de Hampiq (DAS §8 — Vista de Datos)."""
from sqlalchemy import JSON, Boolean, Column, DateTime, Float, Integer, String, Text
from sqlalchemy.sql import func

from .database import Base


class User(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True)
    dni = Column(String(8), unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False)  # paciente | medico | admin
    nombres = Column(String, nullable=False)
    apellidos = Column(String, nullable=False)
    extra = Column(String, nullable=True)  # colegiatura para médicos


class ReniecRecord(Base):
    __tablename__ = "reniec"
    dni = Column(String(8), primary_key=True)
    nombres = Column(String, nullable=False)
    apellidos = Column(String, nullable=False)
    nacimiento = Column(String, nullable=False)
    sexo = Column(String, nullable=False)


class Vitals(Base):
    __tablename__ = "datos_vitales"
    id = Column(Integer, primary_key=True)
    patient_dni = Column(String(8), index=True, nullable=False)
    sangre = Column(String, nullable=False)
    alergias = Column(JSON, nullable=False)
    enfermedades = Column(JSON, nullable=False)
    medicacion = Column(JSON, nullable=False)
    contacto = Column(JSON, nullable=False)  # {nombre, relacion, telefono}


class Token(Base):
    __tablename__ = "tokens_acceso"
    id = Column(Integer, primary_key=True)
    code = Column(String, unique=True, index=True, nullable=False)
    patient_dni = Column(String(8), index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    duration_min = Column(Integer, nullable=False)
    uses = Column(Integer, nullable=False)
    uses_left = Column(Integer, nullable=False)
    status = Column(String, nullable=False)  # activa | expirada | agotada | revocada
    medico = Column(String, nullable=True)


class AuditEntry(Base):
    """Registro inmutable (append-only): nunca se edita ni se borra."""
    __tablename__ = "auditoria"
    id = Column(Integer, primary_key=True)
    ts = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    patient_dni = Column(String(8), index=True, nullable=True)  # historial afectado
    actor = Column(String, nullable=False)
    actor_dni = Column(String(8), nullable=True)
    rol = Column(String, nullable=False)  # medico | emergencia | paciente
    accion = Column(String, nullable=False)
    ref = Column(String, nullable=True)
    ip = Column(String, nullable=True)
    disp = Column(String, nullable=True)


class ClinicalEvent(Base):
    __tablename__ = "eventos_clinicos"
    id = Column(String, primary_key=True)
    patient_dni = Column(String(8), index=True, nullable=False)
    ts = Column(String, nullable=False)  # fecha ISO (YYYY-MM-DD)
    tipo = Column(String, nullable=False)
    titulo = Column(String, nullable=False)
    medico = Column(String, nullable=False)
    colegiatura = Column(String, nullable=True)
    especialidad = Column(String, nullable=True)
    estab = Column(String, nullable=True)
    sev = Column(String, nullable=True)
    motivo = Column(Text, nullable=True)
    diagnostico = Column(Text, nullable=True)
    examen = Column(Text, nullable=True)
    signos = Column(JSON, nullable=True)
    medicamentos = Column(JSON, nullable=True)
    indicaciones = Column(Text, nullable=True)
    estudios = Column(JSON, nullable=True)
    nuevo = Column(Boolean, default=False)
    created_ts = Column(Float, nullable=False, default=0.0)  # orden de inserción
    deleted_at = Column(DateTime(timezone=True), nullable=True)  # borrado lógico


class Receta(Base):
    __tablename__ = "recetas"
    id = Column(String, primary_key=True)
    patient_dni = Column(String(8), index=True, nullable=False)
    ts = Column(String, nullable=False)
    paciente = Column(String, nullable=False)
    medico = Column(String, nullable=False)
    estado = Column(String, nullable=False)  # Vigente | Vencida
    items = Column(JSON, nullable=False)  # [{nombre, dosis, duracion}]
    nuevo = Column(Boolean, default=False)
    created_ts = Column(Float, nullable=False, default=0.0)


class PendingStudy(Base):
    __tablename__ = "solicitudes_estudio"
    id = Column(String, primary_key=True)
    patient_dni = Column(String(8), index=True, nullable=False)
    ts = Column(String, nullable=False)
    tipo = Column(String, nullable=False)
    nombre = Column(String, nullable=False)
    indicacion = Column(String, nullable=True)
    medico = Column(String, nullable=False)
    estado = Column(String, nullable=False)  # Pendiente
    created_ts = Column(Float, nullable=False, default=0.0)


class SessionDevice(Base):
    __tablename__ = "sesiones"
    id = Column(String, primary_key=True)
    user_dni = Column(String(8), index=True, nullable=False)
    disp = Column(String, nullable=False)
    ip = Column(String, nullable=True)
    lugar = Column(String, nullable=True)
    actual = Column(Boolean, default=False)
    ultimo = Column(String, nullable=True)
