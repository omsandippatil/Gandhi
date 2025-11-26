"use client";

import React, { useState, useEffect } from 'react';

const SpendMeterCard = () => {
  const [spent, setSpent] = useState<number | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Get current month in YYYY-MM format
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        
        const response = await fetch(`/api/get/transactions?type=debit&month=${currentMonth}`);
        const result = await response.json();
        
        if (result.success) {
          // Calculate total spent from transactions
          const totalSpent = result.data.reduce((sum: number, transaction: any) => sum + transaction.amount, 0);
          setSpent(totalSpent);
          
          // Set a default budget or fetch from user settings
          // For now using a default budget of 50000
          setBudget(50000);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const percentage = spent !== null && budget !== null ? (spent / budget) * 100 : 0;

  return (
    <div className="brutal-shadow" style={{
      background: '#FFFFFF',
      border: '3px solid #050505',
      padding: 'clamp(12px, 1.2vw, 18px)',
      color: '#050505',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%'
    }}>
      {loading ? (
        <>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(10px, 1vw, 14px)',
            fontWeight: 800,
            marginBottom: '8px',
            letterSpacing: '1px',
            color: '#050505'
          }}>
            SPEND METER
          </div>
          <div style={{
            background: '#050505',
            opacity: 0.1,
            height: 'clamp(20px, 2vw, 28px)',
            width: '60%',
            marginBottom: '12px',
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{
            background: '#F5F5F5',
            height: 'clamp(16px, 1.4vw, 20px)',
            border: '2px solid #050505',
            marginTop: 'auto',
            marginBottom: '6px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              background: '#050505',
              opacity: 0.1,
              height: '100%',
              width: '50%',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: '0.2s'
            }} />
          </div>
          <div style={{
            background: '#050505',
            opacity: 0.1,
            height: 'clamp(10px, 0.9vw, 12px)',
            width: '45%',
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: '0.4s'
          }} />
        </>
      ) : (
        <>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(10px, 1vw, 14px)',
            fontWeight: 800,
            marginBottom: '8px',
            letterSpacing: '1px',
            color: '#050505'
          }}>
            SPEND METER
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(20px, 2vw, 28px)',
            fontWeight: 800,
            marginBottom: '12px',
            color: '#050505'
          }}>
            ₹{spent?.toLocaleString('en-IN') ?? '0'}
          </div>
          <div style={{
            background: '#F5F5F5',
            height: 'clamp(16px, 1.4vw, 20px)',
            border: '2px solid #050505',
            position: 'relative',
            marginTop: 'auto',
            marginBottom: '6px'
          }}>
            <div style={{
              background: percentage >= 80 ? '#FF0000' : '#C4F000',
              height: '100%',
              width: `${Math.min(percentage, 100)}%`,
              transition: 'width 0.5s ease-out, background 0.3s ease-out'
            }} />
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(9px, 0.9vw, 12px)',
            fontWeight: 700,
            color: '#050505'
          }}>
            {percentage.toFixed(0)}% OF ₹{budget?.toLocaleString('en-IN') ?? '0'}
          </div>
        </>
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

export default SpendMeterCard;