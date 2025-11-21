import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Users as UsersIcon,
  Settings,
  ShoppingBag,
  MessageCircle,
  LogOut,
  User as UserIcon,
} from "lucide-react";

export default function Sidebar({ userRole, setUser }) {
  const [collapsed, setCollapsed] = React.useState(false);
  const isAdmin = userRole === "admin";

  const adminMenu = [
    { name: "Dashboard", path: "/", icon: <Home size={18} /> },
    {
      name: "Users",
      icon: <UsersIcon size={18} />,
      subItems: [
        { name: "Registered Users", path: "/users/registered" },
        { name: "Pending Registered", path: "/users/pending" },
        { name: "Rejected Registered", path: "/users/rejected" },
        { name: "Total Registrations", path: "/users/total" },
      ],
    },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  const clientMenu = [
    { name: "Dashboard", path: "/", icon: <Home size={18} /> },
    { name: "Trading", path: "/trading", icon: <Settings size={18} /> },
    { name: "Orders", path: "/orders", icon: <ShoppingBag size={18} /> },
    { name: "Support", path: "/support", icon: <MessageCircle size={18} /> },
    { name: "Profile", path: "/profile", icon: <UserIcon size={18} /> },
  ];

  const menus = isAdmin ? adminMenu : clientMenu;

  return (
    <aside
      style={{
        position: "relative",
        width: collapsed ? "60px" : "240px",
        backgroundColor: "#9399ec",
        color: "white",
        padding: collapsed ? "1rem 0.3rem" : "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        overflow: "hidden",
        transition: "width 0.3s ease",
      }}
    >
      {/* Collapse / Expand Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute",
          top: "25px",
          right: "-10px",
          width: "26px",
          height: "36px",                // smaller height
          borderRadius: "6px",           // rounded corners
          border: "1px solid #0d581aff",   // dark green border
          backgroundColor: "#00ff2aff",    // DARK GREEN color
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.25)",
          zIndex: 999,
          transition: "all 0.2s ease",
        }}
      >
        {collapsed ? ">>" : "<<"}
      </button>



      {/* Title */}
      {!collapsed && (
        <h2 style={{ fontSize: "1.2rem", marginBottom: "1.5rem" }}>
          {isAdmin ? "ADMIN PANEL" : "CLIENT PANEL"}
        </h2>
      )}

      {/* Menu */}
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {menus.map((item) => (
            <li key={item.name} style={{ marginBottom: "0.5rem" }}>
              {item.subItems ? (
                !collapsed && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: "bold",
                        marginBottom: "0.3rem",
                      }}
                    >
                      {item.icon}
                      <span style={{ marginLeft: "0.5rem" }}>{item.name}</span>
                    </div>
                    <ul style={{ listStyle: "none", paddingLeft: "1.5rem" }}>
                      {item.subItems.map((sub) => (
                        <li key={sub.name}>
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              isActive ? "active-sidebar-link" : "sidebar-link"
                            }
                            style={{
                              display: "block",
                              padding: "0.4rem 0",
                              color: "white",
                              textDecoration: "none",
                              borderRadius: "6px",
                            }}
                          >
                            {sub.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? "active-sidebar-link" : "sidebar-link"
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "6px",
                  }}
                >
                  {item.icon}
                  <span
                    style={{
                      marginLeft: "0.6rem",
                      display: collapsed ? "none" : "inline",
                    }}
                  >
                    {item.name}
                  </span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      {!collapsed && (
        <button
          onClick={() => {
            setUser(null);
            localStorage.removeItem("user");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "0.8rem",
            cursor: "pointer",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <LogOut size={18} style={{ marginRight: "0.5rem" }} />
          Logout
        </button>
      )}
    </aside>

  );
}
