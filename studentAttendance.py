from pymongo import MongoClient
import pandas as pd
from datetime import datetime

def add_student():
    sid = int(input("enter the student ID:"))
    name = input("enter the student name :")

    students.insert_one({"sid": sid, "name": name})

    print("student added successfully")

def mark_attendance():
    sid = int(input("enter the student ID:"))
    attendance = input("enter the attendance (present/absent):")

    if sid in students:
        if attendance == present:
            attendance_record.insert_one({"sid": sid, "attendance": attendance, "timestamp": datetime.now()})
        else:
            attendance_record.insert_one({"sid":sid,"attendance": attendance,"timestamp":datetime.now()})
            print("attendance marked successfully")
    else:
        print("student not found")