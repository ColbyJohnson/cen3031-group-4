import React, { useEffect, useState } from "react";
import axios from "axios";

function Applications() {
  const [jobId, setJobId] = useState(""); // Enter job ID manually for now
  const [applications, setApplications] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({}); // Tracks status inputs

  const fetchApplications = async () => {
    if (!jobId) return;
    try {
      const res = await axios.get(`/applications/job/${jobId}`);
      setApplications(res.data);
      setStatusUpdates({}); // reset on load
    } catch (err) {
      alert("Failed to load applicants.");
    }
  };

  const handleStatusChange = (appId, newStatus) => {
    setStatusUpdates({ ...statusUpdates, [appId]: newStatus });
  };

  const updateStatus = async (appId) => {
    const newStatus = statusUpdates[appId];
    if (!newStatus) return;
    try {
      await axios.put(`/applications/${appId}`, { status: newStatus });
      alert(`Status updated to '${newStatus}'`);
      fetchApplications(); // reload
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Review Applications</h2>

      <input
        type="text"
        placeholder="Enter Job ID"
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
      />
      <button onClick={fetchApplications}>Load Applicants</button>

      <ul style={{ marginTop: "1rem" }}>
        {applications.map((app) => (
          <li key={app.application_id} style={{ marginBottom: "1rem", borderTop: "1px solid #ccc" }}>
            <p><strong>User ID:</strong> {app.user_id}</p>
            <p><strong>Current Status:</strong> {app.status}</p>
            <input
              type="text"
              placeholder="New Status"
              value={statusUpdates[app.application_id] || ""}
              onChange={(e) =>
                handleStatusChange(app.application_id, e.target.value)
              }
            />
            <button onClick={() => updateStatus(app.application_id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Applications;
