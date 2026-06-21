from pydantic import BaseModel, EmailStr


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
