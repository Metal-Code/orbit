from sqlalchemy.orm import Session
from models.project import Project
from models.user import User
from schemas.project import ProjectCreate

def create_project(db: Session, project_data: ProjectCreate, current_user: User):
    if not current_user.org_id:
        raise ValueError("You must belong to an organization to create a project")
    
    new_project = Project(
        name=project_data.name,
        description=project_data.description,
        org_id=current_user.org_id,
        created_by=current_user.id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

def get_projects(db: Session, current_user: User):
    if not current_user.org_id:
        raise ValueError("You must belong to an organization")
    return db.query(Project).filter(Project.org_id == current_user.org_id).all()

def get_project(db: Session, project_id: int, current_user: User):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise ValueError("Project not found")
    if project.org_id != current_user.org_id:
        raise ValueError("You do not have access to this project")
    return project

def delete_project(db: Session, project_id: int, current_user: User):
    project = get_project(db, project_id, current_user)
    if current_user.role != "owner":
        raise ValueError("Only the owner can delete a project")
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}