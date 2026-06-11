from pymongo import MongoClient
import pandas as pd
from datetime import datetime

client = MongoClient("mongodb://localhost:27017")
db = client["attendance_db"]

students = db["students_record"]
attendance_record = db["attendance"]


def add_student():
    sid = int(input("enter the student ID:"))
    name = input("enter the student name :")
    if students.find_one({"sid": sid}):
        print("student already exists")
        return

    students.insert_one({"sid": sid, "name": name})

    print("student added successfully")

def mark_attendance():
    sid = int(input("enter the student ID:"))
    attendance = input("enter the attendance (present/absent):")

    student = students.find_one({"sid": sid})
    if attendance == "present":
        attendance_record.insert_one({"sid": sid, "attendance": attendance, "timestamp": datetime.now()})
    elif attendance == "absent":
        attendance_record.insert_one({"sid":sid,"attendance": attendance,"timestamp":datetime.now()})
        print("attendance marked successfully")
    else:
        print("student not found")

def view_attendance():
    for student in students.find():
        print(student)

def view_specific_student_attendance():
    sid = int(input("enter the student ID:"))
    student = students.find_one({"sid":sid})
    if student:
        attendance = attendance_record.find_one({"sid":sid})
        print(attendance)
    else:
        print("student not found")

while True:
    choice = int(input("enter the number to select options:\n1.add student\n2.mark attendance\n3.view attendance\n4.view specific student attendance\n"))
    if choice ==1:
        add_student()
    elif choice == 2:
        mark_attendance()
    elif choice == 3:
        view_attendance()
    elif choice == 4:
        view_specific_student_attendance()
    else:
        print("invalid choice:select correct option")
        break
