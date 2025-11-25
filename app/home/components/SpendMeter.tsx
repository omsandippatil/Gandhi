"use client";

import React from 'react';

const SpendMeterCard = () => {
  const budget = 50000;
  const spent = 32500;

  return (
    <div className="brutal-shadow" style={{
      background: '#FFFFFF',
      border: '3px solid #050505',
      padding: 'clamp(8px, 0.8vw, 12px)',
      color: '#050505',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%'
    }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '6px', letterSpacing: '1px', color: '#050505' }}>
        SPEND METER
      </div>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 800, marginBottom: '8px', color: '#050505' }}>
        ₹{spent.toLocaleString('en-IN')}
      </div>
      <div style={{ background: '#F5F5F5', height: 'clamp(10px, 0.8vw, 12px)', border: '2px solid #050505', position: 'relative', marginTop: 'auto' }}>
        <div style={{
          background: '#C4F000',
          height: '100%',
          width: `${(spent / budget) * 100}%`,
          transition: 'width 0.5s'
        }} />
      </div>
      <div style={{ fontSize: 'clamp(7px, 0.6vw, 8px)', marginTop: '4px', fontWeight: 700, color: '#050505' }}>
        {((spent / budget) * 100).toFixed(0)}% OF ₹{budget.toLocaleString('en-IN')}
      </div>
    </div>
  );
};

export default SpendMeterCard;