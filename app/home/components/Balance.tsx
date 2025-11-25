"use client";

import React from 'react';

const BalanceCard = () => {
  const balance = 125000;

  return (
    <div className="brutal-shadow" style={{
      background: '#C4F000',
      border: '3px solid #050505',
      padding: 'clamp(8px, 0.8vw, 12px)',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%'
    }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '6px', letterSpacing: '1px', color: '#050505' }}>
        BALANCE
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(16px, 1.5vw, 22px)', fontWeight: 800, marginBottom: '4px', color: '#050505' }}>
        ₹{balance.toLocaleString('en-IN')}
      </div>
      <div style={{ fontFamily: "'Hind Guntur', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 700, color: '#050505', marginTop: 'auto' }}>
        एक पेटी पच्चीस हजार
      </div>
    </div>
  );
};

export default BalanceCard;