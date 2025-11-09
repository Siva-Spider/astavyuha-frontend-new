import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Support from "./pages/Support";
import Users from "./pages/Users";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import TradingApp from "./pages/TradingApp";
import DashboardHome from "./pages/DashboardHome";

export default function App() {
  // ✅ Initialize user state from localStorage for refresh persistence
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* --- Protected Routes --- */}
        {user ? (
          <Route path="/" element={<Dashboard user={user} setUser={setUser} />}>
            {/* Default dashboard home */}
            <Route index element={<DashboardHome />} />

            {/* Admin routes */}
            {user.role === "admin" && (
              <>
                <Route path="users" element={<Users />} />
                <Route path="users/registered" element={<Users />} />
                <Route path="users/pending" element={<Users />} />
                <Route path="users/rejected" element={<Users />} />
                <Route path="users/total" element={<Users />} />
              </>
            )}

            {/* Client/User routes */}
            {user.role === "user" && (
              <>
                <Route path="trading" element={<TradingApp />} />
                <Route path="orders" element={<Orders />} />
                <Route path="support" element={<Support />} />
                <Route path="profile" element={<Profile />} />
              </>
            )}
          </Route>
        ) : (
          // If not logged in, always show login page
          <Route path="/" element={<LoginPage setUser={setUser} />} />
        )}

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
