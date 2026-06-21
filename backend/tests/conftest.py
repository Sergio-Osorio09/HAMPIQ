"""Configuración de pruebas: BD temporal aislada y rate-limiting desactivado.

Las variables de entorno se fijan ANTES de importar la app, para que use una
SQLite temporal y no toque la base de datos real (hampiq.db).
"""
import os
import tempfile

_DB = os.path.join(tempfile.gettempdir(), "hampiq_test.db")
os.environ["HAMPIQ_DATABASE_URL"] = "sqlite:///" + _DB.replace("\\", "/")
os.environ["HAMPIQ_DISABLE_RATELIMIT"] = "1"
os.environ["HAMPIQ_JWT_SECRET"] = "test-secret-pruebas-hampiq-clave-larga-0123456789"

import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app


@pytest.fixture(scope="session", autouse=True)
def _fresh_schema():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture()
def client():
    with TestClient(app) as c:  # dispara el lifespan (create_all + seed)
        yield c
