from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.chat import ChatRequest, ChatResponse
from services.chat_service import get_chat_answer
from services.chat_history_service import save_message
from dependencies.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["Chat"])

@router.post("/{project_id}/chat", response_model=ChatResponse)
def chat(project_id: int, chat_request: ChatRequest, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    try:
        result = get_chat_answer(db, project_id, chat_request.question, current_user)
        save_message(
            project_id=project_id,
            user_id=current_user.id,
            question=chat_request.question,
            answer=result["answer"],
            sources=result["sources"]
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))