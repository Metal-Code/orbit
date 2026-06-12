from sqlalchemy.orm import Session
from models.timeline_entry import TimelineEntry
from models.link import Link
from models.attachment import Attachment
from models.user import User
from schemas.timeline_entry import TimelineEntryCreate
from rag.vector_store import add_entry_to_vector_store, delete_entry_from_vector_store

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
            label=attachment.label,
            timeline_entry_id=new_entry.id
        )
        db.add(new_attachment)

    db.commit()
    db.refresh(new_entry)

    links_data = [{"url": link.url, "label": link.label} for link in entry_data.links] if entry_data.links else []
    attachments_data = [{"url": att.file_url, "label": att.label or att.file_name, "type": att.file_type} for att in entry_data.attachments] if entry_data.attachments else []

    links_text = ", ".join([f"{l['label'] or l['url']}: {l['url']}" for l in links_data]) if links_data else "None"
    attachments_text = ", ".join([f"{a['label']} ({a['type']})" for a in attachments_data]) if attachments_data else "None"

    embed_text = f"""Title: {new_entry.title}
    Type: {new_entry.type}
    Description: {new_entry.description}
    Added by: {new_entry.added_by_name}
    Date: {new_entry.created_at}
    Links: {links_text}
    Attachments: {attachments_text}"""

    add_entry_to_vector_store(
        entry_id=new_entry.id,
        project_id=project_id,
        text=embed_text,
        title=new_entry.title,
        links=links_data,
        attachments=attachments_data
    )

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

    delete_entry_from_vector_store(entry_id)
    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted"}