import { useState } from "react";
import { addStudent } from "../api.js";

export default function AddStudent({ onSuccess }) {
  const [sid, setSid] = useState("");
  const [name, setName] = useState("");
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

    if (!name.trim()) {
      setError("Student name is required.");
      return;
    }

    setLoading(true);
    try {
      const result = await addStudent(parsedSid, name.trim());
      setMessage(result.message);
      setSid("");
      setName("");
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <h2>Add Student</h2>
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

        <label>
          Student Name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter full name"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Student"}
        </button>
      </form>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </section>
  );
}
