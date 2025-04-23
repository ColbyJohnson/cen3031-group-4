import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");
  const isEmployer = localStorage.getItem("is_employer") === "true";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", background: "#333", color: "white" }}>
      {userId ? (
        <>
          <Link to="/" style={{ color: "white", marginRight: "1rem" }}>Dashboard</Link>
          <Link to="/profile" style={{ color: "white", marginRight: "1rem" }}>Profile</Link>
          <Link to="/jobs" style={{ color: "white", marginRight: "1rem" }}>Jobs</Link>
          {isEmployer && (
            <Link to="/applications" style={{ color: "white", marginRight: "1rem" }}>Applications</Link>
          )}
          <button onClick={handleLogout} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ color: "white", marginRight: "1rem" }}>Login</Link>
          <Link to="/register" style={{ color: "white", marginRight: "1rem" }}>Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
