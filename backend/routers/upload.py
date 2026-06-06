from fastapi import APIRouter, Depends, HTTPException
from dependencies.auth import get_current_user
from services.s3_service import generate_presigned_url

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.get("/presigned-url")
def get_presigned_url(
    file_name: str,
    file_type: str,
    current_user = Depends(get_current_user)
):
    try:
        return generate_presigned_url(file_name, file_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))