'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';

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

interface CategoryData {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

type MonthRange = 'current' | 'last' | 'twoMonths' | 'threeMonths';

export default function IncomeExpenseAnalysis() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<MonthRange>('current');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const transactionsRes = await fetch('/api/get/transactions');
      const transactionsData = await transactionsRes.json();
      if (transactionsData.success) {
        setTransactions(transactionsData.data);
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

  const getMonthName = (monthsAgo: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsAgo);
    return date.toLocaleString('en-US', { month: 'short' });
  };

  const getMonthLabel = (range: MonthRange) => {
    switch(range) {
      case 'current': return getMonthName(0);
      case 'last': return getMonthName(1);
      case 'twoMonths': return getMonthName(2);
      case 'threeMonths': return getMonthName(3);
    }
  };

  const getMonthTransactions = (monthsAgo: number) => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() - monthsAgo + 1, 0);
    
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });
  };

  const getSelectedTransactions = () => {
    switch(selectedMonth) {
      case 'current': return getMonthTransactions(0);
      case 'last': return getMonthTransactions(1);
      case 'twoMonths': return getMonthTransactions(2);
      case 'threeMonths': return getMonthTransactions(3);
    }
  };

  const getPreviousMonthData = () => {
    const prevMonthsAgo = selectedMonth === 'current' ? 1 : 
                          selectedMonth === 'last' ? 2 : 
                          selectedMonth === 'twoMonths' ? 3 : 4;
    
    const prevTransactions = getMonthTransactions(prevMonthsAgo);
    const prevIncome = prevTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const prevExpense = prevTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    
    return { prevIncome, prevExpense };
  };

  const getIncomeByCategory = (): CategoryData[] => {
    const categoryMap = new Map<string, number>();
    
    const filteredTransactions = getSelectedTransactions().filter(t => t.type === 'credit');
    
    filteredTransactions.forEach(t => {
      const category = t.categories?.name || 'Other Income';
      categoryMap.set(category, (categoryMap.get(category) || 0) + t.amount);
    });

    const total = Array.from(categoryMap.values()).reduce((sum, amt) => sum + amt, 0);
    const colors = ['#C4F000', '#A8CC00', '#8CAA00', '#708800', '#546600', '#3D4D00'];
    
    return Array.from(categoryMap.entries())
      .map(([name, amount], idx) => ({
        name,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: colors[idx % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const getExpenseByCategory = (): CategoryData[] => {
    const categoryMap = new Map<string, number>();
    
    const filteredTransactions = getSelectedTransactions().filter(t => t.type === 'debit');
    
    filteredTransactions.forEach(t => {
      const category = t.categories?.name || 'Other';
      categoryMap.set(category, (categoryMap.get(category) || 0) + t.amount);
    });

    const total = Array.from(categoryMap.values()).reduce((sum, amt) => sum + amt, 0);
    const colors = ['#DC2626', '#B91C1C', '#991B1B', '#7F1D1D', '#6B1C1C', '#581C1C'];
    
    return Array.from(categoryMap.entries())
      .map(([name, amount], idx) => ({
        name,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: colors[idx % colors.length]
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        background: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header Skeleton */}
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #050505'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              background: '#C4F000', 
              border: '2px solid #050505', 
              height: '36px', 
              width: '36px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
            <div style={{ 
              background: '#f5f5f5', 
              height: '16px', 
              width: '200px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ 
                background: '#f5f5f5', 
                border: '2px solid #050505',
                height: '32px', 
                width: '50px',
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
              }} />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div style={{ 
          flex: 1,
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto 1fr',
          gap: '16px',
          overflow: 'hidden',
          minHeight: 0
        }}>
          {/* Top Stats Skeleton */}
          <div style={{ gridColumn: '1 / 3', display: 'flex', gap: '16px', height: '100px' }}>
            <div style={{
              flex: 1,
              background: '#C4F000',
              border: '2px solid #050505',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>
              <div style={{ background: 'rgba(5, 5, 5, 0.1)', height: '12px', width: '80px' }} />
              <div style={{ background: 'rgba(5, 5, 5, 0.15)', height: '24px', width: '120px' }} />
              <div style={{ background: 'rgba(5, 5, 5, 0.1)', height: '10px', width: '100px' }} />
            </div>
            <div style={{
              flex: 1,
              background: '#ffffff',
              border: '2px solid #050505',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              animation: 'pulse 1.5s ease-in-out infinite 0.2s'
            }}>
              <div style={{ background: '#f5f5f5', height: '12px', width: '80px' }} />
              <div style={{ background: '#e5e5e5', height: '24px', width: '120px' }} />
              <div style={{ background: '#f5f5f5', height: '10px', width: '100px' }} />
            </div>
            <div style={{
              flex: 1,
              background: '#C4F000',
              border: '2px solid #050505',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              animation: 'pulse 1.5s ease-in-out infinite 0.4s'
            }}>
              <div style={{ background: 'rgba(5, 5, 5, 0.1)', height: '12px', width: '80px' }} />
              <div style={{ background: 'rgba(5, 5, 5, 0.15)', height: '24px', width: '120px' }} />
              <div style={{ background: 'rgba(5, 5, 5, 0.1)', height: '10px', width: '100px' }} />
            </div>
          </div>

          {/* Income Chart Skeleton */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ 
              background: '#f5f5f5', 
              height: '12px', 
              width: '140px',
              animation: 'pulse 1.5s ease-in-out infinite 0.6s'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C4F000 0%, #A8CC00 50%, #8CAA00 100%)',
                animation: 'pulse 1.5s ease-in-out infinite 0.8s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: '#ffffff'
                }} />
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    background: '#fafafa',
                    border: '1px solid #e5e5e5',
                    height: '36px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    animation: `pulse 1.5s ease-in-out infinite ${0.8 + i * 0.1}s`
                  }}>
                    <div style={{ width: '12px', height: '12px', background: '#C4F000', border: '1.5px solid #050505' }} />
                    <div style={{ flex: 1, background: '#e5e5e5', height: '10px' }} />
                    <div style={{ background: '#e5e5e5', height: '10px', width: '40px' }} />
                    <div style={{ background: '#e5e5e5', height: '10px', width: '60px' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expense Chart Skeleton */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <div style={{ 
              background: '#f5f5f5', 
              height: '12px', 
              width: '150px',
              animation: 'pulse 1.5s ease-in-out infinite 0.7s'
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%)',
                animation: 'pulse 1.5s ease-in-out infinite 0.9s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: '#ffffff'
                }} />
              </div>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    background: '#fafafa',
                    border: '1px solid #e5e5e5',
                    height: '36px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    animation: `pulse 1.5s ease-in-out infinite ${0.9 + i * 0.1}s`
                  }}>
                    <div style={{ width: '12px', height: '12px', background: '#DC2626', border: '1.5px solid #050505' }} />
                    <div style={{ flex: 1, background: '#e5e5e5', height: '10px' }} />
                    <div style={{ background: '#e5e5e5', height: '10px', width: '40px' }} />
                    <div style={{ background: '#e5e5e5', height: '10px', width: '60px' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }

  const selectedTransactions = getSelectedTransactions();
  const totalIncome = selectedTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = selectedTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const netAmount = totalIncome - totalExpense;
  
  const { prevIncome, prevExpense } = getPreviousMonthData();
  const incomeChange = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : 0;
  const expenseChange = prevExpense > 0 ? ((totalExpense - prevExpense) / prevExpense) * 100 : 0;
  
  const incomeData = getIncomeByCategory();
  const expenseData = getExpenseByCategory();

  const renderDonutChart = (data: CategoryData[], size: number = 180) => {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    if (total === 0) {
      return (
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={size/2 - 15} fill="#f5f5f5" />
          <circle cx={size/2} cy={size/2} r={size/2 - 40} fill="#ffffff" />
        </svg>
      );
    }

    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size / 2 - 5;
    const innerRadius = size / 2 - 35;

    return (
      <svg width={size} height={size}>
        <defs>
          {data.map((item, idx) => (
            <linearGradient key={idx} id={`gradient-${idx}-${item.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: item.color, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: item.color, stopOpacity: 0.85 }} />
            </linearGradient>
          ))}
        </defs>
        <g transform={`rotate(-90 ${centerX} ${centerY})`}>
          {data.map((item, idx) => {
            let currentAngle = 0;
            data.slice(0, idx).forEach(d => {
              currentAngle += (d.percentage / 100) * 360;
            });
            const angle = (item.percentage / 100) * 360;
            const largeArc = angle > 180 ? 1 : 0;
            
            const outerX1 = centerX + outerRadius * Math.cos((currentAngle * Math.PI) / 180);
            const outerY1 = centerY + outerRadius * Math.sin((currentAngle * Math.PI) / 180);
            const outerX2 = centerX + outerRadius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const outerY2 = centerY + outerRadius * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            
            const innerX1 = centerX + innerRadius * Math.cos((currentAngle * Math.PI) / 180);
            const innerY1 = centerY + innerRadius * Math.sin((currentAngle * Math.PI) / 180);
            const innerX2 = centerX + innerRadius * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const innerY2 = centerY + innerRadius * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            
            return (
              <path
                key={idx}
                d={`
                  M ${outerX1} ${outerY1}
                  A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerX2} ${outerY2}
                  L ${innerX2} ${innerY2}
                  A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerX1} ${innerY1}
                  Z
                `}
                fill={`url(#gradient-${idx}-${item.name})`}
              />
            );
          })}
        </g>
        <circle cx={centerX} cy={centerY} r={innerRadius} fill="#ffffff" />
      </svg>
    );
  };

  const monthRanges: MonthRange[] = ['current', 'last', 'twoMonths', 'threeMonths'];

  return (
    <div style={{
      height: '100vh',
      background: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid #050505'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a 
            href="/home"
            style={{
              background: '#C4F000',
              border: '2px solid #050505',
              padding: '8px 10px',
              height: '36px',
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
            <ArrowLeft size={18} strokeWidth={3} />
          </a>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '16px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            color: '#050505'
          }}>
            INCOME & EXPENSE ANALYSIS
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {monthRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedMonth(range)}
              style={{
                background: selectedMonth === range ? '#C4F000' : '#ffffff',
                border: '2px solid #050505',
                padding: '6px 12px',
                fontSize: '10px',
                fontWeight: 700,
                color: '#050505',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px'
              }}
            >
              {getMonthLabel(range).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        flex: 1,
        padding: '16px 20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto 1fr',
        gap: '16px',
        overflow: 'hidden',
        minHeight: 0
      }}>
        {/* Top Stats - Redesigned */}
        <div style={{ gridColumn: '1 / 3', display: 'flex', gap: '16px', height: '100px' }}>
          {/* Total Income - Always Green */}
          <div style={{
            flex: 1,
            background: '#C4F000',
            border: '2px solid #050505',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '6px', letterSpacing: '0.5px' }}>
              TOTAL INCOME
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#050505', marginBottom: '4px' }}>
              {formatCurrency(totalIncome)}
            </div>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 700, 
              color: '#050505',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {incomeChange >= 0 ? (
                <>
                  <TrendingUp size={12} strokeWidth={3} />
                  +{incomeChange.toFixed(1)}%
                </>
              ) : (
                <>
                  <TrendingDown size={12} strokeWidth={3} />
                  {incomeChange.toFixed(1)}%
                </>
              )}
              <span style={{ opacity: 0.7 }}>vs last period</span>
            </div>
          </div>

          {/* Surplus/Deficit - White */}
          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '6px', letterSpacing: '0.5px' }}>
              {netAmount >= 0 ? 'SURPLUS' : 'DEFICIT'}
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#050505', marginBottom: '4px' }}>
              {formatCurrency(Math.abs(netAmount))}
            </div>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 700, 
              color: '#050505',
              opacity: 0.8
            }}>
              {totalIncome > 0 ? ((Math.abs(netAmount) / totalIncome) * 100).toFixed(1) : '0.0'}% of income
            </div>
          </div>

          {/* Total Expense - Red if > 35k, Green otherwise */}
          <div style={{
            flex: 1,
            background: totalExpense > 35000 ? '#DC2626' : '#C4F000',
            border: '2px solid #050505',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ 
              fontSize: '11px', 
              fontWeight: 700, 
              color: totalExpense > 35000 ? '#ffffff' : '#050505', 
              marginBottom: '6px', 
              letterSpacing: '0.5px' 
            }}>
              TOTAL EXPENSE
            </div>
            <div style={{ 
              fontSize: '26px', 
              fontWeight: 800, 
              color: totalExpense > 35000 ? '#ffffff' : '#050505', 
              marginBottom: '4px' 
            }}>
              {formatCurrency(totalExpense)}
            </div>
            <div style={{ 
              fontSize: '10px', 
              fontWeight: 700, 
              color: totalExpense > 35000 ? '#ffffff' : '#050505',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {expenseChange >= 0 ? (
                <>
                  <TrendingUp size={12} strokeWidth={3} />
                  +{expenseChange.toFixed(1)}%
                </>
              ) : (
                <>
                  <TrendingDown size={12} strokeWidth={3} />
                  {expenseChange.toFixed(1)}%
                </>
              )}
              <span style={{ opacity: 0.7 }}>vs last period</span>
            </div>
          </div>
        </div>

        {/* Income Donut Chart */}
        <div style={{
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#050505', marginBottom: '12px', letterSpacing: '0.5px' }}>
            INCOME BY CATEGORY
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', minHeight: 0 }}>
            <div style={{ flex: '0 0 auto' }}>
              {renderDonutChart(incomeData, 180)}
            </div>
            <div style={{ 
              flex: 1, 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', 
              overflowY: 'auto', 
              paddingRight: '8px',
              maxHeight: 'calc(100% - 194px)'
            }}>
              {incomeData.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#050505', opacity: 0.5, textAlign: 'center', padding: '16px' }}>
                  No income data for this period
                </div>
              ) : (
                incomeData.map((item, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '8px 10px',
                    background: '#fafafa',
                    border: '1px solid #e5e5e5'
                  }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      background: item.color, 
                      flexShrink: 0,
                      border: '1.5px solid #050505'
                    }} />
                    <div style={{ 
                      flex: 1, 
                      fontSize: '11px',
                      fontWeight: 600, 
                      color: '#050505', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      fontWeight: 800, 
                      color: '#050505', 
                      flexShrink: 0,
                      background: '#ffffff',
                      padding: '3px 8px',
                      border: '1px solid #e5e5e5'
                    }}>
                      {item.percentage.toFixed(1)}%
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      fontWeight: 700, 
                      color: '#708800', 
                      flexShrink: 0 
                    }}>
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Expense Donut Chart */}
        <div style={{
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#050505', marginBottom: '12px', letterSpacing: '0.5px' }}>
            EXPENSE BY CATEGORY
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', minHeight: 0 }}>
            <div style={{ flex: '0 0 auto' }}>
              {renderDonutChart(expenseData, 180)}
            </div>
            <div style={{ 
              flex: 1, 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', 
              overflowY: 'auto', 
              paddingRight: '8px',
              maxHeight: 'calc(100% - 194px)'
            }}>
              {expenseData.length === 0 ? (
                <div style={{ fontSize: '11px', color: '#050505', opacity: 0.5, textAlign: 'center', padding: '16px' }}>
                  No expense data for this period
                </div>
              ) : (
                expenseData.map((item, idx) => (
                  <div key={idx} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    padding: '8px 10px',
                    background: '#fafafa',
                    border: '1px solid #e5e5e5'
                  }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      background: item.color, 
                      flexShrink: 0,
                      border: '1.5px solid #050505'
                    }} />
                    <div style={{ 
                      flex: 1, 
                      fontSize: '11px',
                      fontWeight: 600, 
                      color: '#050505', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap' 
                    }}>
                      {item.name}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      fontWeight: 800, 
                      color: '#050505', 
                      flexShrink: 0,
                      background: '#ffffff',
                      padding: '3px 8px',
                      border: '1px solid #e5e5e5'
                    }}>
                      {item.percentage.toFixed(1)}%
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      fontWeight: 700, 
                      color: '#7F1D1D', 
                      flexShrink: 0 
                    }}>
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}