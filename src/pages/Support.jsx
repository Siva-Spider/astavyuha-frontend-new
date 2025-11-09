import React, { useState, useRef, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { apiPost } from "../api";

export default function Support() {
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const messageRef = useRef(null);
  const [loading, setLoading] = useState(true);
  
  // ✅ Load user info from localStorage directly
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Prepare signature for this logged-in user
      const defaultSignature = `\n\nBest regards,\n${parsedUser.username}\nClient ID: ${parsedUser.userId}\nEmail: ${parsedUser.email}\nContact: ${parsedUser.mobilenumber}`;
      setMessage(`Dear Company,\n${defaultSignature}`);
    }
    setLoading(false);
  }, []);

  const handleFocus = () => {
    if (!messageRef.current) return;
    const lines = messageRef.current.value.split("\n");
    const firstLineLength = lines[0].length + 1;
    messageRef.current.setSelectionRange(firstLineLength, firstLineLength);
  };

  // ✅ Send support message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!user) return alert("User info not loaded.");
    if (!subject || !message) return alert("Please fill in all fields.");

    try {
      const res = await apiPost("/send-support-mail", {
        userId: user.userId,
        name: user.username,
        email: user.email,
        subject,
        message,
      });

      if (res.success) {
        alert("Message sent successfully!");
        setSubject("");
        const defaultSignature = `\n\nBest regards,\n${user.username}\nClient ID: ${user.userId}\nEmail: ${user.email}\nContact: ${user.mobilenumber}`;
        setMessage(`Dear Company,\n${defaultSignature}`);
      } else {
        alert(res.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Something went wrong.");
    }
  };

  const inputStyle = {
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    marginBottom: "1rem",
  };
  const labelStyle = { display: "block", marginBottom: "0.3rem", fontWeight: 500 };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Failed to load user info.</p>;

  return (
    <div>
      <h2>Support</h2>

      {/* Contact info */}
      <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FaWhatsapp color="#25D366" /> <span>{user.mobilenumber}</span>
        </div>
        <div>
          Email:{" "}
          <a href={`mailto:sivag.prasad88@gmail.com`}>
            sivag.prasad88@gmail.com
          </a>
        </div>
      </div>

      {/* Mailing form */}
      <form onSubmit={handleSend} style={{ maxWidth: "600px" }}>
        <div>
          <label style={labelStyle}>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={inputStyle}
            placeholder="Enter subject"
          />
        </div>

        <div>
          <label style={labelStyle}>Message:</label>
          <textarea
            ref={messageRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={handleFocus}
            rows={10}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#4caf50",
            color: "white",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
