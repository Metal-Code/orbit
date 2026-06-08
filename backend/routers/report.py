from fastapi import APIRouter, Form, UploadFile, File
from typing import List, Optional
import resend
from core.config import RESEND_API_KEY, REPORT_EMAIL

resend.api_key = RESEND_API_KEY

router = APIRouter(prefix="/report", tags=["Report"])

@router.post("/")
async def send_report(
    description: str = Form(...),
    full_name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    attachments: Optional[List[UploadFile]] = File(None)
):
    attachment_list = []

    if attachments:
        for file in attachments:
            content = await file.read()
            attachment_list.append({
                "filename": file.filename,
                "content": list(content)
            })

    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": REPORT_EMAIL,
        "subject": f"New Report from {full_name or 'Anonymous'}",
        "html": f"""
            <h2>New Report Submitted</h2>
            <p><strong>Name:</strong> {full_name or 'Not provided'}</p>
            <p><strong>Email:</strong> {email or 'Not provided'}</p>
            <p><strong>Description:</strong></p>
            <p>{description}</p>
        """,
        "attachments": attachment_list
    })

    return {"message": "Report sent successfully"}