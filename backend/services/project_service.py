from sqlalchemy.orm import Session
from models.project import Project
from models.project_member import ProjectMember
from models.user import User
from schemas.project import ProjectCreate
import uuid

def create_project(db: Session, project_data: ProjectCreate, current_user: User):
    if not current_user.org_id:
        raise ValueError("You must belong to an organization to create a project")
    
    invite_code = str(uuid.uuid4())[:8].upper()

    new_project = Project(
        name=project_data.name,
        description=project_data.description,
        org_id=current_user.org_id,
        created_by=current_user.id,
        invite_code=invite_code
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    member = ProjectMember(
        project_id=new_project.id,
        user_id=current_user.id
    )
    db.add(member)
    db.commit()

    return new_project

def get_projects(db: Session, current_user: User):
    if not current_user.org_id:
        raise ValueError("You must belong to an organization")
    
    memberships = db.query(ProjectMember).filter(
        ProjectMember.user_id == current_user.id
    ).all()
    
    project_ids = [m.project_id for m in memberships]
    
    if not project_ids:
        return []
    
    return db.query(Project).filter(Project.id.in_(project_ids)).all()

def get_project(db: Session, project_id: int, current_user: User):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise ValueError("Project not found")
    
    membership = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == current_user.id
    ).first()
    if not membership:
        raise ValueError("You do not have access to this project")
    
    return project

def join_project(db: Session, invite_code: str, current_user: User):
    if not current_user.org_id:
        raise ValueError("You must belong to an organization first")
    
    project = db.query(Project).filter(Project.invite_code == invite_code).first()
    if not project:
        raise ValueError("Invalid invite code")
    
    if project.org_id != current_user.org_id:
        raise ValueError("This project belongs to a different organization")
    
    existing = db.query(ProjectMember).filter(
        ProjectMember.project_id == project.id,
        ProjectMember.user_id == current_user.id
    ).first()
    if existing:
        raise ValueError("You are already a member of this project")
    
    member = ProjectMember(
        project_id=project.id,
        user_id=current_user.id
    )
    db.add(member)
    db.commit()

    return project

def delete_project(db: Session, project_id: int, current_user: User):
    project = get_project(db, project_id, current_user)
    if current_user.role != "owner":
        raise ValueError("Only the owner can delete a project")
    
    db.query(ProjectMember).filter(ProjectMember.project_id == project_id).delete()
    db.delete(project)
    db.commit()
    return {"message": "Project deleted"}

def get_project_invite_code(db: Session, project_id: int, current_user: User):
    if current_user.role != "owner":
        raise ValueError("Only the org owner can share the project invite code")
    
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise ValueError("Project not found")
    if project.org_id != current_user.org_id:
        raise ValueError("This project does not belong to your organization")
    
    return {"invite_code": project.invite_code}