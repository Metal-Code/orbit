from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base

# Import all models so SQLAlchemy knows about them before create_all
from models.organization import Organization
from models.user import User
from models.project import Project
from models.timeline_entry import TimelineEntry
from models.link import Link

from routers import auth, organizations, projects, timeline

Base.metadata.create_all(bind=engine)

app = FastAPI(title="DevCycle API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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