import React, { useState } from 'react';

function App() {
  const [refund, setRefund] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRefund = async () => {
    setLoading(true);
    try {
      // Intentional hard-coding to the v1 baseline
      const response = await fetch('http://localhost:8000/api/v1/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refund_amount: 50.0,
          total_amount: 100.0,
          tax_paid: 15.0
        }),
      });
      const data = await response.json();
      setRefund(data.tax_refund);
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Segoe UI, sans-serif', maxWidth: '600px' }}>
      <h1 style={{ color: '#2E3B4E', borderBottom: '2px solid #FFE600' }}>Tax Refund Portal</h1>
      <p>Proportional Refund Calculator (v1.0 Baseline)</p>
      
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '4px' }}>
        <button 
          onClick={calculateRefund}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#FFE600', 
            fontWeight: 'bold', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          {loading ? 'Calculating...' : 'Run Standard Calculation'}
        </button>

        {refund !== null && (
          <div style={{ marginTop: '20px' }}>
            <strong>Result: </strong>
            <span id="refund-display" style={{ fontSize: '1.2em' }}>${refund.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;