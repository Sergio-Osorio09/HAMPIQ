from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from .config import CORS_ORIGINS
from .database import Base, SessionLocal, engine
from .routers import admin, audit, auth, catalog, clinical, emergency, tokens
from .seed import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Hampiq API", version="0.1.0", lifespan=lifespan)


# Cabeceras de seguridad en cada respuesta. La API sirve datos clínicos (PHI),
# así que se desactiva el cacheo, se previene el sniffing de tipo MIME y el
# embebido en iframes (clickjacking), y se limita la fuga de Referer.
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Cache-Control"] = "no-store"
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"
    # HSTS: solo tiene efecto sobre HTTPS; inofensivo en HTTP local.
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for module in (auth, catalog, tokens, clinical, audit, emergency, admin):
    app.include_router(module.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
