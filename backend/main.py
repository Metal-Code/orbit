from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base

from models.organization import Organization
from models.user import User
from models.project import Project
from models.project_member import ProjectMember
from models.timeline_entry import TimelineEntry
from models.link import Link

from routers import auth, organizations, projects, timeline

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DevCycle API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:8081","http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(organizations.router)
app.include_router(projects.router)
app.include_router(timeline.router)

@app.get("/")
def read_root():
    return {"message": "DevCycle API is running"}