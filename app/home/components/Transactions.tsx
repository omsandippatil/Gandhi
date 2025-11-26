"use client";

import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  categoryId: string;
  amount: number;
  date: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
}

const SkeletonLoader = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <div key={i} style={{
        background: '#E8E8E8',
        border: '2px solid #050505',
        padding: 'clamp(8px, 0.8vw, 12px)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        animation: 'pulse 2s infinite'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            height: '12px',
            background: '#D0D0D0',
            marginBottom: '8px',
            width: '70%',
            borderRadius: '2px'
          }}></div>
          <div style={{
            height: '10px',
            background: '#D0D0D0',
            width: '40%',
            borderRadius: '2px'
          }}></div>
        </div>
        <div style={{
          height: '16px',
          background: '#D0D0D0',
          width: '80px',
          borderRadius: '2px'
        }}></div>
      </div>
    ))}
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}</style>
  </>
);

const TransactionsCard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'expense',
    categoryId: '',
    amount: '',
    description: ''
  });

  const accountId = 'b3f6e214-39b2-4689-bdcf-e178497d16da';

  // Hardcoded categories matching your database
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

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get/transactions');
      const result = await response.json();
      if (result.success) {
        setTransactions(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      type: type as 'expense' | 'income',
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

      // Convert expense/income to debit/credit for database
      const dbType = formData.type === 'expense' ? 'debit' : 'credit';

      const response = await fetch('/api/put/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: accountId,
          type: dbType,
          categoryId: formData.categoryId || null,
          amount: parseFloat(formData.amount),
          description: formData.description,
          date: dateString
        })
      });

      const result = await response.json();
      
      if (result.success) {
        await fetchTransactions();
        setShowAddForm(false);
        setFormData({
          type: 'expense',
          categoryId: '',
          amount: '',
          description: ''
        });
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();
  };

  const getCategories = () => {
    return formData.type === 'expense' ? spendingCategories : incomeCategories;
  };

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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <div style={{ 
          fontFamily: "'Inter', sans-serif", 
          fontSize: 'clamp(10px, 0.9vw, 13px)', 
          fontWeight: 800, 
          letterSpacing: '1px', 
          color: '#050505' 
        }}>
          TRANSACTIONS
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: showAddForm ? '#FF0000' : '#C4F000',
            border: '2px solid #050505',
            width: 'clamp(18px, 1.8vw, 24px)',
            height: 'clamp(18px, 1.8vw, 24px)',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: 'clamp(10px, 1vw, 14px)',
            color: '#050505',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          {showAddForm ? '×' : '+'}
        </button>
      </div>

      {showAddForm && (
        <div style={{
          marginBottom: '10px',
          paddingBottom: '10px',
          borderBottom: '2px solid #050505',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(6px, 0.6vw, 8px)',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <label style={{
            fontSize: 'clamp(8px, 0.7vw, 9px)',
            fontWeight: 700,
            color: '#050505',
            letterSpacing: '0.5px'
          }}>
            TYPE
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleTypeChange}
            style={{
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: 'clamp(8px, 0.8vw, 10px)',
              fontSize: 'clamp(9px, 0.8vw, 11px)',
              fontWeight: 600,
              color: '#050505'
            }}
          >
            <option value="expense">SPENDING</option>
            <option value="income">INCOME</option>
          </select>

          <label style={{
            fontSize: 'clamp(8px, 0.7vw, 9px)',
            fontWeight: 700,
            color: '#050505',
            letterSpacing: '0.5px',
            marginTop: '4px'
          }}>
            CATEGORY (OPTIONAL)
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            style={{
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: 'clamp(8px, 0.8vw, 10px)',
              fontSize: 'clamp(9px, 0.8vw, 11px)',
              fontWeight: 600,
              color: '#050505'
            }}
          >
            <option value="">SELECT CATEGORY</option>
            {getCategories().map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name.toUpperCase()}
              </option>
            ))}
          </select>

          <label style={{
            fontSize: 'clamp(8px, 0.7vw, 9px)',
            fontWeight: 700,
            color: '#050505',
            letterSpacing: '0.5px',
            marginTop: '4px'
          }}>
            AMOUNT
          </label>
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={handleInputChange}
            min="0.01"
            step="0.01"
            style={{
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: 'clamp(8px, 0.8vw, 10px)',
              fontSize: 'clamp(9px, 0.8vw, 11px)',
              fontWeight: 600,
              color: '#050505'
            }}
          />

          <label style={{
            fontSize: 'clamp(8px, 0.7vw, 9px)',
            fontWeight: 700,
            color: '#050505',
            letterSpacing: '0.5px',
            marginTop: '4px'
          }}>
            TRANSACTION NAME
          </label>
          <input
            type="text"
            name="description"
            placeholder="Enter transaction name"
            value={formData.description}
            onChange={handleInputChange}
            style={{
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: 'clamp(8px, 0.8vw, 10px)',
              fontSize: 'clamp(9px, 0.8vw, 11px)',
              fontWeight: 600,
              color: '#050505'
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              background: '#C4F000',
              border: '2px solid #050505',
              padding: 'clamp(8px, 0.8vw, 10px)',
              fontSize: 'clamp(9px, 0.8vw, 11px)',
              fontWeight: 800,
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              marginTop: '4px',
              color: '#050505'
            }}
          >
            {submitting ? 'ADDING...' : 'ADD TRANSACTION'}
          </button>
        </div>
      )}

      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'clamp(6px, 0.6vw, 10px)', 
        minHeight: 0, 
        overflow: 'auto' 
      }}>
        {loading ? (
          <SkeletonLoader />
        ) : transactions.length === 0 ? (
          <div style={{ 
            padding: 'clamp(12px, 1.2vw, 16px)', 
            textAlign: 'center',
            fontSize: 'clamp(7px, 0.6vw, 9px)',
            fontWeight: 600,
            color: '#050505'
          }}>
            NO TRANSACTIONS
          </div>
        ) : (
          transactions.map((txn: Transaction) => (
            <div key={txn.id} style={{
              background: txn.type === 'credit' ? '#C4F000' : '#FFFFFF',
              border: '2px solid #050505',
              padding: 'clamp(8px, 0.8vw, 12px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}>
              <div>
                <div style={{
                  fontSize: 'clamp(10px, 0.9vw, 13px)',
                  fontWeight: 700,
                  color: '#050505'
                }}>
                  {txn.description || 'TRANSACTION'}
                </div>
                <div style={{
                  fontSize: 'clamp(8px, 0.7vw, 10px)',
                  color: '#050505',
                  marginTop: '2px'
                }}>
                  {formatDate(txn.date)}
                </div>
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(12px, 1.1vw, 15px)',
                fontWeight: 800,
                color: txn.type === 'credit' ? '#00AA00' : '#FF0000'
              }}>
                {txn.type === 'credit' ? '+' : '-'}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionsCard;