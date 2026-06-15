import redis
import json
from datetime import datetime
from core.config import REDIS_URL

r = redis.from_url(REDIS_URL, ssl_cert_reqs=None)

TTL_SECONDS = 3 * 24 * 60 * 60  # 3 days

def get_chat_key(project_id: int, user_id: int) -> str:
    return f"chat:{project_id}:{user_id}"

def save_message(project_id: int, user_id: int, question: str, answer: str, sources: list):
    key = get_chat_key(project_id, user_id)
    
    existing = r.get(key)
    messages = json.loads(existing) if existing else []
    
    messages.append({
        "question": question,
        "answer": answer,
        "sources": sources,
        "timestamp": datetime.utcnow().isoformat()
    })
    
    r.set(key, json.dumps(messages))
    r.expire(key, TTL_SECONDS)

def get_history(project_id: int, user_id: int) -> list:
    key = get_chat_key(project_id, user_id)
    existing = r.get(key)
    return json.loads(existing) if existing else []

def clear_history(project_id: int, user_id: int):
    key = get_chat_key(project_id, user_id)
    r.delete(key)
    return {"message": "Chat history cleared"}