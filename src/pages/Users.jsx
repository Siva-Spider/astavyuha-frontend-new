import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { apiGet, apiPost } from "../api"; // ✅ shared API helpers

export default function Users() {
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [loading, setLoading] = useState(false);

  // Extract category from URL
  const path = location.pathname;
  let selectedCategory = "registered";
  if (path.includes("pending")) selectedCategory = "pending";
  else if (path.includes("rejected")) selectedCategory = "rejected";
  else if (path.includes("total")) selectedCategory = "total";

  // Fetch users from backend
  useEffect(() => {
    fetchUsers();
  }, [selectedCategory]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const data = await apiGet("/users");
      setUsers(data.users || []);
      setPending(data.pending || []);
      setRejected(data.rejected || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      setPending([]);
      setRejected([]);
    } finally {
      setLoading(false);
    }
  }

  // Actions
  async function handleApprove(userId) {
    try {
      const res = await apiPost(`/admin/approve/${userId}`);
      if (res.success) {
        alert("User approved successfully!");
        fetchUsers();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error approving user.");
    }
  }

  async function handleReject(userId) {
    try {
      const res = await apiPost(`/admin/reject/${userId}`);
      if (res.success) {
        alert("User rejected successfully!");
        fetchUsers();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error rejecting user.");
    }
  }

  async function handleDelete(userId) {
    try {
      const res = await apiPost(`/admin/delete-user/${userId}`);
      if (res.success) {
        alert("User deleted successfully!");
        fetchUsers();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user.");
    }
  }
  async function handleDeleterejected(userId) {
    try {
      const res = await apiPost(`/admin/delete-rejected/${userId}`);
      if (res.success) {
        alert("User deleted successfully!");
        fetchUsers();
        setSelectedUser(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting user.");
    }
  }

  async function handleResetPassword(userId) {
    try {
      const res = await apiPost(`/admin/reset-password/${userId}`);
      if (res.success) {
        alert("Password reset successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error resetting password.");
    }
  }

  // Filter users based on category
  const getFilteredUsers = () => {
    if (selectedCategory === "registered") return users;
    if (selectedCategory === "pending") return pending;
    if (selectedCategory === "rejected") return rejected;
    return []; // total list is shown only as count
  };

  const filteredUsers = getFilteredUsers().filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  // Action buttons
  const renderActionButtons = () => {
    if (!selectedUser) return null;
    switch (selectedCategory) {
      case "registered":
        return (
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button
              style={actionBtnStyle}
              onClick={() => handleResetPassword(selectedUser.userId)}
            >
              Reset Password
            </button>
            <button
              style={{ ...actionBtnStyle, backgroundColor: "#dc3545" }}
              onClick={() => handleDelete(selectedUser.userId)}
            >
              Delete User
            </button>
          </div>
        );

      case "pending":
        return (
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button
              style={{ ...actionBtnStyle, backgroundColor: "#28a745" }}
              onClick={() => handleApprove(selectedUser.userId)}
            >
              Approve
            </button>
            <button
              style={{ ...actionBtnStyle, backgroundColor: "#dc3545" }}
              onClick={() => handleReject(selectedUser.userId)}
            >
              Reject
            </button>
          </div>
        );

      case "rejected":
        return (
          <div style={{ marginTop: "1rem" }}>
            <button
              style={{ ...actionBtnStyle, backgroundColor: "#dc3545" }}
              onClick={() => handleDeleterejected(selectedUser.userId)}
            >
              Delete
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const actionBtnStyle = {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: "1rem" }}>
      {/* Left column: list */}
      <div style={{ width: "40%", borderRight: "1px solid #ddd", paddingRight: "1rem" }}>
        <h2 style={{ textTransform: "capitalize" }}>
          {selectedCategory} Users{" "}
          {selectedCategory === "total" &&
            `(Total: ${users.length + pending.length + rejected.length})`}
        </h2>
        {selectedCategory !== "total" && (
          <>
            <p style={{ color: "#777" }}>Total Users: {filteredUsers.length}</p>
            <input
              type="text"
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginBottom: "1rem",
              }}
            />
          </>
        )}

        {loading ? (
          <p>Loading users...</p>
        ) : selectedCategory === "total" ? (
          <p style={{ color: "#777" }}>
            Total Registered: {users.length}, Pending: {pending.length}, Rejected: {rejected.length}
          </p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {filteredUsers.map((user) => (
              <li
                key={user.userId}
                onClick={() => setSelectedUser(user)}
                style={{
                  padding: "0.8rem",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                  cursor: "pointer",
                  backgroundColor:
                    selectedUser?.userId === user.userId ? "#6f42c1" : "#f2f2f2",
                  color: selectedUser?.userId === user.userId ? "white" : "black",
                }}
              >
                {user.username}
              </li>
            ))}
            {filteredUsers.length === 0 && <p style={{ color: "#888" }}>No users found.</p>}
          </ul>
        )}
      </div>

      {/* Right column: details */}
      <div style={{ flex: 1, paddingLeft: "1rem" }}>
        {selectedUser ? (
          <div>
            <h3>User Details</h3>
            <p><strong>User ID:</strong> {selectedUser.userId}</p>
            <p><strong>Name:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Mobile:</strong> {selectedUser.mobilenumber}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            {renderActionButtons()}
          </div>
        ) : (
          <p style={{ color: "#777" }}>Select a user to view details.</p>
        )}
      </div>
    </div>
  );
}
