"""Configuración del backend Hampiq (arranque local con SQLite).

En producción, mover los secretos a variables de entorno y cambiar la base de
datos a PostgreSQL + Redis (según el DAS). Aquí se priorizó correr sin instalar
nada más que Python.
"""
import os

# Base de datos: SQLite local (archivo hampiq.db en backend/).
DATABASE_URL = os.environ.get("HAMPIQ_DATABASE_URL", "sqlite:///./hampiq.db")

# JWT
JWT_SECRET = os.environ.get("HAMPIQ_JWT_SECRET", "hampiq-dev-secret-cambia-esto")
JWT_ALG = "HS256"
JWT_EXPIRE_MIN = 60 * 8  # 8 horas

# Tokens médicos: alfabeto sin caracteres ambiguos (igual que el prototipo).
TOKEN_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"

# CORS: orígenes del frontend en desarrollo (Vite).
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
