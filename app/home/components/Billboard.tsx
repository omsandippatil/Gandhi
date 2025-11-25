"use client";

import React from 'react';

const BillboardCard = () => {
  const bills = [
    { name: 'ELECTRICITY', amount: 3200, due: '25 NOV' },
    { name: 'WIFI', amount: 999, due: '28 NOV' }
  ];

  return (
    <div className="brutal-shadow" style={{
      gridColumn: 'span 2',
      background: '#FFFFFF',
      border: '3px solid #050505',
      padding: 'clamp(10px, 1vw, 14px)',
      color: '#050505',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minWidth: 0,
      minHeight: 0
    }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.5px', color: '#050505' }}>
        BILLBOARD
      </div>
      <div style={{ display: 'flex', gap: 'clamp(10px, 1vw, 12px)', flex: 1, minHeight: 0 }}>
        {bills.map((bill, i) => (
          <div key={i} style={{
            flex: 1,
            background: '#C4F000',
            border: '2px solid #050505',
            padding: 'clamp(10px, 1vw, 14px)',
            color: '#050505',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 0
          }}>
            <div style={{ fontSize: 'clamp(7px, 0.6vw, 9px)', fontWeight: 700, marginBottom: '8px', color: '#050505' }}>
              {bill.name}
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(12px, 1.1vw, 16px)', fontWeight: 800, marginBottom: '6px', color: '#050505' }}>
              ₹{bill.amount}
            </div>
            <div style={{ fontSize: 'clamp(7px, 0.6vw, 8px)', fontWeight: 700, color: '#050505' }}>
              DUE: {bill.due}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillboardCard;