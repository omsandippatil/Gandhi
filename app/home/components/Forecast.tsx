"use client";

import React from 'react';

const ForecastCard = () => {
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
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px', color: '#050505' }}>
        FORECAST
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', position: 'relative', minHeight: 0 }}>
        <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ display: 'block' }}>
          <polyline
            points="0,25 16,30 33,12 50,22 66,8 83,18 100,10"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <polyline
            points="0,25 16,30 33,12 50,22 66,8 83,18 100,10 100,40 0,40"
            fill="#FFFFFF"
            opacity="0.3"
          />
          <line x1="0" y1="40" x2="100" y2="40" stroke="#050505" strokeWidth="2"/>
        </svg>
      </div>
      <div style={{ fontSize: 'clamp(7px, 0.6vw, 8px)', marginTop: '6px', fontWeight: 700, color: '#050505' }}>
        NEXT SALARY IN 8 DAYS
      </div>
    </div>
  );
};

export default ForecastCard;