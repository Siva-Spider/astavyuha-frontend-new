import { useEffect } from "react";

let ws = null; // shared instance inside the file

export default function LogStream({ onMessage, active }) {
  
  useEffect(() => {
    if (!active) {
      if (ws) {
        console.log("🔴 Closing WS because trading inactive...");
        ws.close();
        ws = null;
      }
      return;
    }

    if (!ws) {
      console.log("🟢 Opening WS...");
      ws = new WebSocket("ws://127.0.0.1:8000/ws/logs");

      ws.onopen = () => console.log("📡 WebSocket connected.");

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch {
          console.warn("WS data error:", event.data);
        }
      };

      ws.onclose = () => {
        console.log("🔻 WS closed");
        ws = null;
      };
    }

    return () => {
      if (!active && ws) {
        ws.close();
        ws = null;
      }
    };
  }, [active]);

  return null;
}
