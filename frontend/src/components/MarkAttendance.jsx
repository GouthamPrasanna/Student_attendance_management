import { useState } from "react";
import { markAttendance } from "../api.js";

export default function MarkAttendance() {
  const [sid, setSid] = useState("");
  const [status, setStatus] = useState("present");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const parsedSid = Number(sid);
    if (!sid || !Number.isInteger(parsedSid) || parsedSid <= 0) {
      setError("Enter a valid positive student ID.");
      return;
    }

    setLoading(true);
    try {
      const result = await markAttendance(parsedSid, status);
      setMessage(result.message);
      setSid("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Mark Attendance</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Student ID
          <input
            type="number"
            value={sid}
            onChange={(event) => setSid(event.target.value)}
            placeholder="e.g. 101"
          />
        </label>

        <fieldset className="radio-group">
          <legend>Status</legend>
          <label>
            <input
              type="radio"
              name="status"
              value="present"
              checked={status === "present"}
              onChange={() => setStatus("present")}
            />
            Present
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="absent"
              checked={status === "absent"}
              onChange={() => setStatus("absent")}
            />
            Absent
          </label>
        </fieldset>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Mark Attendance"}
        </button>
      </form>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </section>
  );
}
