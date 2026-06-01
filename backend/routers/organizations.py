from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.organization import OrganizationCreate, OrganizationResponse
from services.organization_service import create_organization, join_organization, get_organization
from dependencies.auth import get_current_user

router = APIRouter(prefix="/organizations", tags=["Organizations"])

@router.post("/", response_model=OrganizationResponse)
def create_org(org_data: OrganizationCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        return create_organization(db, org_data, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/join", response_model=OrganizationResponse)
def join_org(invite_code: str, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        return join_organization(db, invite_code, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=OrganizationResponse)
def get_my_org(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        return get_organization(db, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))