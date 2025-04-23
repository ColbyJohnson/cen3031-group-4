import React, { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    job_type: "",
    pay: ""
  });
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const userId = localStorage.getItem("user_id");
  const isEmployer = localStorage.getItem("is_employer") === "true";

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    pay: "",
    job_type: "",
    expiration_date: "",
    employer_id: userId
  });

  useEffect(() => {
    loadJobs();
    if (userId && !isEmployer) {
      fetchAppliedJobs();
    }
  }, []);

  const loadJobs = async () => {
    const res = await axios.get("/jobs");
    setJobs(res.data);
  };

  const fetchAppliedJobs = async () => {
    try {
      const res = await axios.get(`/applications/user/${userId}`);
      const ids = res.data.map(app => app.job_id);
      setAppliedJobIds(ids);
    } catch (err) {
      console.log("Error fetching applications");
    }
  };

  const handleSearch = async () => {
    const params = { keyword: search, ...filters };
    const res = await axios.get("/jobs/search", { params });
    setJobs(res.data);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const postJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/jobs", form);
      alert("Job posted!");
      setForm({
        title: "", description: "", location: "", pay: "", job_type: "", expiration_date: "", employer_id: userId
      });
      loadJobs();
    } catch (err) {
      alert("Failed to post job");
    }
  };

  const applyToJob = async (jobId) => {
    try {
      await axios.post("/applications", {
        user_id: userId,
        job_id: jobId
      });
      alert("Application submitted!");
      setAppliedJobIds([...appliedJobIds, jobId]);
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to apply.");
      }
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Job Listings</h2>

      {/* Search */}
      <input
        placeholder="Search by keyword"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        placeholder="Location"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      />
      <input
        placeholder="Job Type"
        value={filters.job_type}
        onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
      />
      <input
        placeholder="Pay"
        value={filters.pay}
        onChange={(e) => setFilters({ ...filters, pay: e.target.value })}
      />
      <button onClick={handleSearch}>Search</button>

      <ul>
        {jobs.map((job) => (
          <li key={job.id} style={{ marginTop: "1rem", borderTop: "1px solid #ccc" }}>
            <h3>{job.title}</h3>
            <p>{job.description}</p>
            <p><strong>Location:</strong> {job.location} | <strong>Pay:</strong> {job.pay} | <strong>Type:</strong> {job.job_type}</p>

            {/* Apply button for seekers only */}
            {!isEmployer && (
              <button
                onClick={() => applyToJob(job.id)}
                disabled={appliedJobIds.includes(job.id)}
              >
                {appliedJobIds.includes(job.id) ? "Already Applied" : "Apply"}
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Job posting for employers only */}
      {isEmployer && (
        <>
          <hr />
          <h3>Post a Job</h3>
          <form onSubmit={postJob}>
            <input name="title" placeholder="Title" value={form.title} onChange={handleFormChange} required /><br />
            <textarea name="description" placeholder="Description" value={form.description} onChange={handleFormChange} required /><br />
            <input name="location" placeholder="Location" value={form.location} onChange={handleFormChange} /><br />
            <input name="pay" placeholder="Pay" value={form.pay} onChange={handleFormChange} /><br />
            <input name="job_type" placeholder="Job Type" value={form.job_type} onChange={handleFormChange} /><br />
            <input name="expiration_date" placeholder="Expiration Date (YYYY-MM-DD)" value={form.expiration_date} onChange={handleFormChange} /><br />
            <button type="submit">Post Job</button>
          </form>
        </>
      )}
    </div>
  );
}

export default Jobs;
