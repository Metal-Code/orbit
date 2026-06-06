from sqlalchemy.orm import Session
from models.timeline_entry import TimelineEntry
from models.link import Link
from models.attachment import Attachment
from models.user import User
from schemas.timeline_entry import TimelineEntryCreate

def create_entry(db: Session, project_id: int, entry_data: TimelineEntryCreate, current_user: User):
    new_entry = TimelineEntry(
        title=entry_data.title,
        description=entry_data.description,
        type=entry_data.type,
        project_id=project_id,
        added_by_name=current_user.full_name,
        added_by_email=current_user.email
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)

    for link in entry_data.links:
        new_link = Link(
            url=link.url,
            label=link.label,
            timeline_entry_id=new_entry.id
        )
        db.add(new_link)

    for attachment in entry_data.attachments:
        new_attachment = Attachment(
            file_name=attachment.file_name,
            file_url=attachment.file_url,
            file_type=attachment.file_type,
            timeline_entry_id=new_entry.id
        )
        db.add(new_attachment)

    db.commit()
    db.refresh(new_entry)
    return new_entry

def get_entries(db: Session, project_id: int):
    return db.query(TimelineEntry).filter(
        TimelineEntry.project_id == project_id
    ).order_by(TimelineEntry.created_at.asc()).all()

def get_entry(db: Session, entry_id: int):
    entry = db.query(TimelineEntry).filter(TimelineEntry.id == entry_id).first()
    if not entry:
        raise ValueError("Entry not found")
    return entry

def delete_entry(db: Session, entry_id: int, current_user: User):
    entry = get_entry(db, entry_id)
    if entry.added_by_email != current_user.email and current_user.role != "owner":
        raise ValueError("You can only delete your own entries")
    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted"}