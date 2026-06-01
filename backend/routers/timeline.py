from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from schemas.timeline_entry import TimelineEntryCreate, TimelineEntryResponse
from services.timeline_service import create_entry, get_entries, get_entry, delete_entry
from services.project_service import get_project
from dependencies.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["Timeline"])

@router.post("/{project_id}/timeline", response_model=TimelineEntryResponse)
def add_entry(project_id: int, entry_data: TimelineEntryCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        get_project(db, project_id, current_user)
        return create_entry(db, project_id, entry_data, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{project_id}/timeline", response_model=List[TimelineEntryResponse])
def list_entries(project_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        get_project(db, project_id, current_user)
        return get_entries(db, project_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{project_id}/timeline/{entry_id}", response_model=TimelineEntryResponse)
def get_one_entry(project_id: int, entry_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        get_project(db, project_id, current_user)
        return get_entry(db, entry_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{project_id}/timeline/{entry_id}", response_model=None)
def remove_entry(project_id: int, entry_id: int, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        get_project(db, project_id, current_user)
        return delete_entry(db, entry_id, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))