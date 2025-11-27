'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Filter, Search, X } from 'lucide-react';

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

type FilterType = 'all' | 'credit' | 'debit';
type SortType = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    transactions.forEach(t => {
      if (t.categories?.name) {
        categories.add(t.categories.name);
      }
    });
    return Array.from(categories).sort();
  };

  const getFilteredAndSortedTransactions = () => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.categories?.name === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.categories?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortType) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filteredTransactions = getFilteredAndSortedTransactions();
  const totalCredit = filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebit = filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
  const netAmount = totalCredit - totalDebit;

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
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
        </div>
        <div style={{
          flex: 1,
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', gap: '16px', height: '100px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                flex: 1,
                background: '#f5f5f5',
                border: '2px solid #050505',
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
              }} />
            ))}
          </div>
          <div style={{ flex: 1, background: '#f5f5f5', border: '2px solid #050505', animation: 'pulse 1.5s ease-in-out infinite 0.3s' }} />
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
            ALL TRANSACTIONS
          </div>
        </div>

        <div style={{ 
          fontSize: '11px', 
          fontWeight: 700, 
          color: '#050505',
          background: '#f5f5f5',
          padding: '8px 12px',
          border: '2px solid #050505'
        }}>
          {filteredTransactions.length} TRANSACTIONS
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ 
        padding: '16px 20px',
        display: 'flex',
        gap: '16px',
        borderBottom: '2px solid #050505'
      }}>
        <div style={{
          flex: 1,
          background: '#C4F000',
          border: '2px solid #050505',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505', marginBottom: '4px', letterSpacing: '0.5px' }}>
            TOTAL INCOME
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#050505' }}>
            {formatCurrency(totalCredit)}
          </div>
        </div>

        <div style={{
          flex: 1,
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505', marginBottom: '4px', letterSpacing: '0.5px' }}>
            NET AMOUNT
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: netAmount >= 0 ? '#00AA00' : '#DC2626' }}>
            {formatCurrency(netAmount)}
          </div>
        </div>

        <div style={{
          flex: 1,
          background: '#DC2626',
          border: '2px solid #050505',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff', marginBottom: '4px', letterSpacing: '0.5px' }}>
            TOTAL EXPENSE
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
            {formatCurrency(totalDebit)}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        borderBottom: '2px solid #050505',
        flexWrap: 'wrap'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#ffffff',
              border: '2px solid #050505',
              padding: '8px 36px 8px 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#050505'
            }}
          />
          <Search 
            size={16} 
            strokeWidth={2.5}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#050505',
              opacity: 0.5
            }}
          />
        </div>

        {/* Type Filter */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['all', 'credit', 'debit'] as FilterType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                background: filterType === type ? '#C4F000' : '#ffffff',
                border: '2px solid #050505',
                padding: '8px 12px',
                fontSize: '10px',
                fontWeight: 700,
                color: '#050505',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px'
              }}
            >
              {type === 'all' ? 'ALL' : type === 'credit' ? 'INCOME' : 'EXPENSE'}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '8px 12px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#050505',
            cursor: 'pointer'
          }}
        >
          <option value="all">ALL CATEGORIES</option>
          {getUniqueCategories().map(cat => (
            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value as SortType)}
          style={{
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '8px 12px',
            fontSize: '10px',
            fontWeight: 700,
            color: '#050505',
            cursor: 'pointer'
          }}
        >
          <option value="date-desc">NEWEST FIRST</option>
          <option value="date-asc">OLDEST FIRST</option>
          <option value="amount-desc">HIGHEST AMOUNT</option>
          <option value="amount-asc">LOWEST AMOUNT</option>
        </select>
      </div>

      {/* Transactions List */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px 20px'
      }}>
        {filteredTransactions.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '12px'
          }}>
            <div style={{
              fontSize: '48px',
              opacity: 0.2
            }}>📊</div>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#050505',
              opacity: 0.5
            }}>
              NO TRANSACTIONS FOUND
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '12px'
          }}>
            {filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                style={{
                  background: txn.type === 'credit' ? '#C4F000' : '#ffffff',
                  border: '2px solid #050505',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '4px 4px 0px #050505';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#050505',
                      marginBottom: '4px'
                    }}>
                      {txn.description}
                    </div>
                    {txn.categories?.name && (
                      <div style={{
                        display: 'inline-block',
                        background: txn.type === 'credit' ? 'rgba(5, 5, 5, 0.1)' : '#f5f5f5',
                        border: '1px solid #050505',
                        padding: '3px 8px',
                        fontSize: '9px',
                        fontWeight: 700,
                        color: '#050505',
                        letterSpacing: '0.5px'
                      }}>
                        {txn.categories.name.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: '18px',
                    fontWeight: 800,
                    color: txn.type === 'credit' ? '#00AA00' : '#DC2626',
                    textAlign: 'right'
                  }}>
                    {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '8px',
                  borderTop: '1px solid #050505'
                }}>
                  <div style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#050505',
                    opacity: 0.7
                  }}>
                    {formatDate(txn.date)}
                  </div>
                  {txn.accounts?.account_name && (
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#050505',
                      opacity: 0.7
                    }}>
                      {txn.accounts.account_name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}