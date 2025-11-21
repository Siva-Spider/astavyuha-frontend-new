import React, { useEffect, useState } from "react";
import { useLogWS } from "./LogWSContext";

export default function LogStream() {
  const { messages } = useLogWS();
  const [visibleLogs, setVisibleLogs] = useState([]);

  useEffect(() => {
    setVisibleLogs(messages);
  }, [messages]);

  const getColorClass = (msg) => {
  if (typeof msg === "string") {
    const lower = msg.toLowerCase();

    if (lower.includes("buy signal generated")) return "signal-buy";
    if (lower.includes("sell signal generated")) return "signal-sell";
    if (lower.includes("no trade signal generated")) return "signal-none";
  }
  return "";
};

  return (
    <div className="log-container">
      {visibleLogs.map((msg, index) => (
        <div key={index} className={`log-line ${getColorClass(msg)}`}>
          {msg}
        </div>
      ))}
    </div>
  );
}
