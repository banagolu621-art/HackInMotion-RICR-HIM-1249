import os
import uuid

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from models import Medicine, Prescription, User
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db

router = APIRouter(prefix="/api/profile", tags=["Profile"])


UPLOAD_DIR = "uploads/prescriptions"

os.makedirs(UPLOAD_DIR, exist_ok=True)


# ============================================================
# TEMPORARY USER AUTHENTICATION
# ============================================================
#
# Until JWT authentication is added, this uses user_id
# supplied by the frontend.
#
# Later we will replace this with:
#
# current_user = Depends(get_current_user)
#
# ============================================================


def get_user(user_id: int, db: Session):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


# ============================================================
# ADD MEDICINE
# ============================================================


class MedicineRequest(BaseModel):
    user_id: int
    name: str
    dosage: str | None = None
    frequency: str | None = None
    start_date: str | None = None
    end_date: str | None = None


@router.post("/medicines")
def add_medicine(medicine: MedicineRequest, db: Session = Depends(get_db)):

    user = get_user(medicine.user_id, db)

    if not medicine.name.strip():
        raise HTTPException(status_code=400, detail="Medicine name is required")

    new_medicine = Medicine(
        user_id=user.id,
        name=medicine.name.strip(),
        dosage=medicine.dosage,
        frequency=medicine.frequency,
        start_date=medicine.start_date,
        end_date=medicine.end_date,
    )

    db.add(new_medicine)

    db.commit()

    db.refresh(new_medicine)

    return {
        "success": True,
        "message": "Medicine added successfully",
        "medicine": {
            "id": new_medicine.id,
            "name": new_medicine.name,
            "dosage": new_medicine.dosage,
            "frequency": new_medicine.frequency,
            "start_date": new_medicine.start_date,
            "end_date": new_medicine.end_date,
        },
    }


# ============================================================
# GET USER MEDICINES
# ============================================================


@router.get("/medicines/{user_id}")
def get_medicines(user_id: int, db: Session = Depends(get_db)):

    get_user(user_id, db)

    medicines = (
        db.query(Medicine)
        .filter(Medicine.user_id == user_id)
        .order_by(Medicine.created_at.desc())
        .all()
    )

    return {
        "success": True,
        "medicines": [
            {
                "id": medicine.id,
                "name": medicine.name,
                "dosage": medicine.dosage,
                "frequency": medicine.frequency,
                "start_date": medicine.start_date,
                "end_date": medicine.end_date,
            }
            for medicine in medicines
        ],
    }


# ============================================================
# DELETE MEDICINE
# ============================================================


@router.delete("/medicines/{medicine_id}")
def delete_medicine(medicine_id: int, user_id: int, db: Session = Depends(get_db)):

    medicine = (
        db.query(Medicine)
        .filter(Medicine.id == medicine_id, Medicine.user_id == user_id)
        .first()
    )

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    db.delete(medicine)

    db.commit()

    return {"success": True, "message": "Medicine deleted successfully"}


# ============================================================
# UPLOAD PRESCRIPTION
# ============================================================


@router.post("/prescriptions/upload")
async def upload_prescription(
    user_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    get_user(user_id, db)

    allowed_extensions = {".jpg", ".jpeg", ".png", ".pdf"}

    original_filename = file.filename or ""

    extension = os.path.splitext(original_filename)[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, detail="Only JPG, JPEG, PNG and PDF files are allowed"
        )

    unique_filename = str(uuid.uuid4()) + extension

    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    contents = await file.read()

    max_size = 10 * 1024 * 1024

    if len(contents) > max_size:
        raise HTTPException(status_code=400, detail="File size must be less than 10 MB")

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    prescription = Prescription(
        user_id=user_id,
        filename=original_filename,
        file_path=file_path,
        extracted_text=None,
    )

    db.add(prescription)

    db.commit()

    db.refresh(prescription)

    return {
        "success": True,
        "message": "Prescription uploaded successfully",
        "prescription": {
            "id": prescription.id,
            "filename": prescription.filename,
            "uploaded_at": prescription.uploaded_at,
        },
    }


# ============================================================
# GET USER PRESCRIPTIONS
# ============================================================


@router.get("/prescriptions/{user_id}")
def get_prescriptions(user_id: int, db: Session = Depends(get_db)):

    get_user(user_id, db)

    prescriptions = (
        db.query(Prescription)
        .filter(Prescription.user_id == user_id)
        .order_by(Prescription.uploaded_at.desc())
        .all()
    )

    return {
        "success": True,
        "prescriptions": [
            {
                "id": prescription.id,
                "filename": prescription.filename,
                "uploaded_at": prescription.uploaded_at,
            }
            for prescription in prescriptions
        ],
    }
