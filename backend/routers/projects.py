from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from schemas.project import ProjectCreate, ProjectResponse
from services.project_service import create_project, get_projects, get_project, delete_project
from dependencies.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.post("/", response_model=ProjectResponse)
def create(project_data: ProjectCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        return create_project(db, project_data, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[ProjectResponse])
def list_projects(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        return get_projects(db, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{project_id}", response_model=ProjectResponse)
def get_one(project_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        return get_project(db, project_id, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{project_id}", response_model=None)
def delete(project_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        return delete_project(db, project_id, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))