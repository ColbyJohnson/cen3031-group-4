import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const userId = localStorage.getItem("user_id");
  const [userName, setUserName] = useState("User");
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchMatchedJobs();
    fetchApplications();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`/user/${userId}`);
      setUserName(res.data.name);
    } catch (err) {
      console.log("Could not fetch user info");
    }
  };

  const fetchMatchedJobs = async () => {
    try {
      const res = await axios.get(`/jobs/match/${userId}`);
      setMatchedJobs(res.data);
    } catch (err) {
      console.error("Error fetching matched jobs", err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(`/applications/user/${userId}`);
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Welcome, {userName}</h2>

      <h3>📌 Recommended Jobs for You</h3>
      {matchedJobs.length === 0 ? (
        <p>No matches found. Please update your profile skills.</p>
      ) : (
        <ul>
          {matchedJobs.map((job) => (
            <li key={job.id}>
              <h4>{job.title}</h4>
              <p>{job.description}</p>
              <p>{job.location} | {job.pay} | {job.job_type}</p>
            </li>
          ))}
        </ul>
      )}

      <h3>📄 My Applications</h3>
      {applications.length === 0 ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.application_id}>
              Job ID: {app.job_id} — Status: {app.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
