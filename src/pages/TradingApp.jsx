import { useState, useEffect, useRef } from "react";
import ConnectBroker from "../components/ConnectBroker";
import SelectStock from "../components/SelectStock";
import TradeResults from "../components/TradeResults";
import { useLogWS } from "../LogWSContext";
import { API_BASE } from "../api";
import "../TradingApp.css";

function TradingApp({ user, setUser }) {
    // -------------------------------------------------
    // 🔥 Persistent App State
    // -------------------------------------------------
    const [activeTab, setActiveTab] = useState(() => localStorage.getItem("activeTab") || "connect");
    const [brokerCount, setBrokerCount] = useState(() => parseInt(localStorage.getItem("brokerCount")) || 1);
    const { startLogs, stopLogs, subscribe } = useLogWS();

    const userId = user?.userid || user?.userId || "guest";

    const [selectedBrokers, setSelectedBrokers] = useState(() => {
        const saved = localStorage.getItem("selectedBrokers");
        return saved ? JSON.parse(saved) : [{ name: "u", credentials: {}, profileData: null }];
    });

    const [stockCount, setStockCount] = useState(() => parseInt(localStorage.getItem("stockCount")) || 1);

    const [tradingParameters, setTradingParameters] = useState(() => {
        const saved = localStorage.getItem("tradingParameters");
        return saved ? JSON.parse(saved) : {};
    });

    const [tradingStatus, setTradingStatus] = useState(() => {
        const saved = localStorage.getItem("tradingStatus");
        return saved ? JSON.parse(saved) : {};
    });

    // -------------------------------------------------
    // 🔥 FIXED: Restore logs directly inside useState (no wiping)
    // -------------------------------------------------
    const [tradeLogs, setTradeLogs] = useState(() => {
        const saved = localStorage.getItem("tradeLogs");
        return saved ? JSON.parse(saved) : [];
    });

    const [payloads, setPayloads] = useState([]);
    const [isTradingActive, setIsTradingActive] = useState(false);
    const wsRef = useRef(null);

    // -------------------------------------------------
    // 🔥 Persist everything except WebSocket
    // -------------------------------------------------
    useEffect(() => localStorage.setItem(`${userId}_activeTab`, activeTab), [activeTab]);
    useEffect(() => localStorage.setItem(`${userId}_brokerCount`, brokerCount), [brokerCount]);
    useEffect(() => localStorage.setItem(`${userId}_selectedBrokers`, JSON.stringify(selectedBrokers)), [selectedBrokers]);
    useEffect(() => localStorage.setItem(`${userId}_stockCount`, stockCount), [stockCount]);
    useEffect(() => localStorage.setItem(`${userId}_tradingParameters`, JSON.stringify(tradingParameters)), [tradingParameters]);
    useEffect(() => localStorage.setItem(`${userId}_tradingStatus`, JSON.stringify(tradingStatus)), [tradingStatus]);
    useEffect(() => localStorage.setItem(`${userId}_tradeLogs`, JSON.stringify(tradeLogs)), [tradeLogs]);

    const [selectionType, setSelectionType] = useState(() => localStorage.getItem(`${userId}selectionType`) || "EQUITY");
    useEffect(() => localStorage.setItem(`${userId}_selectionType`, selectionType), [selectionType]);

    useEffect(() => {
        const active = Object.values(tradingStatus).includes("active");
        setIsTradingActive(active);
    }, [tradingStatus]);

    // -------------------------------------------------
    // 🔥 Log Handler (Keep last 1000)
    // -------------------------------------------------
    const handleNewLog = (msg) => {
    if (!msg) return;

    let text = "";

    if (typeof msg === "string") {
        text = msg;
    } else if (msg.message) {
        text = msg.message;
    } else if (msg.data) {
        text = msg.data;
    } else {
        text = JSON.stringify(msg);
    }

    const ts = msg.ts || new Date().toISOString();
    const level = (msg.level || "INFO").toUpperCase();

    const formatted = `[${ts}] ${level}: ${text}`;

    setTradeLogs(prev => [...prev.slice(-999), formatted]);
};

    // -------------------------------------------------
    // 🔥 Subscribe to raw WebSocket messages
    // -------------------------------------------------
    useEffect(() => {
        const unsubscribe = subscribe((msg) => {
            handleNewLog(msg);
        });
        return () => unsubscribe();
    }, []);


    // -------------------------------------------------
    // 🔥 Logout
    // -------------------------------------------------
    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        setActiveTab("connect");
        setBrokerCount(1);
        setSelectedBrokers([{ name: "u", credentials: {}, profileData: null }]);
        setTradingParameters({});
        setTradingStatus({});
        setTradeLogs([]);
        setSelectionType("EQUITY");
    };

    // -------------------------------------------------
    // 🔥 API FUNCTIONS
    // -------------------------------------------------
    const handleConnectBroker = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/connect-broker`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ brokers: selectedBrokers }),
            });

            const data = await res.json();

            setSelectedBrokers((prev) =>
                prev.map((broker) => {
                    const fetched = data.find((b) => b.broker_key === broker.name);
                    if (fetched?.status === "success")
                        return { ...broker, profileData: fetched.profileData };
                    return { ...broker, profileData: { status: "failed", message: fetched?.message || "Connection failed." } };
                })
            );
        } catch (err) {
            console.error(err);
            setTradeLogs((prev) => [...prev, "❌ Error connecting broker"]);
        }
    };

    const fetchLotSize = async (index, symbol_key, symbol_value, type) => {
        try {
            const response = await fetch(`${API_BASE}/get-lot-size`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symbol_key, symbol_value, type }),
            });
            const data = await response.json();

            if (data.lot_size) {
                const key = `stock_${index}`;
                const lotSize = data.lot_size;
                const tickSize = data.tick_size || 0;
                const lots = tradingParameters[key]?.lots || 0;

                setTradingParameters((prev) => ({
                    ...prev,
                    [key]: {
                        ...prev[key],
                        lot_size: lotSize,
                        tick_size: tickSize,
                        total_shares: lots * lotSize,
                    },
                }));
            }
        } catch (err) {
            console.error("Error fetching lot size:", err);
        }
    };

    const handleTradeToggle = async (index) => {
        const key = `stock_${index}`;
        const status = tradingStatus[key];
        const symbol = tradingParameters[key]?.symbol_value;

        if (status === "active") {
            try {
                const res = await fetch(`${API_BASE}/disconnect-stock`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ symbol_value: symbol }),
                });
                const data = await res.json();
                setTradingStatus((prev) => ({ ...prev, [key]: "inactive" }));
                setTradeLogs((prev) => [...prev, data.message]);
            } catch (err) {
                setTradeLogs((prev) => [...prev, `❌ Error disconnecting ${symbol}`]);
            }
            return;
        }

        setTradingStatus((prev) => ({ ...prev, [key]: "active" }));
        setTradeLogs((prev) => [...prev, `🟢 Initiating trade for ${symbol}`]);
        setActiveTab("results");
    };

    const handleStartAllTrades = async () => {
        console.log("🔥 handleStartAllTrades triggered");
        setActiveTab("results");

        const params = [];
        for (let i = 0; i < stockCount; i++) {
            const key = `stock_${i}`;
            const p = tradingParameters[key];
            if (p?.broker) params.push(p);
            else setTradeLogs((prev) => [...prev, `❌ Select a broker for stock ${i + 1}`]);
        }
        if (params.length === 0) return;

        try {
            setTradeLogs((prev) => [...prev, "🟢 Starting all trades..."]);
            console.log("🔥🔥 TEST A: EXECUTION REACHED HERE — BEFORE FETCH");
            const res = await fetch(`${API_BASE}/start-all-trading`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tradingParameters: params, selectedBrokers }),
            });
            console.log("🔥 Collected params =", params);
            const data = await res.json();
            
            let newStatus = {};
            params.forEach((_, i) => (newStatus[`stock_${i}`] = "active"));

            setTradingStatus((prev) => ({ ...prev, ...newStatus }));

            if (data?.logs) setTradeLogs((prev) => [...prev, ...data.logs]);
            setIsTradingActive(true);
            startLogs(); 
        } catch (err) {
            setTradeLogs((prev) => [...prev, "❌ Error starting trades"]);
        }
    };

    const handleClosePosition = async (index) => {
        const key = `stock_${index}`;
        const symbol = tradingParameters[key]?.symbol_value;
        try {
            const res = await fetch(`${API_BASE}/close-position`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symbol_value: symbol }),
            });
            const data = await res.json();
            setTradeLogs((prev) => [...prev, data.message]);
        } catch (err) {
            setTradeLogs((prev) => [...prev, `❌ Error closing ${symbol}`]);
        }
    };

    const handleCloseAll = async () => {
        stopLogs();
        setIsTradingActive(false);
        try {
            const res = await fetch(`${API_BASE}/close-all-positions`, { method: "POST" });
            const data = await res.json();
            setTradeLogs((prev) => [...prev, data.message]);
        } catch (err) {
            setTradeLogs((prev) => [...prev, "❌ Error closing all positions"]);
        }
    };

    const handleClearLogs = () => setTradeLogs([]);

    // -------------------------------------------------
    // 🔥 PAGE RENDERING
    // -------------------------------------------------
    const renderContent = () => {
        switch (activeTab) {
            case "connect":
                return (
                    <ConnectBroker
                        brokerCount={brokerCount}
                        selectedBrokers={selectedBrokers}
                        onBrokerCountChange={(e) => {
                            const count = parseInt(e.target.value);
                            setBrokerCount(count);
                            const updated = [...selectedBrokers].slice(0, count);
                            while (updated.length < count) updated.push({ name: "u", credentials: {}, profileData: null });
                            setSelectedBrokers(updated);
                        }}
                        onBrokerChange={(e, index) => {
                            const updated = [...selectedBrokers];
                            updated[index].name = e.target.value;
                            updated[index].profileData = null;
                            setSelectedBrokers(updated);
                        }}
                        onCredentialChange={(e, index, cred) => {
                            const updated = [...selectedBrokers];
                            updated[index].credentials[cred] = e.target.value;
                            setSelectedBrokers(updated);
                        }}
                        onConnect={handleConnectBroker}
                    />
                );

            case "select":
                return (
                    <SelectStock
                        stockCount={stockCount}
                        tradingParameters={tradingParameters}
                        selectedBrokers={selectedBrokers}
                        tradingStatus={tradingStatus}
                        selectionType={selectionType}
                        setSelectionType={setSelectionType}
                        onStockCountChange={(e) => {
                            const count = parseInt(e.target.value);
                            setStockCount(count);

                            let params = {};
                            let status = {};
                            for (let i = 0; i < count; i++) {
                                const k = `stock_${i}`;
                                params[k] =
                                    tradingParameters[k] ||
                                    {
                                        symbol_value: "RELIANCE",
                                        symbol_key: "",
                                        broker: "",
                                        strategy: "ADX_MACD_WillR_Supertrend",
                                        interval: 0,
                                        lots: 0,
                                        lot_size: 0,
                                        total_shares: 0,
                                        target_percentage: 0,
                                        type: "EQUITY",
                                    };
                                status[k] = tradingStatus[k] || "inactive";
                            }

                            setTradingParameters(params);
                            setTradingStatus(status);
                        }}
                        onStockSelection={(i, key, val, type) => {
                            const stockKey = `stock_${i}`;
                            setTradingParameters((prev) => ({
                                ...prev,
                                [stockKey]: { ...prev[stockKey], symbol_key: key, symbol_value: val, type },
                            }));
                            fetchLotSize(i, key, val, type);
                        }}
                        onParameterChange={(e, i, field) => {
                            const stockKey = `stock_${i}`;
                            const val = e.target.value;

                            setTradingParameters((prev) => {
                                const updated = { ...prev };
                                updated[stockKey][field] = val;

                                const lots = parseInt(updated[stockKey].lots || 0);
                                const size = parseInt(updated[stockKey].lot_size || 0);
                                updated[stockKey].total_shares = lots * size;

                                return updated;
                            });
                        }}
                        onTradeToggle={handleTradeToggle}
                        onStartAllTrades={handleStartAllTrades}
                        onClosePosition={handleClosePosition}
                        onCloseAllPositions={handleCloseAll}
                    />
                );

            case "results":
                return (
                    <TradeResults
                        tradeLogs={tradeLogs}
                        onClearLogs={handleClearLogs}
                        onLog={handleNewLog}
                        isTradingActive={isTradingActive}
                    />
                );

            default:
                return <div>Invalid tab</div>;
        }
    };

    return (
        <div className="trading-app-container">
            <header className="trading-header">
                {user && <button className="logout-btn" onClick={handleLogout}>Logout</button>}
            </header>

            <div className="trading-main">
                <div className="tab-buttons">
                    <button onClick={() => setActiveTab("connect")} className={activeTab === "connect" ? "active" : ""}>Connect Broker</button>
                    <button onClick={() => setActiveTab("select")} className={activeTab === "select" ? "active" : ""}>Select Stock</button>
                    <button onClick={() => setActiveTab("results")} className={activeTab === "results" ? "active" : ""}>Trade Results</button>
                </div>

                <div className="trading-content">{renderContent()}</div>
            </div>
        </div>
    );
}

export default TradingApp;
