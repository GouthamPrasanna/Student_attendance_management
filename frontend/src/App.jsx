import { useState } from "react";
import AddStudent from "./components/AddStudent.jsx";
import MarkAttendance from "./components/MarkAttendance.jsx";
import StudentList from "./components/StudentList.jsx";
import AttendanceHistory from "./components/AttendanceHistory.jsx";
import "./App.css";

const TABS = [
  { id: "add", label: "Add Student" },
  { id: "mark", label: "Mark Attendance" },
  { id: "students", label: "View Students" },
  { id: "history", label: "Attendance History" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("add");
  const [refreshKey, setRefreshKey] = useState(0);

  function refreshStudents() {
    setRefreshKey((key) => key + 1);
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Student Attendance System</h1>
        <p>Manage students and track daily attendance</p>
      </header>

      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "tab active" : "tab"}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="panel">
        {activeTab === "add" && <AddStudent onSuccess={refreshStudents} />}
        {activeTab === "mark" && <MarkAttendance />}
        {activeTab === "students" && <StudentList refreshKey={refreshKey} />}
        {activeTab === "history" && <AttendanceHistory />}
      </main>
    </div>
  );
}
