from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, serializers
from ..database import get_db
from ..deps import require_role

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/users")
def users(user: models.User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    return [serializers.user_out(u) for u in db.query(models.User).all()]


@router.get("/tokens")
def all_tokens(user: models.User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    return [serializers.token_out(t) for t in db.query(models.Token).order_by(models.Token.created_at.desc()).all()]


@router.get("/audit")
def all_audit(user: models.User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    return [serializers.audit_out(a) for a in db.query(models.AuditEntry).order_by(models.AuditEntry.ts.desc()).all()]
