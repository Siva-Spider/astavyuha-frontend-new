import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: "",
    username: "",
    email: "",
    mobilenumber: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        userId: formData.userId,
        username: formData.username,
        email: formData.email,
        mobilenumber: formData.mobilenumber,
        password: formData.password,
        role: "user",
      };

      const data = await apiPost("/register", payload);
      if (data.success) {
        setMessage("Registration submitted! You’ll receive an email after approval.");
        setTimeout(() => navigate("/"), 2500);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "1rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        backgroundColor: "#f8f9fa",
      }}
    >
      {/* LEFT: Registration Form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            width: "380px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Create an Account</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="userId"
              placeholder="User ID"
              value={formData.userId}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              name="mobilenumber"
              placeholder="Mobile Number"
              value={formData.mobilenumber}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={inputStyle}
              required
            />

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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: "1rem",
                color: message.includes("submitted") ? "green" : "red",
              }}
            >
              {message}
            </p>
          )}

          <p style={{ marginTop: "1rem" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              style={{
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT: Info / Message Section */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #ff00ddff, #00c6ff)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "4rem",
          fontSize: "1.2rem",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          💹 Secure & Smart Trading Starts Here
        </h2>
        <p style={{ maxWidth: "500px", lineHeight: "1.6" }}>
          Your personal information is <strong>100% safe</strong> and never shared.
          You’re taking the right step towards <strong>smart investing</strong> and
          <strong>controlled automated trading</strong>.
        </p>
        <p style={{ marginTop: "1.5rem", fontSize: "1rem" }}>
          📞 Feel free to contact our support team anytime — we’re here to help you succeed.
        </p>
      </div>
    </div>
  );
}
