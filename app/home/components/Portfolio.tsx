"use client";

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PortfolioCard = () => {
  const portfolio = [
    { name: 'SIP', amount: 125000, returns: 8.5 },
    { name: 'GOLD', amount: 45000, returns: 12.3 },
    { name: 'STOCKS', amount: 85000, returns: -3.2 }
  ];

  return (
    <div className="brutal-shadow" style={{
      gridColumn: 'span 2',
      background: '#C4F000',
      border: '3px solid #050505',
      padding: 'clamp(10px, 1vw, 14px)',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minWidth: 0,
      minHeight: 0
    }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(9px, 0.8vw, 11px)', fontWeight: 800, marginBottom: '12px', letterSpacing: '1px', color: '#050505' }}>
        PORTFOLIO
      </div>
      <div style={{ display: 'flex', gap: 'clamp(8px, 0.8vw, 10px)', flex: 1, minHeight: 0 }}>
        {portfolio.map((item, i) => (
          <div key={i} style={{
            flex: 1,
            background: '#FFFFFF',
            border: '2px solid #050505',
            padding: 'clamp(10px, 1vw, 14px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minWidth: 0
          }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(7px, 0.6vw, 9px)',
              fontWeight: 800,
              marginBottom: '8px',
              color: '#050505',
              letterSpacing: '0.5px'
            }}>
              {item.name}
            </div>
            <div style={{
              fontSize: 'clamp(11px, 1vw, 14px)',
              fontWeight: 700,
              marginBottom: '6px',
              color: '#050505'
            }}>
              ₹{item.amount.toLocaleString('en-IN')}
            </div>
            <div style={{
              fontSize: 'clamp(9px, 0.8vw, 11px)',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: item.returns > 0 ? '#050505' : '#FF0000'
            }}>
              {item.returns > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {item.returns > 0 ? '+' : ''}{item.returns}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioCard;