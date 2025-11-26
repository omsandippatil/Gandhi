"use client";

import React, { useState, useEffect } from 'react';

interface MonthlyData {
  income: number;
  expense: number;
  month: string;
}

interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  tags: string | null;
  created_at: string;
  accounts: {
    account_name: string;
  };
  categories: {
    name: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Transaction[];
}

const IncomeExpenseChartCard = () => {
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchTransactions = async () => {
      try {
        const response = await fetch('api/get/transactions');
        const result: ApiResponse = await response.json();
        
        if (result.success) {
          // Group transactions by month
          const monthlyData: Record<string, MonthlyData> = {};
          
          result.data.forEach((transaction: Transaction) => {
            const date = new Date(transaction.date);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthYear]) {
              monthlyData[monthYear] = { 
                income: 0, 
                expense: 0,
                month: date.toLocaleDateString('en-US', { month: 'short' })
              };
            }
            
            if (transaction.type === 'credit') {
              monthlyData[monthYear].income += transaction.amount;
            } else if (transaction.type === 'debit') {
              monthlyData[monthYear].expense += transaction.amount;
            }
          });
          
          // Get last 4 months
          const sortedMonths = Object.keys(monthlyData).sort().slice(-4);
          const chartArray = sortedMonths.map(key => monthlyData[key]);
          
          // Calculate max value for percentage scaling
          const maxValue = Math.max(
            ...chartArray.map(d => Math.max(d.income, d.expense))
          );
          
          // Convert to percentages
          const chartWithPercentages = chartArray.map(data => ({
            income: maxValue > 0 ? (data.income / maxValue) * 100 : 0,
            expense: maxValue > 0 ? (data.expense / maxValue) * 100 : 0,
            month: data.month
          }));
          
          setChartData(chartWithPercentages);
        }
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [mounted]);

  // Don't render anything during SSR
  if (!mounted) {
    return (
      <div className="brutal-shadow" style={{
        background: '#C4F000',
        border: '3px solid #050505',
        padding: 'clamp(8px, 0.8vw, 12px)',
        color: '#050505',
        display: 'flex',
        flexDirection: 'column',
        flex: '6 1 0',
        minHeight: 0,
        overflow: 'hidden',
        minWidth: 0
      }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 1vw, 14px)', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px', color: '#050505' }}>
          INCOME VS EXPENSE
        </div>
      </div>
    );
  }

  const loadingHeights = [
    { income: 65, expense: 55 },
    { income: 45, expense: 70 },
    { income: 55, expense: 60 },
    { income: 70, expense: 50 }
  ];

  if (loading) {
    return (
      <div className="brutal-shadow" style={{
        background: '#C4F000',
        border: '3px solid #050505',
        padding: 'clamp(8px, 0.8vw, 12px)',
        color: '#050505',
        display: 'flex',
        flexDirection: 'column',
        flex: '6 1 0',
        minHeight: 0,
        overflow: 'hidden',
        minWidth: 0
      }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 1vw, 14px)', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px', color: '#050505' }}>
          INCOME VS EXPENSE
        </div>
        <div style={{ display: 'flex', gap: '4px', flex: 1, alignItems: 'flex-end', minHeight: 0 }}>
          {loadingHeights.map((heights, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', flex: 1, width: '100%' }}>
                <div style={{
                  flex: 1,
                  background: '#050505',
                  height: `${heights.income}%`,
                  border: '2px solid #050505',
                  opacity: 0.3,
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
                <div style={{
                  flex: 1,
                  background: '#FFFFFF',
                  height: `${heights.expense}%`,
                  border: '2px solid #050505',
                  opacity: 0.3,
                  animation: 'pulse 1.5s ease-in-out infinite 0.2s'
                }} />
              </div>
              <div style={{ 
                fontSize: 'clamp(7px, 0.7vw, 10px)', 
                fontWeight: 700, 
                marginTop: '4px', 
                color: '#050505',
                opacity: 0.3,
                width: '20px',
                height: '10px',
                background: '#050505',
                animation: 'pulse 1.5s ease-in-out infinite 0.4s'
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: 'clamp(7px, 0.7vw, 10px)', fontWeight: 700, color: '#050505' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div style={{ width: '7px', height: '7px', background: '#050505', border: '2px solid #050505' }} />
            INCOME
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div style={{ width: '7px', height: '7px', background: '#FFFFFF', border: '2px solid #050505' }} />
            EXPENSE
          </div>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brutal-shadow" style={{
        background: '#C4F000',
        border: '3px solid #050505',
        padding: 'clamp(8px, 0.8vw, 12px)',
        color: '#050505',
        flex: '6 1 0',
        minHeight: 0
      }}>
        Error: {error}
      </div>
    );
  }

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
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 1vw, 14px)', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px', color: '#050505' }}>
        INCOME VS EXPENSE
      </div>
      <div style={{ display: 'flex', gap: '4px', flex: 1, alignItems: 'flex-end', minHeight: 0 }}>
        {chartData.map((data, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', flex: 1, width: '100%' }}>
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
            <div style={{ fontSize: 'clamp(7px, 0.7vw, 10px)', fontWeight: 700, marginTop: '4px', color: '#050505' }}>
              {data.month}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: 'clamp(7px, 0.7vw, 10px)', fontWeight: 700, color: '#050505' }}>
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