"use client";

import React, { useState, useEffect } from 'react';

interface Fund {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  progress: string;
}

const FundsCard = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await fetch('/api/get/funds');
        const result = await response.json();
        
        if (result.success) {
          // Filter out Education Fund and limit to 3 funds
          const filteredFunds = result.data
            .filter((fund: Fund) => fund.name !== 'Education Fund')
            .slice(0, 3);
          setFunds(filteredFunds);
        }
      } catch (error) {
        console.error('Error fetching funds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFunds();
  }, []);

  return (
    <div className="brutal-shadow" style={{
      background: '#FFFFFF',
      border: '3px solid #050505',
      padding: 'clamp(12px, 1.2vw, 18px)',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%'
    }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 'clamp(10px, 1vw, 14px)',
        fontWeight: 800,
        marginBottom: '12px',
        letterSpacing: '1px',
        color: '#050505'
      }}>
        FUNDS
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 0.8vw, 12px)', flex: 1, minHeight: 0 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
              <div style={{
                background: '#050505',
                opacity: 0.1,
                height: 'clamp(10px, 0.9vw, 12px)',
                width: '70%',
                marginBottom: '6px',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`
              }} />
              <div style={{
                background: '#F5F5F5',
                height: 'clamp(8px, 0.7vw, 10px)',
                border: '2px solid #050505',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: '#050505',
                  opacity: 0.1,
                  height: '100%',
                  width: '40%',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.1 + 0.2}s`
                }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 0.8vw, 12px)', flex: 1, minHeight: 0 }}>
          {funds.map((fund) => (
            <div key={fund.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 'clamp(8px, 0.75vw, 10px)',
                fontWeight: 700,
                marginBottom: '5px',
                color: '#050505'
              }}>
                {fund.name.toUpperCase()}: ₹{fund.current_amount.toLocaleString('en-IN')}/₹{fund.target_amount.toLocaleString('en-IN')}
              </div>
              <div style={{
                background: '#F5F5F5',
                height: 'clamp(8px, 0.7vw, 10px)',
                border: '2px solid #050505',
                position: 'relative'
              }}>
                <div style={{
                  background: '#C4F000',
                  height: '100%',
                  width: `${parseFloat(fund.progress)}%`,
                  transition: 'width 0.5s ease-out'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default FundsCard;