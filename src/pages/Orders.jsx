import React, { useState, useEffect } from "react";
import { apiPost } from "../api"; // adjust import path as per your structure

export default function Orders() {
  const [accessToken, setAccessToken] = useState("");
  const [segment, setSegment] = useState("FO");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [trades, setTrades] = useState([]);
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalProfit, setTotalProfit] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);
  const [totalCharges, setTotalCharges] = useState(0);
  const [totalNet, setTotalNet] = useState(0);
  const [showChargesTable, setShowChargesTable] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const thStyle = {
    padding: "8px",
    border: "1px solid #ccc",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
    whiteSpace: "nowrap"
  };
  const tdStyle = { padding: "6px", border: "1px solid #ccc", textAlign: "center", whiteSpace: "nowrap" };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Generate financial years
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      years.push(`${i}-${i + 1}`);
    }
    setAvailableYears(years.reverse());
  }, []);

  // Compute totals
  useEffect(() => {
    let profit = 0, loss = 0;
    trades.forEach(t => {
      const pl = t.sell_amount - t.buy_amount;
      if (pl > 0) profit += pl;
      else loss += Math.abs(pl);
    });
    const totalChargeValue = charges.find(row => row[0].toLowerCase() === "total")?.[1] || 0;
    setTotalProfit(profit);
    setTotalLoss(loss);
    setTotalCharges(totalChargeValue);
    setTotalNet(profit - loss - totalChargeValue);
  }, [trades, charges]);

  // Financial year helper
  const getFinancialYear = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return month <= 3 ? `${year - 1}-${year}` : `${year}-${year + 1}`;
  };

  // Date handling
  const handleDateChange = (field, value) => {
    if (field === "from") setFromDate(value);
    if (field === "to") setToDate(value);
    if (fromDate && toDate) {
      const fy1 = getFinancialYear(field === "from" ? value : fromDate);
      const fy2 = getFinancialYear(field === "to" ? value : toDate);
      if (fy1 !== fy2) alert("⚠️ Please select both dates within the same financial year.");
    }
  };

  // Fetch trades
  const fetchProfitLoss = async () => {
    if (!segment || !fromDate || !toDate || !accessToken || !financialYear) {
      alert("Please fill all fields: Segment, From Date, To Date, Access Token, Financial Year");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        access_token: accessToken,
        segment,
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
        year: financialYear
      };
      const response = await apiPost("/get_profit_loss", payload);
      if (response.success) {
        setTrades(response.data || []);
        setCharges(response.rows || []);
        setCurrentPage(1); // Reset to first page
      } else {
        alert(response.message || "Failed to fetch data.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while fetching profit/loss data!");
    } finally {
      setLoading(false);
    }
  };

  // Pagination helpers
  const totalPages = Math.ceil(trades.length / rowsPerPage);
  const paginatedTrades = trades.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - 9);
    let end = Math.min(totalPages, start + 19);
    start = Math.max(1, end - 19);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upstox Trade Profit/Loss Report</h2>

      {/* Filters + Totals */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "20px" }}>
        <input type="text" placeholder="Access Token" value={accessToken} onChange={e => setAccessToken(e.target.value)} style={{ padding: "8px", flex: "1 1 250px" }} />
        <select value={segment} onChange={e => setSegment(e.target.value)} style={{ padding: "8px" }}>
          <option value="FO">Futures & Options</option>
          <option value="EQ">Equity</option>
          <option value="CDS">Currency</option>
          <option value="MCX">Commodities</option>
        </select>
        <input type="date" value={fromDate} onChange={e => handleDateChange("from", e.target.value)} style={{ padding: "8px" }} />
        <input type="date" value={toDate} onChange={e => handleDateChange("to", e.target.value)} style={{ padding: "8px" }} />
        <select value={financialYear} onChange={e => setFinancialYear(e.target.value)} style={{ padding: "8px" }}>
          <option value="">Select Financial Year</option>
          {availableYears.map((year, idx) => (<option key={idx} value={year}>{year}</option>))}
        </select>
        <button onClick={fetchProfitLoss} disabled={loading} style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer", borderRadius: "5px" }}>
          {loading ? "Fetching..." : "Fetch Profit/Loss"}
        </button>

        <div style={{ display: "flex", gap: "15px", alignItems: "center", fontWeight: "bold" }}>
          <span style={{ color: "green" }}>Profit: ₹{totalProfit.toFixed(2)}</span>
          <span style={{ color: "red" }}>Loss: ₹{totalLoss.toFixed(2)}</span>
          <span style={{ color: "#ff9900", cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowChargesTable(!showChargesTable)} title="Click to view charge breakdown">
            Charges: ₹{totalCharges.toFixed(2)}
          </span>
          <span style={{ color: totalNet >= 0 ? "green" : "red" }}>Net P/L: ₹{totalNet.toFixed(2)}</span>
        </div>
      </div>

      {/* Charges Table */}
      {showChargesTable && (
        <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translate(-50%, -20%)", backgroundColor: "white", border: "2px solid #ccc", borderRadius: "10px", padding: "20px", zIndex: 1000, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: "500px" }}>
          <h3 style={{ marginBottom: "10px" }}>Charges Breakdown</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Charge Type</th>
                <th style={thStyle}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {charges.map((row, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{row[0]}</td>
                  <td style={tdStyle}>{row[1].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setShowChargesTable(false)} style={{ marginTop: "15px", backgroundColor: "#007bff", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}>Close</button>
        </div>
      )}

      {/* Results Table */}
      {trades.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: "900px", marginTop: "20px" }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "250px" }}>Scrip Name</th>
                <th style={{ ...thStyle, width: "70px" }}>Trade Type</th>
                <th style={{ ...thStyle, width: "70px" }}>Quantity</th>
                <th style={{ ...thStyle, width: "100px" }}>Buy Date</th>
                <th style={{ ...thStyle, width: "70px" }}>Buy Avg</th>
                <th style={{ ...thStyle, width: "100px" }}>Buy Amt</th>
                <th style={{ ...thStyle, width: "100px" }}>Sell Date</th>
                <th style={{ ...thStyle, width: "70px" }}>Sell Avg</th>
                <th style={{ ...thStyle, width: "100px" }}>Sell Amt</th>
                <th style={{ ...thStyle, width: "70px" }}>P/L</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrades.map((trade, idx) => {
                const pl = trade.sell_amount - trade.buy_amount;
                const color = pl >= 0 ? "green" : "red";
                return (
                  <tr key={idx}>
                    <td style={tdStyle}>{trade.scrip_name}</td>
                    <td style={tdStyle}>{trade.trade_type}</td>
                    <td style={tdStyle}>{trade.quantity}</td>
                    <td style={tdStyle}>{trade.buy_date}</td>
                    <td style={tdStyle}>{trade.buy_average}</td>
                    <td style={tdStyle}>{trade.buy_amount}</td>
                    <td style={tdStyle}>{trade.sell_date}</td>
                    <td style={tdStyle}>{trade.sell_average}</td>
                    <td style={tdStyle}>{trade.sell_amount}</td>
                    <td style={{ ...tdStyle, color }}>{pl.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p>No trades found for the selected period.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "5px", flexWrap: "wrap" }}>
          <button onClick={handlePrev} disabled={currentPage === 1} style={{ padding: "5px 10px", borderRadius: "5px", border: "1px solid #ccc", backgroundColor: "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}>Prev</button>
          {getPageNumbers().map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: "5px 10px", borderRadius: "5px", border: currentPage === page ? "2px solid #007bff" : "1px solid #ccc", backgroundColor: currentPage === page ? "#007bff" : "#fff", color: currentPage === page ? "#fff" : "#000", cursor: "pointer" }}>{page}</button>
          ))}
          <button onClick={handleNext} disabled={currentPage === totalPages} style={{ padding: "5px 10px", borderRadius: "5px", border: "1px solid #ccc", backgroundColor: "#fff", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}>Next</button>
        </div>
      )}
    </div>
  );
}
