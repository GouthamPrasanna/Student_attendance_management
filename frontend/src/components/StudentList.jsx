import { useEffect, useState } from "react";
import { getStudents } from "../api.js";

export default function StudentList({ refreshKey }) {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadStudents() {
      setLoading(true);
      setError("");
      try {
        const data = await getStudents();
        if (active) {
          setStudents(data);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStudents();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  return (
    <section>
      <h2>View Students</h2>

      {loading && <p className="muted">Loading students...</p>}
      {error && <p className="message error">{error}</p>}

      {!loading && !error && students.length === 0 && (
        <p className="muted">No students added yet.</p>
      )}

      {!loading && students.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.sid}>
                  <td>{student.sid}</td>
                  <td>{student.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
