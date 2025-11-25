"use client";

import React from 'react';

const TransactionsCard = () => {
  const transactions = [
    { desc: 'VADA PAV BINGE', amount: -450, date: '22 NOV' },
    { desc: 'SALARY CREDITED', amount: 75000, date: '21 NOV' },
    { desc: 'UBER AUTO', amount: -120, date: '21 NOV' }
  ];

  return (
    <div className="brutal-shadow" style={{
      background: '#FFFFFF',
      border: '3px solid #050505',
      padding: 'clamp(8px, 0.8vw, 12px)',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minWidth: 0,
      minHeight: 0
    }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '10px', letterSpacing: '1px', color: '#050505' }}>
        TRANSACTIONS
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 0.6vw, 10px)', minHeight: 0, overflow: 'auto' }}>
        {transactions.map((txn, i) => (
          <div key={i} style={{
            background: txn.amount > 0 ? '#C4F000' : '#FFFFFF',
            border: '2px solid #050505',
            padding: 'clamp(8px, 0.8vw, 12px)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <div>
              <div style={{
                fontSize: 'clamp(7px, 0.6vw, 9px)',
                fontWeight: 700,
                color: '#050505'
              }}>
                {txn.desc}
              </div>
              <div style={{
                fontSize: 'clamp(6px, 0.5vw, 7px)',
                color: '#050505',
                marginTop: '2px'
              }}>
                {txn.date}
              </div>
            </div>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(9px, 0.8vw, 11px)',
              fontWeight: 800,
              color: txn.amount > 0 ? '#050505' : '#FF0000'
            }}>
              {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsCard;