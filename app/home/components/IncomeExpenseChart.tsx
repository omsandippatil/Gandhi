"use client";

import React from 'react';

const IncomeExpenseChartCard = () => {
  const chartData = [
    { income: 80, expense: 40 },
    { income: 85, expense: 55 },
    { income: 75, expense: 35 },
    { income: 90, expense: 65 }
  ];

  return (
    <div className="brutal-shadow" style={{
      background: '#C4F000',
      border: '3px solid #050505',
      padding: 'clamp(8px, 0.8vw, 12px)',
      color: '#050505',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      flex: '6 1 0',
      minHeight: 0,
      overflow: 'hidden',
      minWidth: 0
    }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(4px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px', color: '#050505' }}>
        INCOME VS EXPENSE
      </div>
      <div style={{ display: 'flex', gap: '4px', flex: 1, alignItems: 'flex-end', minHeight: 0 }}>
        {chartData.map((data, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', gap: '2px', alignItems: 'flex-end', height: '100%' }}>
            <div style={{
              flex: 1,
              background: '#050505',
              height: `${data.income}%`,
              border: '2px solid #050505'
            }} />
            <div style={{
              flex: 1,
              background: '#FFFFFF',
              height: `${data.expense}%`,
              border: '2px solid #050505'
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: 'clamp(6px, 0.5vw, 7px)', fontWeight: 700, color: '#050505' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <div style={{ width: '7px', height: '7px', background: '#050505', border: '2px solid #050505' }} />
          INCOME
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <div style={{ width: '7px', height: '7px', background: '#FFFFFF', border: '2px solid #050505' }} />
          EXPENSE
        </div>
      </div>
    </div>
  );
};

export default IncomeExpenseChartCard;