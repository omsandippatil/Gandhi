"use client";

import React, { useState, useEffect } from 'react';

interface Bill {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  status: string;
  accounts: {
    account_name: string;
  };
}

const BillboardCard = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('/api/get/bills');
        const result = await response.json();
        
        if (result.success) {
          // Get the first 2 bills
          const topBills = result.data.slice(0, 2);
          setBills(topBills);
        }
      } catch (error) {
        console.error('Error fetching bills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${day} ${month}`;
  };

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
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 'clamp(10px, 1vw, 14px)',
        fontWeight: 800,
        marginBottom: '12px',
        letterSpacing: '1px',
        color: '#050505'
      }}>
        BILLBOARD
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', gap: 'clamp(10px, 1vw, 12px)', flex: 1, minHeight: 0 }}>
          {[1, 2].map((i) => (
            <div key={i} style={{
              flex: 1,
              background: '#F5F5F5',
              border: '2px solid #050505',
              padding: 'clamp(10px, 1vw, 14px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 0
            }}>
              <div style={{
                background: '#050505',
                opacity: 0.1,
                height: 'clamp(8px, 0.7vw, 10px)',
                width: '60%',
                marginBottom: '8px',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`
              }} />
              <div style={{
                background: '#050505',
                opacity: 0.1,
                height: 'clamp(14px, 1.2vw, 18px)',
                width: '80%',
                marginBottom: '6px',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1 + 0.2}s`
              }} />
              <div style={{
                background: '#050505',
                opacity: 0.1,
                height: 'clamp(7px, 0.6vw, 9px)',
                width: '50%',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1 + 0.4}s`
              }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 'clamp(10px, 1vw, 12px)', flex: 1, minHeight: 0 }}>
          {bills.map((bill) => (
            <div key={bill.id} style={{
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
              <div style={{ fontSize: 'clamp(8px, 0.75vw, 10px)', fontWeight: 700, marginBottom: '8px', color: '#050505' }}>
                {bill.name.toUpperCase()}
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(14px, 1.3vw, 18px)', fontWeight: 800, marginBottom: '6px', color: '#050505' }}>
                ₹{bill.amount.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: 'clamp(8px, 0.7vw, 9px)', fontWeight: 700, color: '#050505' }}>
                DUE: {formatDueDate(bill.due_date)}
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

export default BillboardCard;