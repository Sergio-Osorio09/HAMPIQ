from fastapi import APIRouter

from .. import data

router = APIRouter(prefix="/api", tags=["catalog"])


@router.get("/medicines")
def medicines():
    return data.MEDICINES
