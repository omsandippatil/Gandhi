'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, AlertCircle, CheckCircle, Check } from 'lucide-react';

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

interface PaymentPlan {
  billId: string;
  billName: string;
  amount: number;
  dueDate: string;
  suggestedPayDate: string;
  balanceAfterPayment: number;
  daysUntilDue: number;
  priority: 'high' | 'medium' | 'low';
}

export default function BillPaymentPlanner() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [selectedBills, setSelectedBills] = useState<Set<string>>(new Set());
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [billsRes, accountsRes] = await Promise.all([
        fetch('/api/get/bills'),
        fetch('/api/get/accounts')
      ]);

      const billsData = await billsRes.json();
      const accountsData = await accountsRes.json();

      if (billsData.success) {
        const unpaidBills = billsData.data.filter((b: Bill) => b.status !== 'paid');
        setBills(unpaidBills);
      }

      if (accountsData.success) {
        setAccounts(accountsData.data);
        const total = accountsData.data.reduce((sum: number, acc: any) => sum + acc.balance, 0);
        setTotalBalance(total);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const toggleBillSelection = (billId: string) => {
    const newSelected = new Set(selectedBills);
    if (newSelected.has(billId)) {
      newSelected.delete(billId);
    } else {
      newSelected.add(billId);
    }
    setSelectedBills(newSelected);
  };

  const paySelectedBills = async () => {
    if (selectedBills.size === 0) return;

    setPaying(true);

    // Calculate total amount to be paid
    const selectedBillsData = bills.filter(b => selectedBills.has(b.id));
    const totalAmount = selectedBillsData.reduce((sum, b) => sum + b.amount, 0);

    // Simulate payment processing
    setTimeout(() => {
      // Deduct from balance
      setTotalBalance(prev => prev - totalAmount);

      // Remove paid bills from the list
      setBills(prev => prev.filter(b => !selectedBills.has(b.id)));

      // Clear selection
      setSelectedBills(new Set());
      setPaying(false);
    }, 1500);
  };

  const generatePaymentPlan = () => {
    setPredicting(true);
    
    setTimeout(() => {
      const today = new Date();
      let runningBalance = totalBalance;
      
      const sortedBills = [...bills].sort((a, b) => {
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        return dateA.getTime() - dateB.getTime();
      });

      const plan: PaymentPlan[] = sortedBills.map(bill => {
        const dueDate = new Date(bill.due_date);
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let suggestedPayDate: Date;
        let priority: 'high' | 'medium' | 'low';

        if (daysUntilDue <= 3) {
          suggestedPayDate = today;
          priority = 'high';
        } else if (daysUntilDue <= 7) {
          suggestedPayDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
          priority = 'medium';
        } else {
          suggestedPayDate = new Date(dueDate.getTime() - 5 * 24 * 60 * 60 * 1000);
          priority = 'low';
        }

        runningBalance -= bill.amount;

        return {
          billId: bill.id,
          billName: bill.name,
          amount: bill.amount,
          dueDate: bill.due_date,
          suggestedPayDate: suggestedPayDate.toISOString(),
          balanceAfterPayment: runningBalance,
          daysUntilDue,
          priority
        };
      });

      setPaymentPlan(plan);
      setPredicting(false);
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#DC2626';
      case 'medium': return '#F59E0B';
      case 'low': return '#C4F000';
      default: return '#C4F000';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'URGENT';
      case 'medium': return 'MODERATE';
      case 'low': return 'FLEXIBLE';
      default: return 'FLEXIBLE';
    }
  };

  const selectedBillsAmount = bills
    .filter(b => selectedBills.has(b.id))
    .reduce((sum, b) => sum + b.amount, 0);

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
            width: '200px',
            animation: 'pulse 1.5s ease-in-out infinite 0.2s'
          }} />
        </div>

        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', height: '120px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                flex: 1,
                background: i === 1 ? '#C4F000' : i === 2 ? '#ffffff' : '#f5f5f5',
                border: '2px solid #050505',
                padding: '16px',
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`
              }}>
                <div style={{ background: 'rgba(5, 5, 5, 0.1)', height: '12px', width: '80px', marginBottom: '12px' }} />
                <div style={{ background: 'rgba(5, 5, 5, 0.15)', height: '28px', width: '120px', marginBottom: '8px' }} />
                <div style={{ background: 'rgba(5, 5, 5, 0.1)', height: '10px', width: '100px' }} />
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

  const totalBillAmount = bills.reduce((sum, b) => sum + b.amount, 0);
  const canPayAllBills = totalBalance >= totalBillAmount;

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
            BILL PAYMENT PLANNER
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {selectedBills.size > 0 && (
            <button
              onClick={paySelectedBills}
              disabled={paying}
              style={{
                background: paying ? '#f5f5f5' : '#C4F000',
                border: '2px solid #050505',
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#050505',
                cursor: paying ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px',
                opacity: paying ? 0.6 : 1
              }}
            >
              {paying ? 'PROCESSING...' : `PAY ${selectedBills.size} BILL${selectedBills.size > 1 ? 'S' : ''} (${formatCurrency(selectedBillsAmount)})`}
            </button>
          )}
          
          {paymentPlan.length === 0 && (
            <button
              onClick={generatePaymentPlan}
              disabled={predicting || bills.length === 0}
              style={{
                background: predicting ? '#f5f5f5' : '#ffffff',
                border: '2px solid #050505',
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#050505',
                cursor: predicting || bills.length === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px',
                opacity: predicting || bills.length === 0 ? 0.6 : 1
              }}
            >
              {predicting ? 'PREDICTING...' : 'GENERATE PAYMENT PLAN'}
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
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '8px', letterSpacing: '0.5px' }}>
              TOTAL BALANCE
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#050505', marginBottom: '4px' }}>
              {formatCurrency(totalBalance)}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505', opacity: 0.8 }}>
              Across {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'}
            </div>
          </div>

          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '8px', letterSpacing: '0.5px' }}>
              AFTER BILLS
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: (totalBalance - totalBillAmount) >= 0 ? '#050505' : '#050505', marginBottom: '4px' }}>
              {formatCurrency(totalBalance - totalBillAmount)}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505', opacity: 0.8 }}>
              Remaining balance
            </div>
          </div>

          <div style={{
            flex: 1,
            background: canPayAllBills ? '#C4F000' : '#DC2626',
            border: '2px solid #050505',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: canPayAllBills ? '#050505' : '#ffffff', marginBottom: '8px', letterSpacing: '0.5px' }}>
              TOTAL BILLS DUE
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: canPayAllBills ? '#050505' : '#ffffff', marginBottom: '4px' }}>
              {formatCurrency(totalBillAmount)}
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: canPayAllBills ? '#050505' : '#ffffff', opacity: canPayAllBills ? 0.8 : 0.9 }}>
              {bills.length} pending {bills.length === 1 ? 'bill' : 'bills'}
            </div>
          </div>
        </div>

        {/* Prediction Status / Results */}
        {predicting && (
          <div style={{
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '2px solid #f5f5f5'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#050505',
                letterSpacing: '1px'
              }}>
                GENERATING PAYMENT PLAN...
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1, 2, 3].map((idx) => (
                <div key={idx} style={{
                  background: '#fafafa',
                  border: '2px solid #e5e5e5',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  animation: `pulse 1.5s ease-in-out infinite ${idx * 0.2}s`
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#e5e5e5',
                    border: '2px solid #d4d4d4',
                    flexShrink: 0
                  }} />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: '#e5e5e5', height: '14px', width: '60%' }} />
                    <div style={{ background: '#e5e5e5', height: '11px', width: '80%' }} />
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '6px',
                    flexShrink: 0
                  }}>
                    <div style={{ background: '#e5e5e5', height: '11px', width: '120px' }} />
                    <div style={{ background: '#e5e5e5', height: '11px', width: '100px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!predicting && paymentPlan.length > 0 && (
          <div style={{
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '16px',
              borderBottom: '2px solid #f5f5f5'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 800,
                color: '#050505',
                letterSpacing: '1px'
              }}>
                RECOMMENDED PAYMENT SCHEDULE
              </div>
              <button
                onClick={() => setPaymentPlan([])}
                style={{
                  background: '#ffffff',
                  border: '2px solid #050505',
                  padding: '6px 12px',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#050505',
                  cursor: 'pointer',
                  letterSpacing: '0.5px'
                }}
              >
                RESET
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {paymentPlan.map((plan, idx) => (
                <div key={plan.billId} style={{
                  background: '#fafafa',
                  border: '2px solid #050505',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: getPriorityColor(plan.priority),
                    border: '2px solid #050505',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: plan.priority === 'low' ? '#050505' : '#ffffff',
                    flexShrink: 0
                  }}>
                    {idx + 1}
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#050505' }}>
                        {plan.billName}
                      </div>
                      <div style={{
                        background: getPriorityColor(plan.priority),
                        color: plan.priority === 'low' ? '#050505' : '#ffffff',
                        padding: '3px 8px',
                        fontSize: '9px',
                        fontWeight: 800,
                        letterSpacing: '0.5px',
                        border: '1px solid #050505'
                      }}>
                        {getPriorityText(plan.priority)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '11px', color: '#050505' }}>
                      <div>
                        <span style={{ fontWeight: 600, opacity: 0.6 }}>Amount: </span>
                        <span style={{ fontWeight: 800 }}>{formatCurrency(plan.amount)}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, opacity: 0.6 }}>Due: </span>
                        <span style={{ fontWeight: 800 }}>{formatDate(plan.dueDate)}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, opacity: 0.6 }}>Days left: </span>
                        <span style={{ fontWeight: 800 }}>{plan.daysUntilDue}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '6px',
                    flexShrink: 0
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#050505'
                    }}>
                      <Calendar size={14} strokeWidth={2.5} />
                      Pay on {formatDate(plan.suggestedPayDate)}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: plan.balanceAfterPayment >= 0 ? '#050505' : '#DC2626'
                    }}>
                      Balance: {formatCurrency(plan.balanceAfterPayment)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {paymentPlan.some(p => p.balanceAfterPayment < 0) && (
              <div style={{
                background: '#FEF2F2',
                border: '2px solid #DC2626',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '8px'
              }}>
                <AlertCircle size={20} color="#DC2626" strokeWidth={2.5} />
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626' }}>
                  WARNING: You may not have sufficient balance for all bills. Consider prioritizing critical payments.
                </div>
              </div>
            )}

            {paymentPlan.every(p => p.balanceAfterPayment >= 0) && (
              <div style={{
                background: '#F0FDF4',
                border: '2px solid #C4F000',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '8px'
              }}>
                <CheckCircle size={20} color="#C4F000" strokeWidth={2.5} />
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505' }}>
                  Great! You have sufficient balance to pay all bills following this schedule.
                </div>
              </div>
            )}
          </div>
        )}

        {/* No bills message */}
        {!predicting && paymentPlan.length === 0 && bills.length === 0 && (
          <div style={{
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <CheckCircle size={48} color="#C4F000" strokeWidth={2.5} />
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#050505', letterSpacing: '1px' }}>
              NO PENDING BILLS
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#050505', opacity: 0.6 }}>
              All your bills are paid up!
            </div>
          </div>
        )}

        {/* Initial state - show bills with checkboxes */}
        {!predicting && paymentPlan.length === 0 && bills.length > 0 && (
          <div style={{
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 800,
              color: '#050505',
              letterSpacing: '1px',
              marginBottom: '8px'
            }}>
              PENDING BILLS ({bills.length})
            </div>
            {bills.map(bill => {
              const dueDate = new Date(bill.due_date);
              const today = new Date();
              const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              const isSelected = selectedBills.has(bill.id);
              
              return (
                <div 
                  key={bill.id} 
                  onClick={() => toggleBillSelection(bill.id)}
                  style={{
                    background: isSelected ? '#f0fdf4' : '#fafafa',
                    border: isSelected ? '2px solid #C4F000' : '1px solid #e5e5e5',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#050505', marginBottom: '4px' }}>
                        {bill.name}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#050505', opacity: 0.6 }}>
                        Due: {formatDate(bill.due_date)} • {daysUntilDue} days left
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#050505' }}>
                    {formatCurrency(bill.amount)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
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