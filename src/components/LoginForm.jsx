import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api";

export default function LoginForm({ setUser }) {
  const [role, setRole] = useState("client");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // After successful login
  const handleLogin = async (credentials) => {
    const response = await apiPost("/login", credentials); // your login API
    if (response.success) {
      // response.user = { username, role, email, ... }
      setUser(response.user); 
      localStorage.setItem("user", JSON.stringify(response.user)); // optional, persist session
    } else {
      alert(response.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
      
    try {
      // ✅ Call backend API
      const response  = await apiPost("/login", { userId, password, role });

      if (response.success) {
      const userData = {
        userId: response.profile.userid,
        username: response.profile.username,
        email: response.profile.email,
        mobilenumber: response.profile.mobilenumber,
        role: response.profile.role.toLowerCase(),
      };

      // Save in state and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ Redirect automatically based on role
      if (userData.role === "admin") {
        navigate("/users");
      } else {
        navigate("/orders");
      }
    } else {
      setError(response.message || "Invalid credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    setError("Error connecting to the server");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      {/* Role selection */}
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Login as:
        </label>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <label>
            <input
              type="radio"
              name="role"
              value="client"
              checked={role === "client"}
              onChange={(e) => setRole(e.target.value)}
            />
            Client
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={role === "admin"}
              onChange={(e) => setRole(e.target.value)}
            />
            Admin
          </label>
        </div>
      </div>

      {/* User ID */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "6px",
          padding: "0.6rem 1.2rem",
          width: "100%",
          cursor: "pointer",
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
