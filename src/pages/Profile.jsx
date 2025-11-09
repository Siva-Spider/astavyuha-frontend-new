import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { apiPost } from "../api"; // for OTP and password change

export default function Profile() {
  const { user } = useOutletContext(); // get user from Dashboard context
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  if (!user) return <p>Loading profile...</p>;

  // Send OTP
  const sendOtp = async () => {
    try {
      await apiPost("/send-otp", { email: user.email, userId: user.userId });
      setOtpSent(true);
      alert("OTP sent to your registered email/phone!");
    } catch (err) {
      alert("Failed to send OTP. Try again.");
      console.error(err);
    }
  };

  // Change Password
  const changePassword = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      alert("Please request OTP first!");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password do not match!");
      return;
    }

    try {
       const res = await apiPost(`/change-password?userId=${user.userId}`, {
        current_password: currentPassword,
        new_password: newPassword,
        otp,
      });

      if (res.success) {
        alert("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setOtp("");
        setOtpSent(false);
      } else {
        alert(res.message || "Password change failed!");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      alert("Something went wrong!");
    }
  };

  const inputStyle = {
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    marginBottom: "1rem",
    backgroundColor: "#f0f0f0",
  };

  const labelStyle = { display: "block", marginBottom: "0.3rem", fontWeight: 500 };

  return (
    <div>
      <h2>Profile</h2>

      <div style={{ maxWidth: "600px", marginTop: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>User ID:</label>
          <input type="text" value={user.userId} readOnly style={inputStyle} />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Name:</label>
          <input type="text" value={user.username} readOnly style={inputStyle} />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Email:</label>
          <input type="email" value={user.email} readOnly style={inputStyle} />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label style={labelStyle}>Phone:</label>
          <input type="text" value={user.mobilenumber} readOnly style={inputStyle} />
        </div>

        {/* Password Change Section */}
        <h3>Change Password</h3>
        <form onSubmit={changePassword}>
          <div>
            <label style={labelStyle}>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ ...inputStyle, backgroundColor: "white" }}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ ...inputStyle, backgroundColor: "white" }}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ ...inputStyle, backgroundColor: "white" }}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              style={{ flex: 1, ...inputStyle, backgroundColor: "white" }}
              required
            />
            <button
              type="button"
              onClick={sendOtp}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#4caf50",
                color: "white",
                cursor: "pointer",
              }}
            >
              {otpSent ? "Resend OTP" : "Send OTP"}
            </button>
          </div>

          <button
            type="submit"
            style={{
              padding: "0.6rem 1.2rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#007bff",
              color: "white",
              cursor: "pointer",
            }}
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}
