'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  tags: any;
  created_at: string;
  accounts?: {
    account_name: string;
  };
  categories?: {
    name: string;
  };
}

interface CategorySpending {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

type TimeRange = 'weekly' | 'monthly';

export default function SpendmeterDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('weekly');

  const BUDGET = 50000;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const transactionsRes = await fetch('/api/get/transactions?type=debit');
      const transactionsData = await transactionsRes.json();

      if (transactionsData.success) {
        setTransactions(transactionsData.data.filter((t: Transaction) => t.type === 'debit'));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryBreakdown = (): CategorySpending[] => {
    const categoryMap = new Map<string, number>();
    
    const filteredTransactions = getFilteredTransactions();
    
    filteredTransactions.forEach(t => {
      const category = t.categories?.name || 'Other';
      categoryMap.set(category, (categoryMap.get(category) || 0) + t.amount);
    });

    const total = Array.from(categoryMap.values()).reduce((sum, amt) => sum + amt, 0);
    
    const colors = ['#C4F000', '#A8CC00', '#8CAA00', '#708800', '#546600'];
    
    return Array.from(categoryMap.entries())
      .map(([name, amount], idx) => ({
        name,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: colors[idx % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getFilteredTransactions = () => {
    const today = new Date();
    const cutoffDate = new Date(today);
    
    if (timeRange === 'weekly') {
      cutoffDate.setDate(today.getDate() - 7);
    } else if (timeRange === 'monthly') {
      cutoffDate.setDate(today.getDate() - 30);
    }
    
    return transactions.filter(t => new Date(t.date) >= cutoffDate);
  };

  const getSpendingData = () => {
    const today = new Date();
    let days = [];
    let daysCount = timeRange === 'weekly' ? 7 : 30;

    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayTransactions = transactions.filter(t => 
        t.date.split('T')[0] === dateString
      );
      
      const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      days.push({
        date: dateString,
        amount: total
      });
    }
    
    return days;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            background: '#f5f5f5',
            border: '2px solid #050505',
            padding: '10px 12px',
            height: '44px',
            width: '44px'
          }} />
          <div style={{
            background: '#f5f5f5',
            height: '20px',
            width: '150px'
          }} />
        </div>

        <div style={{ 
          flex: 1,
          padding: '0 24px 24px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'auto 1fr',
          gap: '16px',
          maxHeight: 'calc(100vh - 90px)',
          overflow: 'hidden'
        }}>
          <div style={{
            gridColumn: 'span 6',
            display: 'flex',
            gap: '16px'
          }}>
            <div style={{
              flex: 1,
              background: '#C4F000',
              border: '2px solid #050505',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ width: '60%', height: '11px', background: 'rgba(0,0,0,0.1)', marginBottom: '8px' }} />
              <div style={{ width: '80%', height: '36px', background: 'rgba(0,0,0,0.1)' }} />
              <div style={{ width: '50%', height: '10px', background: 'rgba(0,0,0,0.1)', marginTop: '12px' }} />
            </div>

            <div style={{
              flex: 1,
              background: '#ffffff',
              border: '2px solid #050505',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ width: '60%', height: '11px', background: '#f5f5f5', marginBottom: '8px' }} />
              <div style={{ width: '50%', height: '36px', background: '#f5f5f5' }} />
              <div style={{ width: '70%', height: '10px', background: '#f5f5f5', marginTop: '4px' }} />
              <div style={{ marginTop: '12px', background: '#f5f5f5', height: '8px', border: '2px solid #050505' }} />
            </div>
          </div>

          <div style={{
            gridColumn: 'span 3',
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ width: '60%', height: '11px', background: '#f5f5f5', marginBottom: '8px' }} />
            <div style={{ width: '70%', height: '36px', background: '#f5f5f5' }} />
            <div style={{ width: '80%', height: '10px', background: '#f5f5f5', marginTop: '4px' }} />
            <div style={{ marginTop: '12px', background: '#f5f5f5', height: '8px', border: '2px solid #050505' }} />
          </div>

          <div style={{
            gridColumn: 'span 3',
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ width: '60%', height: '11px', background: '#f5f5f5', marginBottom: '8px' }} />
            <div style={{ width: '70%', height: '36px', background: '#f5f5f5' }} />
            <div style={{ width: '80%', height: '10px', background: '#f5f5f5', marginTop: '4px' }} />
            <div style={{ marginTop: '12px', background: '#f5f5f5', height: '8px', border: '2px solid #050505' }} />
          </div>

          <div style={{
            gridColumn: 'span 7',
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ width: '120px', height: '11px', background: '#f5f5f5' }} />
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '70px', height: '28px', background: '#C4F000', border: '2px solid #050505' }} />
                <div style={{ width: '70px', height: '28px', background: '#ffffff', border: '2px solid #050505' }} />
              </div>
            </div>
            
            <div style={{ flex: 1, position: 'relative', minHeight: 0, background: '#f5f5f5' }} />
          </div>

          <div style={{
            gridColumn: 'span 5',
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ width: '150px', height: '11px', background: '#f5f5f5', marginBottom: '24px' }} />
            <div style={{ display: 'flex', gap: '32px', flex: 1, alignItems: 'center' }}>
              <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: '#f5f5f5' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '14px', height: '14px', background: '#f5f5f5' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: '60%', height: '12px', background: '#f5f5f5', marginBottom: '4px' }} />
                      <div style={{ width: '40%', height: '10px', background: '#f5f5f5' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredTransactions = getFilteredTransactions();
  const totalSpent = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const budgetPercentage = (totalSpent / BUDGET) * 100;
  const isOverBudget = budgetPercentage >= 80;
  
  const weeklyTransactions = transactions.filter(t => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    return new Date(t.date) >= cutoff;
  });
  const weeklySpent = weeklyTransactions.reduce((sum, t) => sum + t.amount, 0);
  const weeklyBudget = (BUDGET / 30) * 7;
  const weeklyPercentage = (weeklySpent / weeklyBudget) * 100;
  const isWeeklyOver = weeklyPercentage >= 80;

  const monthlyTransactions = transactions.filter(t => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return new Date(t.date) >= cutoff;
  });
  const monthlySpent = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
  const monthlyPercentage = (monthlySpent / BUDGET) * 100;
  const isMonthlyOver = monthlyPercentage >= 80;
  
  const categoryBreakdown = getCategoryBreakdown();
  const spendingData = getSpendingData();
  const maxDaily = Math.max(...spendingData.map(d => d.amount), 1);
  const avgDaily = spendingData.reduce((sum, d) => sum + d.amount, 0) / spendingData.length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        <a 
          href="/home"
          style={{
            background: '#C4F000',
            border: '2px solid #050505',
            padding: '10px 12px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            textDecoration: 'none',
            color: '#050505',
            fontWeight: 800,
            transition: 'all 0.2s'
          }}
        >
          <ArrowLeft size={20} strokeWidth={3} />
        </a>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '20px',
          fontWeight: 800,
          letterSpacing: '1.5px',
          color: '#050505',
          lineHeight: '44px'
        }}>
          SPENDMETER
        </div>
      </div>

      <div style={{ 
        flex: 1,
        padding: '0 24px 24px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gridTemplateRows: 'auto 1fr',
        gap: '16px',
        maxHeight: 'calc(100vh - 90px)',
        overflow: 'hidden'
      }}>
        <div style={{
          gridColumn: 'span 6',
          display: 'flex',
          gap: '16px'
        }}>
          <div style={{
            flex: 1,
            background: isOverBudget ? '#DC2626' : '#C4F000',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: isOverBudget ? '#ffffff' : '#050505', marginBottom: '8px', letterSpacing: '0.5px' }}>
              TOTAL SPENT
            </div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: isOverBudget ? '#ffffff' : '#050505', lineHeight: 1 }}>
              {formatCurrency(totalSpent)}
            </div>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 600, 
              color: isOverBudget ? '#ffffff' : '#050505', 
              opacity: 0.7, 
              marginTop: '12px'
            }}>
              {filteredTransactions.length} transactions
            </div>
          </div>

          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '8px', letterSpacing: '0.5px' }}>
              BUDGET STATUS
            </div>
            <div style={{ fontSize: '36px', fontWeight: 800, color: isOverBudget ? '#DC2626' : '#050505', lineHeight: 1 }}>
              {budgetPercentage.toFixed(0)}%
            </div>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 600, 
              color: '#050505', 
              opacity: 0.5, 
              marginTop: '4px'
            }}>
              of {formatCurrency(BUDGET)} budget
            </div>
            <div style={{ 
              marginTop: '12px',
              background: '#f5f5f5',
              height: '8px',
              border: '2px solid #050505',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${Math.min(budgetPercentage, 100)}%`,
                background: isOverBudget ? '#DC2626' : '#C4F000',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        <div style={{
          gridColumn: 'span 3',
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '8px', letterSpacing: '0.5px' }}>
            WEEKLY SPEND
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: isWeeklyOver ? '#DC2626' : '#050505', lineHeight: 1 }}>
            {formatCurrency(weeklySpent)}
          </div>
          <div style={{ 
            fontSize: '10px', 
            fontWeight: 600, 
            color: '#050505', 
            opacity: 0.5, 
            marginTop: '4px'
          }}>
            {weeklyPercentage.toFixed(0)}% of weekly budget
          </div>
          <div style={{ 
            marginTop: '12px',
            background: '#f5f5f5',
            height: '8px',
            border: '2px solid #050505',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${Math.min(weeklyPercentage, 100)}%`,
              background: isWeeklyOver ? '#DC2626' : '#C4F000',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={{
          gridColumn: 'span 3',
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '8px', letterSpacing: '0.5px' }}>
            MONTHLY SPEND
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: isMonthlyOver ? '#DC2626' : '#050505', lineHeight: 1 }}>
            {formatCurrency(monthlySpent)}
          </div>
          <div style={{ 
            fontSize: '10px', 
            fontWeight: 600, 
            color: '#050505', 
            opacity: 0.5, 
            marginTop: '4px'
          }}>
            {monthlyPercentage.toFixed(0)}% of monthly budget
          </div>
          <div style={{ 
            marginTop: '12px',
            background: '#f5f5f5',
            height: '8px',
            border: '2px solid #050505',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${Math.min(monthlyPercentage, 100)}%`,
              background: isMonthlyOver ? '#DC2626' : '#C4F000',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div style={{
          gridColumn: 'span 7',
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', letterSpacing: '0.5px' }}>
              SPENDING CURVE
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['weekly', 'monthly'] as TimeRange[]).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  style={{
                    background: timeRange === range ? '#C4F000' : '#ffffff',
                    border: '2px solid #050505',
                    padding: '6px 12px',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#050505',
                    cursor: 'pointer',
                    letterSpacing: '0.5px',
                    transition: 'all 0.2s'
                  }}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none">
              {(() => {
                const points = spendingData.map((day, idx) => {
                  const x = (idx / (spendingData.length - 1)) * 800;
                  const y = 280 - (day.amount / maxDaily) * 260;
                  return { x, y, amount: day.amount };
                });

                const pathData = points.map((p, idx) => 
                  `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
                ).join(' ');

                const areaData = `M 0 300 L ${points.map(p => `${p.x} ${p.y}`).join(' L ')} L 800 300 Z`;

                return (
                  <>
                    <path d={areaData} fill="#C4F000" />
                    <path d={pathData} fill="none" stroke="#050505" strokeWidth="2" />
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        <div style={{
          gridColumn: 'span 5',
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '24px', letterSpacing: '0.5px' }}>
            CATEGORY DISTRIBUTION
          </div>

          <div style={{ display: 'flex', gap: '32px', flex: 1, alignItems: 'center' }}>
            <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                  <defs>
                    {categoryBreakdown.map((cat, idx) => (
                      <linearGradient key={idx} id={`grad${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: cat.color, stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: cat.color, stopOpacity: 0.7 }} />
                      </linearGradient>
                    ))}
                  </defs>
                  {categoryBreakdown.map((cat, idx) => {
                    let currentAngle = 0;
                    categoryBreakdown.slice(0, idx).forEach(c => {
                      currentAngle += (c.percentage / 100) * 360;
                    });
                    const angle = (cat.percentage / 100) * 360;
                    const largeArc = angle > 180 ? 1 : 0;
                    const x1 = 100 + 90 * Math.cos((currentAngle * Math.PI) / 180);
                    const y1 = 100 + 90 * Math.sin((currentAngle * Math.PI) / 180);
                    const x2 = 100 + 90 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                    const y2 = 100 + 90 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
                    
                    return (
                      <path
                        key={idx}
                        d={`M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={`url(#grad${idx})`}
                      />
                    );
                  })}
                  <circle cx="100" cy="100" r="55" fill="#ffffff" />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505', opacity: 0.5 }}>
                    TOTAL
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#050505', marginTop: '4px' }}>
                    {formatCurrency(totalSpent)}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '200px' }}>
              {categoryBreakdown.map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    background: cat.color,
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#050505', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cat.name}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#050505', opacity: 0.5 }}>
                      {formatCurrency(cat.amount)}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#050505', flexShrink: 0 }}>
                    {cat.percentage.toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}