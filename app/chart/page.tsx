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

interface CategorySpending {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

type MonthRange = 'current' | 'last' | 'twoMonths' | 'threeMonths';

export default function SpendmeterDashboard() {
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

  const getCategoryBreakdown = (): CategorySpending[] => {
    const categoryMap = new Map<string, number>();
    
    const filteredTransactions = getSelectedTransactions().filter(t => t.type === 'debit');
    
    filteredTransactions.forEach(t => {
      const category = t.categories?.name || 'Other';
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

  const getMonthlyComparison = () => {
    const months = [];
    for (let i = 3; i >= 0; i--) {
      const monthTransactions = getMonthTransactions(i);
      const income = monthTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        label: getMonthName(i),
        income,
        expense,
        net: income - expense
      });
    }
    return months;
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
        <div style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            background: '#f5f5f5',
            border: '2px solid #050505',
            padding: '10px 12px',
            height: '40px',
            width: '40px'
          }} />
          <div style={{
            background: '#f5f5f5',
            height: '18px',
            width: '120px'
          }} />
        </div>
        <div style={{ 
          flex: 1,
          padding: '0 20px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', gap: '12px', height: '48%' }}>
            <div style={{ flex: 1, background: '#f5f5f5', border: '2px solid #050505' }} />
            <div style={{ width: '200px', background: '#f5f5f5', border: '2px solid #050505' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', height: '48%' }}>
            <div style={{ flex: 1, background: '#f5f5f5', border: '2px solid #050505' }} />
            <div style={{ width: '200px', background: '#f5f5f5', border: '2px solid #050505' }} />
          </div>
        </div>
      </div>
    );
  }

  const selectedTransactions = getSelectedTransactions();
  const totalIncome = selectedTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = selectedTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const netAmount = totalIncome - totalExpense;
  
  const categoryBreakdown = getCategoryBreakdown();
  const monthlyData = getMonthlyComparison();

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
        padding: '24px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderBottom: '2px solid #050505'
      }}>
        <a 
          href="/home"
          style={{
            background: '#C4F000',
            border: '2px solid #050505',
            padding: '8px 10px',
            height: '40px',
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
          fontSize: '18px',
          fontWeight: 800,
          letterSpacing: '1.5px',
          color: '#050505',
          lineHeight: '40px'
        }}>
          INCOME VS EXPENSE
        </div>
      </div>

      <div style={{ 
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'hidden',
        minHeight: 0
      }}>
        {/* Top Row - Monthly Comparison Cards */}
        <div style={{ display: 'flex', gap: '16px', height: '50%', minHeight: 0 }}>
          {/* Monthly Comparison Section */}
          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#050505', letterSpacing: '1px', marginBottom: '16px' }}>
              INCOME VS EXPENSE (LAST 4 MONTHS)
            </div>
            
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', minHeight: 0 }}>
              {monthlyData.map((month, idx) => {
                const isPositive = month.net >= 0;
                return (
                  <div key={idx} style={{
                    background: '#ffffff',
                    border: '2px solid #050505',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505', opacity: 0.5, marginBottom: '10px' }}>
                        {month.label.toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <TrendingUp size={14} strokeWidth={3} color="#C4F000" />
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#050505' }}>
                          {formatCurrency(month.income)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <TrendingDown size={14} strokeWidth={3} color="#DC2626" />
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#050505' }}>
                          {formatCurrency(month.expense)}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e5e5e5' }}>
                      <div style={{ fontSize: '9px', fontWeight: 700, color: '#050505', opacity: 0.5, marginBottom: '6px' }}>
                        {isPositive ? 'SURPLUS' : 'DEFICIT'}
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: isPositive ? '#050505' : '#DC2626' }}>
                        {formatCurrency(Math.abs(month.net))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top 2 Month Cards */}
          <div style={{
            width: '220px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {monthRanges.slice(0, 2).map((range) => {
              const isSelected = selectedMonth === range;
              const monthTransactions = range === 'current' ? getMonthTransactions(0) :
                                       range === 'last' ? getMonthTransactions(1) :
                                       range === 'twoMonths' ? getMonthTransactions(2) :
                                       getMonthTransactions(3);
              const income = monthTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
              const expense = monthTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
              const net = income - expense;

              return (
                <button
                  key={range}
                  onClick={() => setSelectedMonth(range)}
                  style={{
                    flex: 1,
                    background: isSelected ? '#C4F000' : '#ffffff',
                    border: '2px solid #050505',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    minHeight: 0
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '10px', letterSpacing: '0.5px' }}>
                    {getMonthLabel(range).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: net >= 0 ? '#050505' : '#DC2626', lineHeight: 1.1 }}>
                    {formatCurrency(Math.abs(net))}
                  </div>
                  <div style={{ 
                    fontSize: '9px', 
                    fontWeight: 600, 
                    color: '#050505', 
                    opacity: 0.6, 
                    marginTop: '10px'
                  }}>
                    {net >= 0 ? 'SURPLUS' : 'DEFICIT'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'flex', gap: '16px', height: '50%', minHeight: 0 }}>
          {/* Category Sections */}
          <div style={{ flex: 1, display: 'flex', gap: '16px', minWidth: 0, overflow: 'hidden' }}>
            {/* Pie Chart Section */}
            <div style={{
              flex: 1,
              background: '#ffffff',
              border: '2px solid #050505',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '14px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#050505', letterSpacing: '0.5px' }}>
                  {getMonthLabel(selectedMonth).toUpperCase()} - CATEGORY BREAKDOWN
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '8px', fontWeight: 700, color: '#050505', opacity: 0.5 }}>INCOME</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#C4F000' }}>{formatCurrency(totalIncome)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px', fontWeight: 700, color: '#050505', opacity: 0.5 }}>EXPENSE</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#050505' }}>{formatCurrency(totalExpense)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '8px', fontWeight: 700, color: '#050505', opacity: 0.5 }}>NET</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: netAmount >= 0 ? '#C4F000' : '#DC2626' }}>
                      {formatCurrency(Math.abs(netAmount))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', gap: '20px', alignItems: 'center', minHeight: 0 }}>
                <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                    <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
                      <defs>
                        {categoryBreakdown.map((cat, idx) => (
                          <linearGradient key={idx} id={`grad${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: cat.color, stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: cat.color, stopOpacity: 0.8 }} />
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
                        const x1 = 65 + 55 * Math.cos((currentAngle * Math.PI) / 180);
                        const y1 = 65 + 55 * Math.sin((currentAngle * Math.PI) / 180);
                        const x2 = 65 + 55 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
                        const y2 = 65 + 55 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
                        
                        return (
                          <path
                            key={idx}
                            d={`M 65 65 L ${x1} ${y1} A 55 55 0 ${largeArc} 1 ${x2} ${y2} Z`}
                            fill={`url(#grad${idx})`}
                          />
                        );
                      })}
                      <circle cx="65" cy="65" r="38" fill="#ffffff" />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: '#050505', opacity: 0.5 }}>
                        TOTAL
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#050505', marginTop: '4px' }}>
                        {formatCurrency(totalExpense)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', overflowY: 'auto', maxHeight: '100%', paddingRight: '8px' }}>
                  {categoryBreakdown.map((cat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        background: cat.color,
                        flexShrink: 0,
                        marginTop: '2px'
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {cat.name}
                        </div>
                        <div style={{ fontSize: '9px', fontWeight: 600, color: '#050505', opacity: 0.5 }}>
                          {formatCurrency(cat.amount)}
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#050505', flexShrink: 0 }}>
                        {cat.percentage.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Cards */}
            <div style={{
              width: '300px',
              background: '#ffffff',
              border: '2px solid #050505',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden'
            }}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505', letterSpacing: '0.5px', marginBottom: '10px' }}>
                TOP SPENDING CATEGORIES - {getMonthLabel(selectedMonth).toUpperCase()}
              </div>
              <div style={{ 
                flex: 1,
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '8px',
                overflowY: 'auto',
                alignContent: 'start'
              }}>
                {categoryBreakdown.slice(0, 4).map((cat, idx) => (
                  <div key={idx} style={{
                    background: '#ffffff',
                    border: '2px solid #050505',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    height: 'fit-content'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        background: cat.color,
                        flexShrink: 0
                      }} />
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#050505' }}>
                        {cat.percentage.toFixed(0)}%
                      </div>
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#050505', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {cat.name}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#050505' }}>
                      {formatCurrency(cat.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom 2 Month Cards */}
          <div style={{
            width: '220px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {monthRanges.slice(2, 4).map((range) => {
              const isSelected = selectedMonth === range;
              const monthTransactions = range === 'current' ? getMonthTransactions(0) :
                                       range === 'last' ? getMonthTransactions(1) :
                                       range === 'twoMonths' ? getMonthTransactions(2) :
                                       getMonthTransactions(3);
              const income = monthTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
              const expense = monthTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
              const net = income - expense;

              return (
                <button
                  key={range}
                  onClick={() => setSelectedMonth(range)}
                  style={{
                    flex: 1,
                    background: isSelected ? '#C4F000' : '#ffffff',
                    border: '2px solid #050505',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    minHeight: 0
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '10px', letterSpacing: '0.5px' }}>
                    {getMonthLabel(range).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: net >= 0 ? '#050505' : '#DC2626', lineHeight: 1.1 }}>
                    {formatCurrency(Math.abs(net))}
                  </div>
                  <div style={{ 
                    fontSize: '9px', 
                    fontWeight: 600, 
                    color: '#050505', 
                    opacity: 0.6, 
                    marginTop: '10px'
                  }}>
                    {net >= 0 ? 'SURPLUS' : 'DEFICIT'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}