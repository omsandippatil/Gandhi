"use client";

import React from 'react';

const FundsCard = () => {
  const dreams = [
    { name: 'CAR', saved: 45000, target: 500000 },
    { name: 'PHONE', saved: 28000, target: 80000 },
    { name: 'EMERGENCY', saved: 75000, target: 200000 },
    { name: 'HEALTH INS', saved: 12000, target: 25000 }
  ];

  return (
    <div className="brutal-shadow" style={{
      background: '#FFFFFF',
      border: '3px solid #050505',
      padding: 'clamp(8px, 0.8vw, 12px)',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%'
    }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '10px', letterSpacing: '1px', color: '#050505' }}>
        FUNDS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 0.6vw, 10px)', flex: 1, minHeight: 0 }}>
        {dreams.map((dream, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
            <div style={{ fontSize: 'clamp(7px, 0.6vw, 8px)', fontWeight: 700, marginBottom: '4px', color: '#050505' }}>
              {dream.name}: ₹{dream.saved.toLocaleString('en-IN')}/₹{dream.target.toLocaleString('en-IN')}
            </div>
            <div style={{ background: '#050505', height: 'clamp(6px, 0.5vw, 8px)', border: '2px solid #050505' }}>
              <div style={{
                background: '#C4F000',
                height: '100%',
                width: `${(dream.saved / dream.target) * 100}%`
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FundsCard;