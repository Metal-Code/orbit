from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base
import os
from models.organization import Organization
from models.user import User
from models.project import Project
from models.project_member import ProjectMember
from models.timeline_entry import TimelineEntry
from models.link import Link
from models.attachment import Attachment
from models.pending_registration import PendingRegistration
from routers import auth, organizations, projects, timeline, upload, report, chat, chat_history



Base.metadata.create_all(bind=engine)

app = FastAPI(title="DevCycle API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:8081",
        "http://localhost:5173",
        os.getenv("FRONTEND_URL", "")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(organizations.router)
app.include_router(projects.router)
app.include_router(timeline.router)
app.include_router(upload.router)
app.include_router(chat.router)
app.include_router(chat_history.router)
app.include_router(report.router)

@app.get("/")
def read_root():
    return {"message": "DevCycle API is running"}