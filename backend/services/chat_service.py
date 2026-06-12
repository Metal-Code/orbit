from sqlalchemy.orm import Session
from models.user import User
from services.project_service import get_project
from rag.pipeline import answer_question

def get_chat_answer(db: Session, project_id: int, question: str, current_user: User) -> str:
    get_project(db, project_id, current_user)
    return answer_question(question, project_id)