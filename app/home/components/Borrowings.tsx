"use client";

import React, { useState, useEffect } from 'react';

interface LendingItem {
  id: string;
  user_id: string;
  type: 'borrowed' | 'lent';
  party_name: string;
  principal: number;
  remaining_amount: number;
  interest_rate: number;
  start_date: string;
  due_date: string;
  recurrence: 'emi' | 'one_time';
  notes: string | null;
  status: 'ongoing' | 'settled';
  created_at: string;
}

const LendingBorrowingCard = () => {
  const [items, setItems] = useState<LendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLendings = async () => {
      try {
        const response = await fetch('/api/get/lendings');
        const result = await response.json();
        
        if (result.success && result.data) {
          const ongoing = result.data
            .filter((item: LendingItem) => item.status === 'ongoing')
            .slice(0, 2);
          setItems(ongoing);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lendings:', error);
        setLoading(false);
      }
    };

    fetchLendings();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateMonthlyEMI = (principal: number, rate: number, months: number) => {
    if (rate === 0) return 0;
    const monthlyRate = rate / (12 * 100);
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  };

  const getMonthsRemaining = (startDate: string, dueDate: string) => {
    const start = new Date(startDate);
    const end = new Date(dueDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return months;
  };

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
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, letterSpacing: '1px', color: '#050505' }}>
          BORROWINGS & LENDINGS
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 0.6vw, 10px)', flex: 1, minHeight: 0 }}>
        {loading ? (
          <>
            {[1, 2].map((i) => (
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
                  height: '12px',
                  background: '#E5E7EB',
                  marginBottom: '6px',
                  width: '40%',
                  marginLeft: 'auto'
                }} />
                <div style={{
                  height: '14px',
                  background: '#E5E7EB',
                  marginBottom: '6px',
                  width: '70%'
                }} />
                <div style={{
                  height: '8px',
                  background: '#E5E7EB',
                  border: '2px solid #050505',
                  marginBottom: '6px'
                }} />
                <div style={{
                  height: '10px',
                  background: '#E5E7EB',
                  width: '60%'
                }} />
              </div>
            ))}
          </>
        ) : items.length > 0 ? (
          items.map((item, i) => {
            const percentPaid = ((item.principal - item.remaining_amount) / item.principal) * 100;
            const percentRemaining = 100 - percentPaid;
            const totalMonths = getMonthsRemaining(item.start_date, item.due_date);
            const monthlyEMI = item.recurrence === 'emi' ? calculateMonthlyEMI(item.principal, item.interest_rate, totalMonths) : 0;
            
            return (
              <div key={i} style={{
                background: '#FFFFFF',
                border: '2px solid #050505',
                padding: 'clamp(8px, 0.8vw, 12px)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                {/* Type tag */}
                <div style={{
                  background: '#C4F000',
                  border: '2px solid #050505',
                  padding: '2px 6px',
                  alignSelf: 'flex-end',
                  marginBottom: '6px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(7px, 0.6vw, 8px)',
                  fontWeight: 800,
                  letterSpacing: '0.5px',
                  color: '#050505'
                }}>
                  {item.type === 'borrowed' ? 'BORROWED' : 'LENT'}
                </div>

                {/* Party name */}
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(9px, 0.8vw, 11px)',
                  fontWeight: 800,
                  lineHeight: '1.3',
                  color: '#050505',
                  marginBottom: '6px'
                }}>
                  {item.party_name}
                </div>

                {/* Progress Bar */}
                <div style={{
                  height: '8px',
                  background: '#FFFFFF',
                  border: '2px solid #050505',
                  display: 'flex',
                  marginBottom: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentPaid}%`,
                    background: '#C4F000',
                    borderRight: percentPaid > 0 && percentPaid < 100 ? '1px solid #050505' : 'none',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                {/* Amount Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    fontSize: 'clamp(8px, 0.75vw, 10px)',
                    fontWeight: 700,
                    color: '#050505'
                  }}>
                    {formatAmount(item.remaining_amount)} DUE
                  </div>
                  {monthlyEMI > 0 && (
                    <div style={{
                      fontSize: 'clamp(8px, 0.75vw, 10px)',
                      fontWeight: 700,
                      color: '#050505'
                    }}>
                      EMI: {formatAmount(monthlyEMI)}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={{
            background: '#FFFFFF',
            border: '2px solid #050505',
            padding: 'clamp(8px, 0.8vw, 12px)',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(8px, 0.7vw, 10px)',
            fontWeight: 600,
            color: '#050505'
          }}>
            NO ACTIVE LOANS
          </div>
        )}
      </div>
    </div>
  );
};

export default LendingBorrowingCard;