from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from datetime import datetime

from database import Base


# ============================================================
# USER
# ============================================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ============================================================
# MEDICINE
# ============================================================

class Medicine(Base):

    __tablename__ = "medicines"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    name = Column(
        String(200),
        nullable=False
    )

    dosage = Column(
        String(100),
        nullable=True
    )

    frequency = Column(
        String(100),
        nullable=True
    )

    start_date = Column(
        String(50),
        nullable=True
    )

    end_date = Column(
        String(50),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ============================================================
# PRESCRIPTION
# ============================================================

class Prescription(Base):

    __tablename__ = "prescriptions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    filename = Column(
        String(255),
        nullable=False
    )

    file_path = Column(
        String(500),
        nullable=False
    )

    extracted_text = Column(
        Text,
        nullable=True
    )

    uploaded_at = Column(
        DateTime,
        default=datetime.utcnow
    )