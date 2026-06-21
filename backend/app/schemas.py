from pydantic import BaseModel, EmailStr, field_validator


class LoginRequest(BaseModel):
    dni: str
    password: str


class RegisterRequest(BaseModel):
    dni: str
    correo: EmailStr
    telefono: str
    password: str


class TokenCreate(BaseModel):
    duration: int  # minutos
    uses: int

    @field_validator("duration")
    @classmethod
    def _check_duration(cls, v: int) -> int:
        if v not in (15, 30, 60, 240):
            raise ValueError("La duración debe ser 15, 30, 60 o 240 minutos.")
        return v

    @field_validator("uses")
    @classmethod
    def _check_uses(cls, v: int) -> int:
        if v not in (1, 3, 5, 10):
            raise ValueError("El número de usos debe ser 1, 3, 5 o 10.")
        return v


class CodeRequest(BaseModel):
    code: str


class NoteCreate(BaseModel):
    tipo: str = "Consulta"
    titulo: str
    diagnostico: str
    indicaciones: str = ""


class RxCreate(BaseModel):
    medNombre: str
    dosis: str
    duracion: str = ""


class StudyCreate(BaseModel):
    tipo: str = "Laboratorio"
    nombre: str
    indicacion: str = ""
