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

interface Account {
  id: string;
  account_name: string;
  type: string;
  balance: number;
}

interface UserData {
  balance: number;
}

const TransactionsSection = ({ transactions, selectedAccount, formatCurrency, onTransactionAdded }: { 
  transactions: Transaction[], 
  selectedAccount: string | null,
  formatCurrency: (amount: number) => string,
  onTransactionAdded: () => void
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'debit',
    categoryId: '',
    amount: '',
    description: ''
  });

  const accountId = 'b3f6e214-39b2-4689-bdcf-e178497d16da';

  const spendingCategories = [
    { id: '9bcdaf57-3903-42bd-80df-756b29b2be02', name: 'Food' },
    { id: 'f109cc76-44f8-41e2-883f-d5cee776c885', name: 'Transport' },
    { id: '711eac3a-33c6-4011-9f86-548d8fc31e37', name: 'Housing' },
    { id: '69143d7e-37f8-498b-ba46-a6b5d4af6086', name: 'Shopping' },
    { id: 'e008c9cc-3c5d-46d2-be5a-262f3dce00cd', name: 'Health' }
  ];

  const incomeCategories = [
    { id: 'ee7ddc86-ba98-4c1e-aa02-ae819b388f47', name: 'Salary' },
    { id: '6ef718a3-ac9a-492b-b30b-6f80a2855f4b', name: 'Freelancing' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      type: type as 'debit' | 'credit',
      categoryId: ''
    }));
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.description) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];

      const response = await fetch('/api/put/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: accountId,
          type: formData.type,
          categoryId: formData.categoryId || null,
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: dateString
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setFormData({
          type: 'debit',
          categoryId: '',
          amount: '',
          description: ''
        });
        setShowAddForm(false);
        onTransactionAdded();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
      alert('Failed to create transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const getCategories = () => {
    return formData.type === 'debit' ? spendingCategories : incomeCategories;
  };

  const getFilteredTransactions = () => {
    if (!selectedAccount) return transactions;
    return transactions.filter(t => t.account_id === selectedAccount);
  };

  return (
    <>
      {!showAddForm && (
        <>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 800, 
              letterSpacing: '0.5px', 
              color: '#050505' 
            }}>
              TRANSACTIONS
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                background: '#C4F000',
                border: '2px solid #050505',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '14px',
                color: '#050505',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              +
            </button>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            overflowY: 'auto',
            flex: 1
          }}>
            {getFilteredTransactions().map((transaction) => (
              <div
                key={transaction.id}
                style={{
                  background: '#ffffff',
                  border: '2px solid #050505',
                  padding: '10px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: '13px',
                    color: '#050505'
                  }}>
                    {transaction.description}
                  </div>
                  <div style={{ 
                    fontSize: '10px',
                    color: '#050505',
                    opacity: 0.5,
                    marginTop: '2px'
                  }}>
                    {transaction.accounts?.account_name} • {transaction.categories?.name || 'N/A'}
                  </div>
                </div>
                <div style={{
                  textAlign: 'right',
                  marginLeft: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '2px'
                }}>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    color: transaction.type === 'debit' ? '#DC2626' : '#16A34A'
                  }}>
                    {transaction.type === 'debit' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div style={{ 
                    fontSize: '9px',
                    color: '#050505',
                    opacity: 0.5
                  }}>
                    {new Date(transaction.date).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'short' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            {getFilteredTransactions().length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#666',
                fontSize: '13px'
              }}>
                No transactions found
              </div>
            )}
          </div>
        </>
      )}

      {showAddForm && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          height: '100%'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 800, 
              letterSpacing: '0.5px', 
              color: '#050505' 
            }}>
              ADD TRANSACTION
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                background: '#DC2626',
                border: '2px solid #050505',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '14px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              ×
            </button>
          </div>

          <select
            name="type"
            value={formData.type}
            onChange={handleTypeChange}
            style={{
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#050505'
            }}
          >
            <option value="debit">SPENDING</option>
            <option value="credit">INCOME</option>
          </select>

          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            style={{
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#050505'
            }}
          >
            <option value="">CATEGORY (OPTIONAL)</option>
            {getCategories().map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name.toUpperCase()}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            style={{
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#050505'
            }}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            style={{
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#050505'
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              background: '#C4F000',
              border: '2px solid #050505',
              padding: '12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              color: '#050505',
              marginTop: 'auto'
            }}
          >
            {submitting ? 'ADDING...' : 'ADD TRANSACTION'}
          </button>
        </div>
      )}
    </>
  );
};

export default function FinanceDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [estimating, setEstimating] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, accountsRes, transactionsRes] = await Promise.all([
        fetch('/api/get/users'),
        fetch('/api/get/accounts'),
        fetch('/api/get/transactions')
      ]);

      const userData = await userRes.json();
      const accountsData = await accountsRes.json();
      const transactionsData = await transactionsRes.json();

      if (userData.success) setUserData(userData.data);
      if (accountsData.success) setAccounts(accountsData.data);
      if (transactionsData.success) setTransactions(transactionsData.data);
      
      setLoading(false);
      setTimeout(() => setEstimating(false), 2500);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setEstimating(false);
    }
  };

  const handleTransactionAdded = () => {
    setEstimating(true);
    fetchData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateBurnRate = () => {
    if (!transactions.length) return { daysLeft: 0, dailySpend: 0 };
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDebits = transactions.filter(t => {
      const txDate = new Date(t.date);
      return t.type === 'debit' && txDate >= thirtyDaysAgo;
    });
    
    if (!recentDebits.length) return { daysLeft: 999, dailySpend: 0 };
    
    const totalSpent = recentDebits.reduce((sum, t) => sum + t.amount, 0);
    const dailySpend = totalSpent / 30;
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const daysLeft = dailySpend > 0 ? Math.floor(totalBalance / dailySpend) : 999;
    
    return { daysLeft, dailySpend };
  };

  const SkeletonCard = ({ height = '120px', bgColor = '#ffffff' }) => (
    <div style={{
      background: bgColor,
      border: '2px solid #050505',
      padding: '24px',
      minHeight: height,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{
          width: '40%',
          height: '10px',
          background: bgColor === '#C4F000' ? 'rgba(0,0,0,0.1)' : '#e5e5e5',
          marginBottom: '12px'
        }} />
        <div style={{
          width: '70%',
          height: '14px',
          background: bgColor === '#C4F000' ? 'rgba(0,0,0,0.1)' : '#e5e5e5'
        }} />
      </div>
      <div style={{
        width: '60%',
        height: '24px',
        background: bgColor === '#C4F000' ? 'rgba(0,0,0,0.1)' : '#e5e5e5'
      }} />
    </div>
  );

  const SkeletonTransaction = () => (
    <div style={{
      background: '#ffffff',
      border: '2px solid #050505',
      padding: '10px 12px',
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ width: '60%', height: '13px', background: '#e5e5e5', marginBottom: '4px' }} />
        <div style={{ width: '40%', height: '10px', background: '#e5e5e5' }} />
      </div>
      <div style={{ width: '80px', height: '15px', background: '#e5e5e5' }} />
    </div>
  );

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
            background: '#e5e5e5',
            border: '2px solid #050505',
            padding: '10px 12px',
            width: '44px',
            height: '44px'
          }} />
          <div style={{
            width: '100px',
            height: '20px',
            background: '#e5e5e5'
          }} />
        </div>

        <div style={{ 
          flex: 1,
          padding: '0 24px 24px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'auto 1fr',
          gap: '16px'
        }}>
          <div style={{ gridColumn: 'span 4' }}>
            <SkeletonCard height="auto" bgColor="#ffffff" />
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <SkeletonCard height="auto" bgColor="#C4F000" />
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <SkeletonCard height="auto" bgColor="#ffffff" />
          </div>

          <div style={{
            gridColumn: 'span 8',
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '16px'
          }}>
            <div style={{ width: '120px', height: '14px', background: '#e5e5e5', marginBottom: '12px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} bgColor="#ffffff" />)}
            </div>
          </div>

          <div style={{
            gridColumn: 'span 4',
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '16px'
          }}>
            <div style={{ width: '140px', height: '14px', background: '#e5e5e5', marginBottom: '12px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[1, 2, 3, 4, 5].map(i => <SkeletonTransaction key={i} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const debitTransactions = transactions.filter(t => t.type === 'debit');
  const totalSpent = debitTransactions.reduce((sum, t) => sum + t.amount, 0);
  const { daysLeft, dailySpend } = calculateBurnRate();

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
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#050505';
            e.currentTarget.style.color = '#C4F000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#C4F000';
            e.currentTarget.style.color = '#050505';
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
          BALANCE
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
          gridColumn: 'span 4',
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '20px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '8px', letterSpacing: '0.5px' }}>
            TOTAL BALANCE
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#050505' }}>
            {formatCurrency(totalBalance)}
          </div>
          <div style={{ 
            fontSize: '10px', 
            fontWeight: 600, 
            color: '#050505', 
            opacity: 0.5, 
            marginTop: '8px',
            fontStyle: 'italic'
          }}>
            {estimating ? 'predicting...' : daysLeft > 365 ? 'stable' : `~${daysLeft} days left`}
          </div>
        </div>

        <div style={{
          gridColumn: 'span 4',
          background: '#C4F000',
          border: '2px solid #050505',
          padding: '20px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '8px', letterSpacing: '0.5px' }}>
            YOUR BALANCE
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#050505' }}>
            {formatCurrency(userData?.balance || 0)}
          </div>
          <div style={{ 
            fontSize: '10px', 
            fontWeight: 600, 
            color: '#050505', 
            opacity: 0.5, 
            marginTop: '8px',
            fontStyle: 'italic'
          }}>
            {estimating ? 'predicting...' : dailySpend > 0 ? `₹${Math.round(dailySpend)}/day avg` : 'no spending'}
          </div>
        </div>

        <div style={{
          gridColumn: 'span 4',
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '20px'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', marginBottom: '8px', letterSpacing: '0.5px' }}>
            TOTAL SPENT
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#DC2626' }}>
            {formatCurrency(totalSpent)}
          </div>
          <div style={{ 
            fontSize: '10px', 
            fontWeight: 600, 
            color: '#050505', 
            opacity: 0.5, 
            marginTop: '8px',
            fontStyle: 'italic'
          }}>
            {`${debitTransactions.length} transactions`}
          </div>
        </div>

        <div style={{
          gridColumn: 'span 8',
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 800,
            color: '#050505',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            letterSpacing: '0.5px',
            marginBottom: '12px'
          }}>
            <span>ACCOUNTS</span>
            {selectedAccount && (
              <button
                onClick={() => setSelectedAccount(null)}
                style={{
                  background: '#050505',
                  border: '2px solid #050505',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#C4F000',
                  letterSpacing: '0.5px'
                }}
              >
                CLEAR
              </button>
            )}
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
            overflowY: 'auto',
            flex: 1
          }}>
            {accounts.map((account) => {
              const isSelected = selectedAccount === account.id;
              const bgColor = isSelected ? '#C4F000' : '#ffffff';
              
              let accountIcon = '';
              const name = account.account_name.toLowerCase();
              
              if (name.includes('hdfc')) accountIcon = 'HDFC';
              else if (name.includes('paytm')) accountIcon = 'PAYTM';
              else if (name.includes('phonepe')) accountIcon = 'PhonePe';
              else if (name.includes('cash')) accountIcon = '₹';
              else if (name.includes('visa')) accountIcon = 'VISA';
              else if (name.includes('mastercard')) accountIcon = 'MC';
              else if (account.type === 'bank') accountIcon = 'BANK';
              else if (account.type === 'wallet') accountIcon = 'WALLET';
              else if (account.type === 'cash') accountIcon = '₹';
              else accountIcon = account.type.charAt(0).toUpperCase();
              
              return (
                <div
                  key={account.id}
                  onClick={() => setSelectedAccount(account.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'brightness(1)';
                  }}
                  style={{
                    background: bgColor,
                    border: '2px solid #050505',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#050505',
                        opacity: 0.6,
                        letterSpacing: '0.5px'
                      }}>
                        {account.type.toUpperCase()}
                      </div>
                      <div style={{
                        fontSize: accountIcon.length <= 2 ? '18px' : '12px',
                        fontWeight: 900,
                        color: '#050505',
                        opacity: 0.15,
                        letterSpacing: accountIcon.length <= 2 ? '0' : '1px',
                        fontFamily: accountIcon.length <= 2 ? "'Inter', sans-serif" : "'Syne', sans-serif"
                      }}>
                        {accountIcon}
                      </div>
                    </div>
                    <div style={{ 
                      fontWeight: 700, 
                      fontSize: '14px',
                      color: '#050505'
                    }}>
                      {account.account_name}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: 800,
                    color: '#050505'
                  }}>
                    {formatCurrency(account.balance)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{
          gridColumn: 'span 4',
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <TransactionsSection 
            transactions={transactions}
            selectedAccount={selectedAccount}
            formatCurrency={formatCurrency}
            onTransactionAdded={handleTransactionAdded}
          />
        </div>
      </div>
    </div>
  );
}