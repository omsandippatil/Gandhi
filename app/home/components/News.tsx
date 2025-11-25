"use client";

import React from 'react';
import { Newspaper } from 'lucide-react';

const NewsCard = () => {
  const news = [
    { headline: 'SENSEX HITS ALL-TIME HIGH', time: '4 HRS AGO' },
    { headline: 'RBI CUTS REPO RATE', time: '1 DAY AGO' }
  ];

  return (
    <div className="brutal-shadow" style={{
      background: '#C4F000',
      border: '3px solid #050505',
      padding: 'clamp(8px, 0.8vw, 12px)',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minWidth: 0,
      minHeight: 0
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <Newspaper size={12} strokeWidth={3} color="#050505" />
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, letterSpacing: '1px', color: '#050505' }}>
          FINANCIAL NEWS
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 0.6vw, 10px)', flex: 1, minHeight: 0 }}>
        {news.map((item, i) => (
          <div key={i} style={{
            background: '#FFFFFF',
            border: '2px solid #050505',
            padding: 'clamp(8px, 0.8vw, 12px)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(9px, 0.8vw, 11px)',
              fontWeight: 800,
              marginBottom: '4px',
              lineHeight: '1.3',
              color: '#050505'
            }}>
              {item.headline}
            </div>
            <div style={{
              fontSize: 'clamp(7px, 0.6vw, 8px)',
              fontWeight: 700,
              color: '#050505'
            }}>
              {item.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsCard;