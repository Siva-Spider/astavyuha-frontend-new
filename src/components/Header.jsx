export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#597df7ff",
        color: "#f3eacaff",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // ✅ spreads left/right
        boxShadow: "0 2px 6px rgba(17, 206, 64, 0.3)",
      }}
    >
      {/* Left side: Logo + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <img
          src="/astya_vyuha_logo.png"
          alt="App Logo"
          style={{ width: "60px", height: "60px", borderRadius: "8px" }}
        />
        <h1 style={{ fontSize: "2.5rem", margin: 0 }}>ASTA VYUHA</h1>
      </div>

      {/* Right side: Contact Info */}
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "1rem", fontWeight: "500" }}>
          📞 +91 8099887688
        </div>
        <div style={{ fontSize: "1rem" }}>
          ✉️ <a href="mailto:sivag.prasad88@gmail.com" style={{ color: "#f3eacaff", textDecoration: "none" }}>
            sivag.prasad88@gmail.com
          </a>
        </div>
      </div>
    </header>
  );
}
