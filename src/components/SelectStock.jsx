import { useState } from 'react';

const SelectStock = (props) => {
    const { 
        stockCount, 
        tradingParameters, 
        selectedBrokers, 
        onStockCountChange, 
        onParameterChange, 
        onStockSelection,
        tradingStatus, 
        onTradeToggle, 
        onStartAllTrades, 
        onClosePosition,
        onCloseAllPositions,
        selectionType,
        setSelectionType
    } = props;

    const stock_map = {
        "RELIANCE INDUSTRIES LTD": "RELIANCE",
        "HDFC BANK LTD": "HDFCBANK",
        "ICICI BANK LTD.": "ICICIBANK",
        "INFOSYS LIMITED": "INFY",
        "TATA CONSULTANCY SERV LT": "TCS",
        "STATE BANK OF INDIA": "SBIN",
        "AXIS BANK LTD": "AXISBANK",
        "KOTAK MAHINDRA BANK LTD": "KOTAKBANK",
        "ITC LTD": "ITC",
        "LARSEN & TOUBRO LTD.": "LT",
        "BAJAJ FINANCE LIMITED": "BAJFINANCE",
        "HINDUSTAN UNILEVER LTD": "HINDUNILVR",
        "SUN PHARMACEUTICAL IND L": "SUNPHARMA",
        "MARUTI SUZUKI INDIA LTD": "MARUTI",
        "NTPC LTD": "NTPC",
        "HCL TECHNOLOGIES LTD": "HCLTECH",
        "ULTRATECH CEMENT LIMITED": "ULTRACEMCO",
        "TATA MOTORS LIMITED": "TATAMOTORS",
        "TITAN COMPANY LIMITED": "TITAN",
        "BHARAT ELECTRONICS LTD": "BEL",
        "POWER GRID CORP. LTD": "POWERGRID",
        "TATA STEEL LIMITED": "TATASTEEL",
        "TRENT LTD": "TRENT",
        "ASIAN PAINTS LIMITED": "ASIANPAINT",
        "JIO FIN SERVICES LTD": "JIOFIN",
        "BAJAJ FINSERV LTD": "BAJAJFINSV",
        "GRASIM INDUSTRIES LTD": "GRASIM",
        "ADANI PORT & SEZ LTD": "ADANIPORTS",
        "JSW STEEL LIMITED": "JSWSTEEL",
        "HINDALCO INDUSTRIES LTD": "HINDALCO",
        "OIL AND NATURAL GAS CORP": "ONGC",
        "TECH MAHINDRA LIMITED": "TECHM",
        "BAJAJ AUTO LIMITED": "BAJAJ-AUTO",
        "SHRIRAM FINANCE LIMITED": "SHRIRAMFIN",
        "CIPLA LTD": "CIPLA",
        "COAL INDIA LTD": "COALINDIA",
        "SBI LIFE INSURANCE CO LTD": "SBILIFE",
        "HDFC LIFE INS CO LTD": "HDFCLIFE",
        "NESTLE INDIA LIMITED": "NESTLEIND",
        "DR. REDDY S LABORATORIES": "DRREDDY",
        "APOLLO HOSPITALS ENTER. L": "APOLLOHOSP",
        "EICHER MOTORS LTD": "EICHERMOT",
        "WIPRO LTD": "WIPRO",
        "TATA CONSUMER PRODUCT LTD": "TATACONSUM",
        "ADANI ENTERPRISES LIMITED": "ADANIENT",
        "HERO MOTOCORP LIMITED": "HEROMOTOCO",
        "INDUSIND BANK LIMITED": "INDUSINDBK",
        "Nifty 50": "NIFTY",
        "Nifty Bank": "BANKNIFTY",
        "Nifty Fin Service": "FINNIFTY",
        "NIFTY MID SELECT": "MIDCPNIFTY",
    };

    const commodity_map = {
        "GOLD": ["GOLDM", "GOLD"],
        "COPPER": ["COPPER"],
        "CRUDE OIL": ["CRUDEOIL", "CRUDEOILM"],
        "NATURALGAS": ["NATURALGAS", "NATGASMINI"],
        "SILVER": ["SILVER", "SILVERM"],
        "ZINC": ["ZINC"]
    };

    const broker_map = {
        "u": "Upstox",
        "z": "Zerodha",
        "a": "AngelOne",
        "g": "Groww",
        "5": "5paisa"
    };

    const connectedBrokers = selectedBrokers.filter(
        (broker) => broker.profileData && broker.profileData.status === "success"
    );

    return (
        <div style={{ padding: "20px" }}>
            <h2>Select Stocks / Commodities</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <div style={{ marginBottom: "15px", display: "flex", gap: "20px", alignItems: "center" }}>
                    <label>
                        Number of Stocks (1-10):
                        <input 
                            type="number" 
                            min="1" 
                            max="10" 
                            value={stockCount} 
                            onChange={onStockCountChange} 
                            style={{ marginLeft: "10px" }} 
                        />
                    </label>
                    <label>
                        Select Type:
                        <select 
                            value={selectionType} 
                            onChange={(e) => setSelectionType(e.target.value)} 
                            style={{ marginLeft: "10px" }}
                        >
                            <option value="EQUITY">EQUITY</option>
                            <option value="COMMODITY">COMMODITY</option>
                        </select>
                    </label>
                </div>

                {Array.from({ length: stockCount }).map((_, index) => {
                    const key = `stock_${index}`;
                    const currentParams = tradingParameters[key] || { symbol_key: "", symbol_value: "" };
                    const isTrading = tradingStatus[key] === "active";

                    return (
                        <div
                            key={key}
                            style={{
                                marginTop: "15px",
                                marginBottom: "10px",
                                display: "flex",
                                alignItems: "center",
                                flexWrap: "wrap",
                                border: "1px solid #ccc",
                                padding: "15px",
                                borderRadius: "5px",
                                gap: "10px"
                            }}
                        >
                            {/* Stock / Commodity selection */}
                            <div style={{ marginRight: "10px", minWidth: "200px" }}>
                                {selectionType === "EQUITY" ? (
                                    <label>
                                        Stock {index + 1}:
                                        <select
                                            value={Object.keys(stock_map).find(k => stock_map[k] === currentParams.symbol_value) || "RELIANCE INDUSTRIES LTD"}
                                            onChange={(e) => {
                                                const newStockName = e.target.value;
                                                const newSymbol = stock_map[newStockName];
                                                onParameterChange({ target: { value: "EQUITY" } }, index, "type");
                                                onStockSelection(index, newStockName, newSymbol, "EQUITY");
                                            }}
                                            style={{ marginLeft: "10px", width: "150px" }}
                                        >
                                            {Object.keys(stock_map).map(stockName => (
                                                <option key={stockName} value={stockName}>{stockName}</option>
                                            ))}
                                        </select>
                                    </label>
                                ) : (
                                    <div style={{ display: "flex", gap: "10px" }}>
                                        <label>
                                            Commodity Group:
                                            <select
                                                value={currentParams.symbol_key || ""}
                                                onChange={(e) => onParameterChange(e, index, "symbol_key")}
                                                style={{ marginLeft: "10px", width: "150px" }}
                                            >
                                                <option value="">Select Group</option>
                                                {Object.keys(commodity_map).map(key => (
                                                    <option key={key} value={key}>{key}</option>
                                                ))}
                                            </select>
                                        </label>

                                        <label>
                                            Symbol:
                                            <select
                                                value={currentParams.symbol_value || ""}
                                                onChange={(e) => {
                                                    onStockSelection(index, currentParams.symbol_key, e.target.value, "COMMODITY");
                                                }}
                                                style={{ marginLeft: "10px", width: "150px" }}
                                                disabled={!currentParams.symbol_key}
                                            >
                                                <option value="">Select Symbol</option>
                                                {currentParams.symbol_key && Array.isArray(commodity_map[currentParams.symbol_key]) &&
                                                    commodity_map[currentParams.symbol_key].map(val => (
                                                        <option key={val} value={val}>{val}</option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Broker */}
                            <div style={{ marginRight: "10px" }}>
                                <label>
                                    Broker:
                                    <select
                                        value={currentParams.broker || ""}
                                        onChange={(e) => onParameterChange(e, index, "broker")}
                                        style={{ marginLeft: "10px", width: "110px" }}
                                    >
                                        <option value="">Select</option>
                                        {connectedBrokers.map((broker, idx) => (
                                            <option key={idx} value={broker.name}>{broker_map[broker.name]}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            {/* Strategy */}
                            <div style={{ marginRight: "10px" }}>
                                <label>
                                    Strategy:
                                    <select
                                        value={currentParams.strategy || "ADX_MACD_WillR_Supertrend"}
                                        onChange={(e) => onParameterChange(e, index, "strategy")}
                                        style={{ marginLeft: "10px", width: "150px" }}
                                    >
                                        <option value="ADX_MACD_WillR_Supertrend">
                                            ADX_MACD_WillR_Supertrend
                                        </option>
                                        <option value="Ema10_Ema20_Supertrend">
                                            Ema10_Ema20_Supertrend
                                        </option>
                                        <option value="Ema10_Ema20_MACD_Supertrend">
                                            Ema10_Ema20_MACD_Supertrend
                                        </option>
                                    </select>
                                </label>
                            </div>

                            {/* Interval */}
                            <div style={{ marginRight: "10px" }}>
                                <label>
                                    Interval:
                                    <select
                                        value={currentParams.interval || "0"}
                                        onChange={(e) => onParameterChange(e, index, "interval")}
                                        style={{ marginLeft: "10px", width: "60px" }}
                                    >
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="5">5</option>
                                        <option value="15">15</option>
                                        <option value="30">30</option>
                                        <option value="60">60</option>
                                    </select>
                                </label>
                            </div>

                            {/* Lots */}
                            <div style={{ marginRight: "10px" }}>
                                <label>
                                    Lots:
                                    <input
                                        type="number"
                                        min="0"
                                        value={currentParams.lots || 0}
                                        onChange={(e) => onParameterChange(e, index, "lots")}
                                        style={{ marginLeft: "10px", width: "60px" }}
                                    />
                                </label>
                            </div>

                            {/* Lot Size */}
                            <div style={{ marginRight: "10px" }}>
                                <label>
                                    Lot Size:
                                    <input
                                        type="number"
                                        min="0"
                                        value={currentParams.lot_size || 0}
                                        readOnly
                                        style={{
                                            marginLeft: "10px",
                                            width: "60px",
                                            backgroundColor: "#f0f0f0",
                                        }}
                                    />
                                </label>
                            </div>
                            {/* Tick Size */}
                            <div style={{ marginRight: "10px" }}>
                                <label>
                                    Tick Size:
                                    <input
                                        type="number"
                                        min="0"
                                        value={currentParams.tick_size || 0}
                                        readOnly
                                        style={{
                                            marginLeft: "10px",
                                            width: "60px",
                                            backgroundColor: "#f0f0f0",
                                        }}
                                    />
                                </label>
                            </div>

                            {/* Total Shares */}
                            <div style={{ marginRight: "10px" }}>
                                <p style={{ margin: 0, whiteSpace: "nowrap" }}>
                                    Shares: {currentParams.total_shares || 0}
                                </p>
                                {currentParams.tick_size !== undefined && (
                                    <p style={{ margin: 0, whiteSpace: "nowrap" }}>
                                        Tick Size: {currentParams.tick_size}
                                    </p>
                                )}
                            </div>

                            {/* Target % */}
                            <div style={{ marginRight: "10px" }}>
                                <label>
                                    Target %:
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={currentParams.target_percentage || 0}
                                        onChange={(e) => onParameterChange(e, index, "target_percentage")}
                                        style={{ marginLeft: "10px", width: "60px" }}
                                    />
                                </label>
                            </div>

                            {/* Individual Buttons */}
                            {isTrading && (
                                <>
                                    <button 
                                        type="button" 
                                        onClick={() => onTradeToggle(index)}
                                        style={{ 
                                            marginTop: '0px', 
                                            backgroundColor: '#dc3545', 
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Disconnect
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => onClosePosition(index)}
                                        style={{ 
                                            marginLeft: '10px', 
                                            backgroundColor: '#007bff', 
                                            color: 'white',
                                            border: 'none',
                                            padding: '8px 12px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Close
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}

                {/* Start All Trades */}
                <div style={{ marginTop: "20px" }}>
                    <button 
                        type="button"
                        onClick={onStartAllTrades}
                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 15px', cursor: 'pointer' }}
                    >
                        Start All Trades
                    </button>
                    <button 
                        type="button"
                        onClick={onCloseAllPositions}
                        style={{ marginLeft: '10px', backgroundColor: '#ffc107', color: 'black', border: 'none', padding: '10px 15px', cursor: 'pointer' }}
                    >
                        Close All Positions
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SelectStock;
