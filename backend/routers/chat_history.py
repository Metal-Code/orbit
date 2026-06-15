from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from services.chat_history_service import get_history, clear_history
from dependencies.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["Chat History"])

@router.get("/{project_id}/chat/history")
def fetch_history(project_id: int, current_user = Depends(get_current_user)):
    return get_history(project_id, current_user.id)

@router.delete("/{project_id}/chat/history")
def delete_history(project_id: int, current_user = Depends(get_current_user)):
    return clear_history(project_id, current_user.id)