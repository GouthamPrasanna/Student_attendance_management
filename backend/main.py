from datetime import datetime

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from database import attendance_col, students_col

app = FastAPI(title="Student Attendance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StudentCreate(BaseModel):
    sid: int = Field(gt=0)
    name: str = Field(min_length=1)

    @field_validator("name")
    @classmethod
    def strip_name(cls, value: str) -> str:
        return value.strip()


class AttendanceCreate(BaseModel):
    sid: int = Field(gt=0)
    attendance: str

    @field_validator("attendance")
    @classmethod
    def validate_attendance(cls, value: str) -> str:
        status = value.strip().lower()
        if status not in ("present", "absent"):
            raise ValueError("Attendance must be present or absent")
        return status


@app.get("/api/students")
def list_students():
    return [
        {"sid": student["sid"], "name": student["name"]}
        for student in students_col.find().sort("sid", 1)
    ]


@app.post("/api/students", status_code=201)
def add_student(student: StudentCreate):
    if students_col.find_one({"sid": student.sid}):
        raise HTTPException(status_code=400, detail="Student already exists")

    students_col.insert_one({"sid": student.sid, "name": student.name})
    return {"message": "Student added successfully"}


@app.post("/api/attendance", status_code=201)
def mark_attendance(data: AttendanceCreate):
    student = students_col.find_one({"sid": data.sid})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    attendance_col.insert_one(
        {
            "sid": data.sid,
            "attendance": data.attendance,
            "timestamp": datetime.now(),
        }
    )
    return {"message": f"Marked {student['name']} as {data.attendance}"}


@app.get("/api/students/{sid}/attendance")
def get_student_attendance(sid: int):
    student = students_col.find_one({"sid": sid})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    records = []
    for record in attendance_col.find({"sid": sid}).sort("timestamp", -1):
        timestamp = record.get("timestamp")
        records.append(
            {
                "attendance": record.get("attendance", ""),
                "timestamp": timestamp.isoformat()
                if isinstance(timestamp, datetime)
                else str(timestamp),
            }
        )

    return {
        "student": {"sid": student["sid"], "name": student["name"]},
        "records": records,
    }
