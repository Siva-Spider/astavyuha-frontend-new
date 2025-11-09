import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiPost } from "../api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await apiPost("/send-otp", { userId, email });
      if (data.success) {
        setMessage("OTP sent to your registered email. It will expire in 5 minutes!");
        setStep(2); // move to OTP + password step
      } else {
        setMessage(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      setMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password using OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("New Password and Confirm Password do not match!");
      setLoading(false);
      return;
    }

    try {
      const data = await apiPost(`/user-reset-password?userId=${userId}`, {
        new_password: newPassword,
        otp,
      });

      if (data.success) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(data.message || "Password reset failed");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
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
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f0f0f0" }}>
      <div style={{ backgroundColor: "white", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", width: "380px", textAlign: "center" }}>
        <h2 style={{ marginBottom: "1rem" }}>Forgot Password</h2>

        {step === 1 ? (
          // Step 1: Enter userId & email
          <form onSubmit={handleSendOtp}>
            <input
              type="text"
              placeholder="Enter your User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" disabled={loading} style={{ backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "6px", padding: "0.6rem 1.2rem", width: "100%", cursor: "pointer" }}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          // Step 2: Enter OTP + new password
          <form onSubmit={handleResetPassword}>
            <p style={{ marginBottom: "1rem", fontWeight: "bold" }}>Reset password for User ID: {userId}</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" disabled={loading} style={{ backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "6px", padding: "0.6rem 1.2rem", width: "100%", cursor: "pointer" }}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {message && (
          <p style={{ marginTop: "1rem", color: message.toLowerCase().includes("success") ? "green" : "red" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: "1rem" }}>
          <span onClick={() => navigate("/")} style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}>
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
}
