"use client";

import React, { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  type: string;
}

interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  tags: string | null;
  created_at: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const ExpenseIncomeCard = () => {
  const [pieMode, setPieMode] = useState<'expense' | 'income'>('expense');
  const [expenseData, setExpenseData] = useState<ChartData[]>([]);
  const [incomeData, setIncomeData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const categories: Category[] = [
    {"id":"69143d7e-37f8-498b-ba46-a6b5d4af6086","name":"Shopping","type":"expense"},
    {"id":"6ef718a3-ac9a-492b-b30b-6f80a2855f4b","name":"Freelancing","type":"income"},
    {"id":"711eac3a-33c6-4011-9f86-548d8fc31e37","name":"Housing","type":"expense"},
    {"id":"9bcdaf57-3903-42bd-80df-756b29b2be02","name":"Food","type":"expense"},
    {"id":"e008c9cc-3c5d-46d2-be5a-262f3dce00cd","name":"Health","type":"expense"},
    {"id":"ee7ddc86-ba98-4c1e-aa02-ae819b388f47","name":"Salary","type":"income"},
    {"id":"f109cc76-44f8-41e2-883f-d5cee776c885","name":"Transport","type":"expense"}
  ];

  const colors = ['#C4F000', '#050505', '#FFFFFF'];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/get/transactions');
      const result = await response.json();
      
      if (result.success && result.data) {
        processTransactions(result.data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const processTransactions = (transactions: Transaction[]) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const filteredTransactions = transactions.filter((t: Transaction) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const expenseMap: Record<string, number> = {};
    const incomeMap: Record<string, number> = {};

    filteredTransactions.forEach((t: Transaction) => {
      const category = categories.find(c => c.id === t.category_id);
      if (!category) return;

      const amount = parseFloat(String(t.amount));
      const categoryName = category.name.toUpperCase();

      if (t.type === 'debit' && category.type === 'expense') {
        expenseMap[categoryName] = (expenseMap[categoryName] || 0) + amount;
      } else if (t.type === 'credit' && category.type === 'income') {
        incomeMap[categoryName] = (incomeMap[categoryName] || 0) + amount;
      }
    });

    const expenseArray: ChartData[] = Object.entries(expenseMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map((item, i) => ({ ...item, color: colors[i] }));

    const incomeArray: ChartData[] = Object.entries(incomeMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map((item, i) => ({ ...item, color: colors[i] }));

    setExpenseData(expenseArray);
    setIncomeData(incomeArray);
  };

  const currentData = pieMode === 'expense' ? expenseData : incomeData;
  const total = currentData.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
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
        {/* Header skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{
            background: '#E5E5E5',
            height: 'clamp(9px, 0.85vw, 12px)',
            width: '45%',
            borderRadius: '2px'
          }} />
          <div style={{
            background: '#E5E5E5',
            width: 'clamp(45px, 4.5vw, 55px)',
            height: 'clamp(16px, 1.5vw, 20px)',
            borderRadius: '2px'
          }} />
        </div>
        
        {/* Pie chart skeleton */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', flex: 1, minHeight: 0 }}>
          <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ maxWidth: '130px', maxHeight: '130px' }}>
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="#F5F5F5"
            />
          </svg>
        </div>
        
        {/* Legend skeleton */}
        <div>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '11px',
                  height: '11px',
                  background: '#E5E5E5',
                  borderRadius: '2px'
                }} />
                <div style={{
                  background: '#E5E5E5',
                  height: 'clamp(8px, 0.75vw, 10px)',
                  width: `${70 - i * 15}px`,
                  borderRadius: '2px'
                }} />
              </div>
              <div style={{
                background: '#E5E5E5',
                height: 'clamp(8px, 0.75vw, 10px)',
                width: `${50 - i * 5}px`,
                borderRadius: '2px'
              }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

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
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(10px, 0.9vw, 12px)', fontWeight: 800, letterSpacing: '1px', color: '#050505' }}>
          {pieMode.toUpperCase()}
        </div>
        <button
          onClick={() => setPieMode(pieMode === 'expense' ? 'income' : 'expense')}
          style={{
            background: pieMode === 'expense' ? '#C4F000' : '#FFFFFF',
            color: '#050505',
            border: '2px solid #050505',
            padding: 'clamp(4px, 0.45vw, 6px) clamp(8px, 0.8vw, 11px)',
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(7px, 0.7vw, 9px)',
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
          {currentData.length > 0 && currentData.map((item, i) => {
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
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: 'clamp(9px, 0.85vw, 11px)', fontWeight: 700, color: '#050505' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '11px', height: '11px', background: item.color, border: '2px solid #050505' }} />
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