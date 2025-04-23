import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [userId] = useState(1); // Replace with actual user ID from login
  const [profile, setProfile] = useState({
    skills: "",
    experience: "",
    contact_info: "",
    resume: null
  });
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`/profile/${userId}`);
      setProfile({
        skills: res.data.skills || "",
        experience: res.data.experience || "",
        contact_info: res.data.contact_info || "",
        resume: null
      });
      setIsExisting(true);
    } catch (err) {
      console.log("No profile found, creating new one");
      setIsExisting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setProfile({ ...profile, resume: files[0] });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("skills", profile.skills);
    formData.append("experience", profile.experience);
    formData.append("contact_info", profile.contact_info);
    if (profile.resume) formData.append("resume", profile.resume);

    try {
      if (isExisting) {
        await axios.put(`/profile/${userId}`, formData);
        alert("Profile updated!");
      } else {
        await axios.post("/profile", formData);
        alert("Profile created!");
        setIsExisting(true);
      }
    } catch (err) {
      alert("Failed to save profile.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <textarea
          name="skills"
          placeholder="Skills (comma separated)"
          value={profile.skills}
          onChange={handleChange}
        /><br />

        <textarea
          name="experience"
          placeholder="Experience"
          value={profile.experience}
          onChange={handleChange}
        /><br />

        <input
          name="contact_info"
          placeholder="Contact Info"
          value={profile.contact_info}
          onChange={handleChange}
        /><br />

        <input
          type="file"
          name="resume"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
        /><br />

        <button type="submit">{isExisting ? "Update" : "Create"} Profile</button>
      </form>
    </div>
  );
}

export default Profile;
