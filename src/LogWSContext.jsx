// src/LogWSContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const LogWSContext = createContext(null);

export const useLogWS = () => useContext(LogWSContext);

export const LogWSProvider = ({ children }) => {
  const wsRef = useRef(null);
  const callbacksRef = useRef(new Set()); // optional per-component callbacks
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("tradeLogs");
    return saved ? JSON.parse(saved) : [];
  });
  const [isConnected, setIsConnected] = useState(false);

  // internal handler that pushes message to state and invokes callbacks
  const handleMessage = (ev) => {
    let m;
    try {
      m = JSON.parse(ev.data);
    } catch {
      m = ev.data;
    }

    // format similarly to your existing handler if needed
    let text = "";
    if (!m) return;
    if (typeof m === "string") text = m;
    else if (m.message) text = m.message;
    else if (m.data) text = m.data;
    else text = JSON.stringify(m);

    const ts = m.ts || new Date().toISOString();
    const level = (m.level || "INFO").toUpperCase();
    const formatted = `[${ts}] ${level}: ${text}`;

    setMessages((prev) => {
      const next = [...prev.slice(-999), formatted];
      localStorage.setItem("tradeLogs", JSON.stringify(next)); // persist like your app
      return next;
    });

    // notify any registered callbacks (components that want immediate raw payload)
    callbacksRef.current.forEach((cb) => {
      try { cb(m); } catch (e) { console.error("callback error", e); }
    });
  };

  const startLogs = (url = "ws://127.0.0.1:8000/ws/logs") => {
    
    if (wsRef.current) return; // already open
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onopen = () => {
      console.log("📡 LogWS connected");
      setIsConnected(true);
    };

    ws.onmessage = handleMessage;

    ws.onclose = () => {
      console.log("🔻 LogWS closed");
      wsRef.current = null;
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error("LogWS error", err);
    };
  };

  const stopLogs = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  };

  // allow components to register a callback to receive raw message objects
  const subscribe = (cb) => {
    callbacksRef.current.add(cb);
    return () => callbacksRef.current.delete(cb);
  };

  // cleanup on unmount of provider (rare — app stays mounted)
  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <LogWSContext.Provider value={{ messages, isConnected, startLogs, stopLogs, subscribe }}>
      {children}
    </LogWSContext.Provider>
  );
};
