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



while True:
    choice = int(input("enter the number to select options:\n1.add student\n2.mark attendance\n"))
    if choice ==1:
        add_student()
    elif choice == 2:
        mark_attendance()
    else:
        print("invalid choice:select correct option")
