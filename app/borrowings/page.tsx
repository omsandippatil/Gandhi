'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Plus, Check } from 'lucide-react';

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

export default function LendingBorrowingPage() {
  const [items, setItems] = useState<LendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchLendings();
  }, []);

  const fetchLendings = async () => {
    try {
      const response = await fetch('/api/get/lendings');
      const result = await response.json();
      
      if (result.success && result.data) {
        const ongoing = result.data.filter((item: LendingItem) => item.status === 'ongoing');
        setItems(ongoing);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lendings:', error);
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const calculateMonthlyEMI = (principal: number, rate: number, months: number) => {
    if (rate === 0) return principal / months;
    const monthlyRate = rate / (12 * 100);
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  };

  const getMonthsRemaining = (startDate: string, dueDate: string) => {
    const start = new Date(startDate);
    const end = new Date(dueDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return Math.max(1, months);
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const days = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const settleSelected = () => {
    if (selectedItems.size === 0) return;
    setProcessing(true);

    setTimeout(() => {
      setItems(prev => prev.map(item => {
        if (!selectedItems.has(item.id)) return item;

        // If it's EMI type, reduce by one EMI payment
        if (item.recurrence === 'emi') {
          const totalMonths = getMonthsRemaining(item.start_date, item.due_date);
          const monthlyEMI = calculateMonthlyEMI(item.principal, item.interest_rate, totalMonths);
          const newRemaining = Math.max(0, item.remaining_amount - monthlyEMI);
          
          return {
            ...item,
            remaining_amount: newRemaining,
            status: (newRemaining <= 0 ? 'settled' : 'ongoing') as 'ongoing' | 'settled'
          };
        } else {
          // For one_time, clear completely
          return {
            ...item,
            remaining_amount: 0,
            status: 'settled' as 'ongoing' | 'settled'
          };
        }
      }).filter(item => item.status === 'ongoing'));

      setSelectedItems(new Set());
      setProcessing(false);
    }, 1500);
  };

  const borrowed = items.filter(i => i.type === 'borrowed');
  const lent = items.filter(i => i.type === 'lent');

  const totalBorrowed = borrowed.reduce((sum, i) => sum + i.remaining_amount, 0);
  const totalLent = lent.reduce((sum, i) => sum + i.remaining_amount, 0);
  const netPosition = totalLent - totalBorrowed;

  // Calculate the actual payment amount (EMI for EMI items, full for one-time)
  const selectedPaymentAmount = items
    .filter(i => selectedItems.has(i.id))
    .reduce((sum, i) => {
      if (i.recurrence === 'emi') {
        const totalMonths = getMonthsRemaining(i.start_date, i.due_date);
        const monthlyEMI = calculateMonthlyEMI(i.principal, i.interest_rate, totalMonths);
        return sum + monthlyEMI;
      } else {
        return sum + i.remaining_amount;
      }
    }, 0);

  const getSettleButtonText = () => {
    if (processing) return 'SETTLING...';
    if (selectedItems.size === 0) return 'SELECT ITEMS';
    
    const selected = items.filter(i => selectedItems.has(i.id));
    const allEMI = selected.every(i => i.recurrence === 'emi');
    const allOneTime = selected.every(i => i.recurrence === 'one_time');
    
    if (allEMI) {
      return `PAY ${selectedItems.size} EMI${selectedItems.size > 1 ? 'S' : ''} (${formatAmount(selectedPaymentAmount)})`;
    } else if (allOneTime) {
      return `SETTLE ${selectedItems.size} FULL (${formatAmount(selectedPaymentAmount)})`;
    } else {
      return `PROCESS ${selectedItems.size} ITEM${selectedItems.size > 1 ? 'S' : ''} (${formatAmount(selectedPaymentAmount)})`;
    }
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
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '2px solid #050505'
        }}>
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
            width: '250px',
            animation: 'pulse 1.5s ease-in-out infinite 0.2s'
          }} />
        </div>

        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', height: '140px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                flex: 1,
                background: i === 1 ? '#C4F000' : '#ffffff',
                border: '2px solid #050505',
                padding: '20px',
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`
              }}>
                <div style={{ background: 'rgba(5, 5, 5, 0.1)', height: '12px', width: '100px', marginBottom: '16px' }} />
                <div style={{ background: 'rgba(5, 5, 5, 0.15)', height: '32px', width: '140px', marginBottom: '10px' }} />
                <div style={{ background: 'rgba(5, 5, 5, 0.1)', height: '10px', width: '80px' }} />
              </div>
            ))}
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

  return (
    <div style={{
      height: '100vh',
      background: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
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
            LENDING & BORROWING
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {selectedItems.size > 0 && (
            <button
              onClick={settleSelected}
              disabled={processing}
              style={{
                background: processing ? '#f5f5f5' : '#C4F000',
                border: '2px solid #050505',
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#050505',
                cursor: processing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px',
                opacity: processing ? 0.6 : 1
              }}
            >
              {getSettleButtonText()}
            </button>
          )}
        </div>
      </div>

      <div style={{
        flex: 1,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        overflow: 'auto'
      }}>
        {/* Financial Overview */}
        <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
          <div style={{
            flex: 1,
            background: '#C4F000',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              marginBottom: '12px'
            }}>
              <TrendingUp size={16} color="#050505" strokeWidth={3} />
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', letterSpacing: '0.5px' }}>
                TOTAL LENT
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#050505', marginBottom: '6px' }}>
              {formatAmount(totalLent)}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', opacity: 0.8 }}>
              {lent.length} active {lent.length === 1 ? 'loan' : 'loans'}
            </div>
          </div>

          <div style={{
            flex: 1,
            background: '#DC2626',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              marginBottom: '12px'
            }}>
              <TrendingDown size={16} color="#ffffff" strokeWidth={3} />
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px' }}>
                TOTAL BORROWED
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
              {formatAmount(totalBorrowed)}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff', opacity: 0.9 }}>
              {borrowed.length} active {borrowed.length === 1 ? 'loan' : 'loans'}
            </div>
          </div>

          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '12px', letterSpacing: '0.5px' }}>
              NET POSITION
            </div>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: 800, 
              color: netPosition >= 0 ? '#C4F000' : '#DC2626',
              marginBottom: '6px'
            }}>
              {formatAmount(Math.abs(netPosition))}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', opacity: 0.8 }}>
              {netPosition >= 0 ? 'Net creditor' : 'Net debtor'}
            </div>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div style={{ display: 'flex', gap: '16px', flex: 1, minHeight: 0 }}>
          {/* Lent Column */}
          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '2px solid #f5f5f5'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#050505',
                letterSpacing: '1px'
              }}>
                LENT ({lent.length})
              </div>
              <div style={{
                background: '#C4F000',
                color: '#050505',
                padding: '4px 10px',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                border: '2px solid #050505'
              }}>
                THEY OWE
              </div>
            </div>

            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              overflowY: 'auto',
              paddingRight: '4px'
            }}>
              {lent.length === 0 ? (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: 0.5
                }}>
                  <TrendingUp size={40} color="#050505" strokeWidth={2} />
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#050505' }}>
                    No lendings
                  </div>
                </div>
              ) : (
                lent.map(item => {
                  const percentPaid = ((item.principal - item.remaining_amount) / item.principal) * 100;
                  const totalMonths = getMonthsRemaining(item.start_date, item.due_date);
                  const monthlyEMI = item.recurrence === 'emi' ? calculateMonthlyEMI(item.principal, item.interest_rate, totalMonths) : 0;
                  const daysLeft = getDaysUntilDue(item.due_date);
                  const isSelected = selectedItems.has(item.id);
                  
                  return (
                    <div 
                      key={item.id}
                      onClick={() => toggleSelection(item.id)}
                      style={{
                        background: isSelected ? '#f0fdf4' : '#fafafa',
                        border: isSelected ? '2px solid #C4F000' : '2px solid #e5e5e5',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#050505', marginBottom: '4px' }}>
                            {item.party_name}
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: 600, color: '#050505', opacity: 0.6 }}>
                            {item.interest_rate > 0 ? `${item.interest_rate}% interest` : 'Interest-free'}
                          </div>
                        </div>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          border: '2px solid #050505',
                          background: isSelected ? '#C4F000' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {isSelected && <Check size={16} color="#050505" strokeWidth={3} />}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{
                        height: '10px',
                        background: '#ffffff',
                        border: '2px solid #050505',
                        display: 'flex',
                        marginBottom: '12px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentPaid}%`,
                          background: '#C4F000',
                          borderRight: percentPaid > 0 && percentPaid < 100 ? '1px solid #050505' : 'none',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505' }}>
                          {formatAmount(item.remaining_amount)} remaining
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', opacity: 0.6 }}>
                          of {formatAmount(item.principal)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: daysLeft < 7 ? '#DC2626' : '#050505',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Calendar size={12} strokeWidth={2.5} />
                          Due: {formatDate(item.due_date)} ({daysLeft}d)
                        </div>
                        {monthlyEMI > 0 && (
                          <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505' }}>
                            EMI: {formatAmount(monthlyEMI)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Borrowed Column */}
          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '2px solid #f5f5f5'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#050505',
                letterSpacing: '1px'
              }}>
                BORROWED ({borrowed.length})
              </div>
              <div style={{
                background: '#DC2626',
                color: '#ffffff',
                padding: '4px 10px',
                fontSize: '10px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                border: '2px solid #050505'
              }}>
                YOU OWE
              </div>
            </div>

            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              overflowY: 'auto',
              paddingRight: '4px'
            }}>
              {borrowed.length === 0 ? (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '12px',
                  opacity: 0.5
                }}>
                  <TrendingDown size={40} color="#050505" strokeWidth={2} />
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#050505' }}>
                    No borrowings
                  </div>
                </div>
              ) : (
                borrowed.map(item => {
                  const percentPaid = ((item.principal - item.remaining_amount) / item.principal) * 100;
                  const totalMonths = getMonthsRemaining(item.start_date, item.due_date);
                  const monthlyEMI = item.recurrence === 'emi' ? calculateMonthlyEMI(item.principal, item.interest_rate, totalMonths) : 0;
                  const daysLeft = getDaysUntilDue(item.due_date);
                  const isSelected = selectedItems.has(item.id);
                  
                  return (
                    <div 
                      key={item.id}
                      onClick={() => toggleSelection(item.id)}
                      style={{
                        background: isSelected ? '#fef2f2' : '#fafafa',
                        border: isSelected ? '2px solid #DC2626' : '2px solid #e5e5e5',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#050505', marginBottom: '4px' }}>
                            {item.party_name}
                          </div>
                          <div style={{ fontSize: '10px', fontWeight: 600, color: '#050505', opacity: 0.6 }}>
                            {item.interest_rate > 0 ? `${item.interest_rate}% interest` : 'Interest-free'}
                          </div>
                        </div>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          border: '2px solid #050505',
                          background: isSelected ? '#DC2626' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {isSelected && <Check size={16} color="#ffffff" strokeWidth={3} />}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div style={{
                        height: '10px',
                        background: '#ffffff',
                        border: '2px solid #050505',
                        display: 'flex',
                        marginBottom: '12px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentPaid}%`,
                          background: '#DC2626',
                          borderRight: percentPaid > 0 && percentPaid < 100 ? '1px solid #050505' : 'none',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505' }}>
                          {formatAmount(item.remaining_amount)} remaining
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', opacity: 0.6 }}>
                          of {formatAmount(item.principal)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: daysLeft < 7 ? '#DC2626' : '#050505',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Calendar size={12} strokeWidth={2.5} />
                          Due: {formatDate(item.due_date)} ({daysLeft}d)
                        </div>
                        {monthlyEMI > 0 && (
                          <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505' }}>
                            EMI: {formatAmount(monthlyEMI)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
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