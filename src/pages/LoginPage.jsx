import Header from "../components/Header";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

export default function LoginPage({ setUser }) {
  const navigate = useNavigate();
  
  // Handler passed to LoginForm
  const handleLogin = (userData) => {
    setUser(userData);
    // Redirect based on role
    if (userData.role === "admin") {
      navigate("/users"); // Admin dashboard or main page
    } else if (userData.role === "user") {
      navigate("/orders"); // User dashboard or main page
    } else {
      navigate("/"); // fallback
    }
  };
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f0f0f0",
        
      }}
    >
      {/* ✅ Header with logo and title */}
      <Header />

      {/* ✅ Two-column layout (Login + Info panel) */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "stretch",
          overflow: "hidden",
        }}
      >
        {/* ✅ LEFT: LOGIN BOX */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2.5rem",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              width: "350px",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginBottom: "1.5rem", fontSize: "1.4rem", color: "#333" }}>
              Please Login
            </h2>

            {/* ✅ Login Form */}
            <LoginForm setUser={setUser} />

            {/* ✅ Register / Forgot Password links */}
            <div style={{ marginTop: "1.5rem", fontSize: "0.9rem" }}>
              <p>
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Register here
                </span>
              </p>
              <p>
                <span
                  onClick={() => navigate("/forgot-password")}
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Forgot Password?
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ✅ RIGHT: INFO PANEL WITH GRAPHICS */}
        <div
          style={{
            flex: 1.2,
            background:
              "linear-gradient(120deg, #d7defcff, #4e4376)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <img
            src="/trading_graph.png" // 👈 Place your image in "public/trading_graph.png"
            alt="AutoTrade Preview"
            style={{
              width: "70%",
              maxWidth: "600px",
              marginBottom: "1.5rem",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(255, 255, 255, 0.3)",
            }}
          />

          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Smarter Trading Starts Here 🚀
          </h1>
          <p style={{ maxWidth: "600px", lineHeight: "1.6", fontSize: "1.1rem" }}>
            <strong>AutoTrade</strong> by <b>ASTA VYUHA</b> empowers traders with 
            algorithmic precision and emotion-free decision making. 
            Experience <b>controlled, consistent profits</b> driven by data, not emotions.
          </p>
        </div>
      </div>
    </div>
  );
}
