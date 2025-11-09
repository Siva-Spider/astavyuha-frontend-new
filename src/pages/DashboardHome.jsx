import { useOutletContext } from "react-router-dom";

export default function DashboardHome() {
  const { user } = useOutletContext();
  const userName = user?.username || "Trader";

  // If role is admin, show admin message
  if (user?.role === "admin") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: "2rem",
          backgroundColor: "#f5f7fa",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "2rem 3rem",
            borderRadius: "20px",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
            maxWidth: "800px",
            width: "100%",
            textAlign: "center",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <h2 style={{ color: "#007bff", fontWeight: "600" }}>
            Welcome back, {userName}!
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#444" }}>
          </p>
        </div>
      </div>
    );
  }

  // ✅ Normal user message
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        padding: "2rem",
        backgroundColor: "#f5f7fa",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "2rem 3rem",
          borderRadius: "20px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          maxWidth: "800px",
          width: "100%",
          textAlign: "center",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <h2 style={{ color: "#007bff", fontWeight: "600", marginBottom: "1rem" }}>
          Hai {userName}, welcome back!
        </h2>

        <p style={{ fontSize: "1.1rem", color: "#333", lineHeight: "1.8", marginBottom: "1rem" }}>
          Here we are providing <strong>auto-trading strategies</strong> based on well-known indicators like
          <strong> EMA10, EMA20, Supertrend, MACD, Will R,</strong> and <strong>ADX</strong>.
        </p>

        <p style={{ fontSize: "1.1rem", color: "#444", lineHeight: "1.8", marginBottom: "1rem" }}>
          We have <strong>back-tested</strong> these strategies and included the ones with the best performance.
        </p>

        <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: "1.8", marginBottom: "1rem" }}>
          While we don’t promise profits in every trade, we assure you that this platform will make your
          trading journey more <strong>systematic and disciplined</strong>.
        </p>

        <p style={{ fontSize: "1.1rem", color: "#555", lineHeight: "1.8", marginBottom: "1.5rem" }}>
          If you have your own strategies that you'd like to include, feel free to reach out via
          <strong> Email</strong> or <strong> WhatsApp</strong>—contact details are on the
          <strong> Support</strong> page.
        </p>

        <h3 style={{ color: "#28a745", marginTop: "1.5rem", fontWeight: "600" }}>
          🌟 Wishing you the best in your trading journey — trade smart, stay consistent, and grow with us! 🌟
        </h3>
      </div>
    </div>
  );
}
