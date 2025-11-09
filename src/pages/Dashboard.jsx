import React from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";


export default function Dashboard({ user, setUser }) {
  if (!user) {
    return <div>Loading user info...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <Header user={user} setUser={setUser} />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <Sidebar userRole={user.role} setUser={setUser} />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: "2rem",
            backgroundColor: "#fafafa",
            overflowY: "auto",
          }}
        >
          {/* Nested route content */}
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}
