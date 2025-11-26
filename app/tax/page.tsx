"use client";

import React from 'react';
import { Wrench } from 'lucide-react';

const UnderDevelopment = () => {
  return (
    <div style={{
      fontFamily: "'Space Grotesk', monospace",
      background: '#F5F5F5',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box',
      backgroundImage: `repeating-conic-gradient(#050505 0% 25%, #E8E8E8 0% 50%) 50% / 40px 40px`,
      backgroundSize: '40px 40px',
      backgroundAttachment: 'fixed'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;700&display=swap');
      `}</style>

      <div style={{
        background: '#FFFFFF',
        border: '4px solid #050505',
        boxShadow: '8px 8px 0 #050505',
        padding: '60px 80px',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <div style={{
          background: '#C4F000',
          border: '3px solid #050505',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          boxShadow: '4px 4px 0 #050505'
        }}>
          <Wrench size={40} strokeWidth={3} color="#050505" />
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '48px',
          fontWeight: 800,
          color: '#050505',
          margin: '0 0 20px 0',
          letterSpacing: '1px'
        }}>
          UNDER DEVELOPMENT
        </h1>

        <p style={{
          fontFamily: "'Space Grotesk', monospace",
          fontSize: '18px',
          color: '#666',
          margin: '0 0 40px 0',
          lineHeight: '1.6'
        }}>
          We're working hard to bring you something amazing. This page is currently under construction.
        </p>

        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: '#050505',
            color: '#FFFFFF',
            border: '3px solid #050505',
            padding: '16px 32px',
            fontFamily: "'Space Grotesk', monospace",
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '4px 4px 0 #C4F000',
            transition: 'all 0.2s',
            letterSpacing: '1px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(2px, 2px)';
            e.currentTarget.style.boxShadow = '2px 2px 0 #C4F000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '4px 4px 0 #C4F000';
          }}
        >
          BACK TO HOME
        </button>
      </div>
    </div>
  );
};

export default UnderDevelopment;