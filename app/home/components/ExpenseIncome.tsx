"use client";

import React, { useState } from 'react';

const ExpenseIncomeCard = () => {
  const [pieMode, setPieMode] = useState('expense');

  const expenseData = [
    { name: 'FOOD', value: 12000, color: '#C4F000' },
    { name: 'RENT', value: 15000, color: '#050505' },
    { name: 'TRANSPORT', value: 3500, color: '#FFFFFF' }
  ];

  const incomeData = [
    { name: 'SALARY', value: 75000, color: '#C4F000' },
    { name: 'FREELANCE', value: 25000, color: '#050505' }
  ];

  const currentData = pieMode === 'expense' ? expenseData : incomeData;
  const total = currentData.reduce((sum, item) => sum + item.value, 0);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, letterSpacing: '1px', color: '#050505' }}>
          {pieMode.toUpperCase()}
        </div>
        <button
          onClick={() => setPieMode(pieMode === 'expense' ? 'income' : 'expense')}
          style={{
            background: pieMode === 'expense' ? '#C4F000' : '#FFFFFF',
            color: '#050505',
            border: '2px solid #050505',
            padding: 'clamp(3px, 0.3vw, 4px) clamp(6px, 0.6vw, 8px)',
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(6px, 0.5vw, 7px)',
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '0.5px'
          }}
        >
          TOGGLE
        </button>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', flex: 1, minHeight: 0 }}>
        <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ maxWidth: '130px', maxHeight: '130px' }}>
          {currentData.map((item, i) => {
            const prevTotal = currentData.slice(0, i).reduce((sum, d) => sum + d.value, 0);
            const startAngle = (prevTotal / total) * 360;
            const endAngle = ((prevTotal + item.value) / total) * 360;
            const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
            
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;
            
            const x1 = 100 + 80 * Math.cos(startRad);
            const y1 = 100 + 80 * Math.sin(startRad);
            const x2 = 100 + 80 * Math.cos(endRad);
            const y2 = 100 + 80 * Math.sin(endRad);
            
            return (
              <path
                key={i}
                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color}
                stroke="#050505"
                strokeWidth="3"
              />
            );
          })}
        </svg>
      </div>
      
      <div>
        {currentData.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: 'clamp(7px, 0.6vw, 8px)', fontWeight: 700, color: '#050505' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '9px', height: '9px', background: item.color, border: '2px solid #050505' }} />
              {item.name}
            </div>
            <div>₹{item.value.toLocaleString('en-IN')}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseIncomeCard;