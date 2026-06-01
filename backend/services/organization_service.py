from sqlalchemy.orm import Session
from models.organization import Organization
from models.user import User
from schemas.organization import OrganizationCreate
import uuid

def create_organization(db : Session, org_data : OrganizationCreate, current_user : User):
    if current_user.org_id:
        raise ValueError("You already belong to an organization")
    
    invite_code = str(uuid.uuid4())[:8].upper()

    new_org = Organization(
        name = org_data.name,
        description = org_data.description,
        invite_code = invite_code,
        created_by = current_user.id
    )
    db.add(new_org)
    db.commit()
    db.refresh(new_org)

    current_user.org_id = new_org.id
    current_user.role = "owner"
    db.commit()
    db.refresh(current_user)

    return new_org

def join_organization(db : Session, invite_code : str, current_user : User):
    if current_user.org_id:
        raise ValueError("You already belong to an organization")
    
    org = db.query(Organization).filter(Organization.invite_code == invite_code).first()
    if not org:
        raise ValueError("Invalid invite code!!!")
    
    current_user.org_id = org.id
    current_user.role = "member"
    db.commit()
    db.refresh(current_user)

    return org

def get_organization(db : Session, current_user : User):
    if not current_user.org_id:
        raise ValueError("You are not part of any organization")
    return db.query(Organization).filter(Organization.id == current_user.org_id).first()
