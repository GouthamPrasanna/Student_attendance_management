import { useState } from "react";
import { getStudentAttendance } from "../api.js";

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

export default function AttendanceHistory() {
  const [sid, setSid] = useState("");
  const [student, setStudent] = useState(null);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    setError("");
    setStudent(null);
    setRecords([]);
    setSearched(false);

    const parsedSid = Number(sid);
    if (!sid || !Number.isInteger(parsedSid) || parsedSid <= 0) {
      setError("Enter a valid positive student ID.");
      return;
    }

    setLoading(true);
    try {
      const data = await getStudentAttendance(parsedSid);
      setStudent(data.student);
      setRecords(data.records);
      setSearched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Attendance History</h2>

      <form className="form inline-form" onSubmit={handleSearch}>
        <label>
          Student ID
          <input
            type="number"
            value={sid}
            onChange={(event) => setSid(event.target.value)}
            placeholder="e.g. 101"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="message error">{error}</p>}

      {student && (
        <p className="subtitle">
          History for {student.name} (ID: {student.sid})
        </p>
      )}

      {searched && records.length === 0 && !error && (
        <p className="muted">No attendance records yet.</p>
      )}

      {records.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={`${record.timestamp}-${index}`}>
                  <td>{formatTimestamp(record.timestamp)}</td>
                  <td>
                    <span className={`badge ${record.attendance}`}>
                      {record.attendance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
