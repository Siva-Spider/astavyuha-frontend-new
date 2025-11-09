import React, { useEffect, useRef } from 'react';

const TradeResults = ({ tradeLogs, onClearLogs }) => {
  const logEndRef = useRef(null);

  // Auto-scroll to bottom whenever new logs arrive
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tradeLogs]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Trade Results</h2>
        <button
          onClick={onClearLogs}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            cursor: 'pointer',
          }}
        >
          Clear Log
        </button>
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '15px',
          borderRadius: '5px',
          backgroundColor: '#f9f9f9',
          maxHeight: '400px',
          overflowY: 'auto',
          marginTop: '10px',
          fontFamily: 'monospace',
        }}
      >
        {tradeLogs.length > 0 ? (
          tradeLogs.map((log, index) => {
            let color = 'black';
            if (log.includes('BUY SIGNAL')) color = 'green';
            if (log.includes('SELL SIGNAL')) color = 'red';

            return (
              <div key={index} style={{ color, margin: '3px 0' }}>
                {log}
              </div>
            );
          })
        ) : (
          <p>No trade results to display yet. Connect a broker and start trading!</p>
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default TradeResults;
