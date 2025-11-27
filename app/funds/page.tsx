'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Target, TrendingUp } from 'lucide-react';

interface Fund {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  progress: string;
  created_at: string;
}

export default function FundsPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const response = await fetch('/api/get/funds');
      const result = await response.json();
      
      if (result.success) {
        setFunds(result.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching funds:', error);
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

  const getTotalStats = () => {
    const totalTarget = funds.reduce((sum, f) => sum + f.target_amount, 0);
    const totalCurrent = funds.reduce((sum, f) => sum + f.current_amount, 0);
    const overallProgress = totalTarget > 0 ? ((totalCurrent / totalTarget) * 100).toFixed(1) : '0';
    return { totalTarget, totalCurrent, overallProgress };
  };

  const stats = getTotalStats();

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
            width: '120px',
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
          <div style={{ display: 'flex', gap: '16px', height: '120px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                flex: 1,
                background: '#f5f5f5',
                border: '2px solid #050505',
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
              }} />
            ))}
          </div>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                background: '#f5f5f5',
                border: '2px solid #050505',
                height: '160px',
                animation: `pulse 1.5s ease-in-out infinite ${i * 0.1}s`
              }} />
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
            SAVINGS FUNDS
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
          {funds.length} ACTIVE FUNDS
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
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505', letterSpacing: '0.5px' }}>
            TOTAL SAVED
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#050505' }}>
            {formatCurrency(stats.totalCurrent)}
          </div>
        </div>

        <div style={{
          flex: 1,
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#050505', letterSpacing: '0.5px' }}>
            OVERALL PROGRESS
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#050505' }}>
            {stats.overallProgress}%
          </div>
        </div>

        <div style={{
          flex: 1,
          background: '#050505',
          border: '2px solid #050505',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.5px' }}>
            TARGET AMOUNT
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>
            {formatCurrency(stats.totalTarget)}
          </div>
        </div>
      </div>

      {/* Funds Grid */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px 20px'
      }}>
        {funds.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '12px'
          }}>
            <div style={{ fontSize: '48px', opacity: 0.2 }}>🎯</div>
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#050505',
              opacity: 0.5
            }}>
              NO FUNDS CREATED YET
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            alignContent: 'start'
          }}>
            {funds.map((fund) => {
              const progress = parseFloat(fund.progress);
              const remaining = fund.target_amount - fund.current_amount;
              
              return (
                <div
                  key={fund.id}
                  style={{
                    background: progress >= 100 ? '#C4F000' : '#ffffff',
                    border: '2px solid #050505',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    minHeight: '180px'
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
                  {/* Fund Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: '#050505',
                        marginBottom: '6px',
                        letterSpacing: '0.5px'
                      }}>
                        {fund.name.toUpperCase()}
                      </div>
                      <div style={{
                        display: 'inline-block',
                        background: progress >= 100 ? 'rgba(5, 5, 5, 0.1)' : '#f5f5f5',
                        border: '1px solid #050505',
                        padding: '4px 10px',
                        fontSize: '9px',
                        fontWeight: 700,
                        color: progress >= 100 ? '#00AA00' : '#050505',
                        letterSpacing: '0.5px'
                      }}>
                        {progress >= 100 ? '✓ COMPLETED' : `${progress.toFixed(1)}% FUNDED`}
                      </div>
                    </div>
                    <Target size={24} strokeWidth={2.5} style={{ color: '#050505', opacity: 0.3 }} />
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div style={{
                      background: '#F5F5F5',
                      height: '14px',
                      border: '2px solid #050505',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        background: progress >= 100 ? '#00AA00' : '#050505',
                        height: '100%',
                        width: `${Math.min(progress, 100)}%`,
                        transition: 'width 0.5s ease-out'
                      }} />
                    </div>
                  </div>

                  {/* Fund Details */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        color: '#050505',
                        opacity: 0.6,
                        marginBottom: '4px',
                        letterSpacing: '0.5px'
                      }}>
                        CURRENT
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: '#050505'
                      }}>
                        {formatCurrency(fund.current_amount)}
                      </div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <div style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        color: '#050505',
                        opacity: 0.6,
                        marginBottom: '4px',
                        letterSpacing: '0.5px'
                      }}>
                        TARGET
                      </div>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: '#050505'
                      }}>
                        {formatCurrency(fund.target_amount)}
                      </div>
                    </div>
                  </div>

                  {/* Remaining Amount */}
                  {remaining > 0 && (
                    <div style={{
                      background: 'rgba(5, 5, 5, 0.05)',
                      border: '1px solid #050505',
                      padding: '8px 12px',
                      marginTop: 'auto'
                    }}>
                      <div style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        color: '#050505',
                        opacity: 0.6,
                        marginBottom: '2px',
                        letterSpacing: '0.5px'
                      }}>
                        REMAINING
                      </div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: '#DC2626'
                      }}>
                        {formatCurrency(remaining)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}