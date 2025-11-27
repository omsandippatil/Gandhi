'use client';
import { useState, useEffect } from 'react';
import { ArrowLeft, Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Fund {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  progress: string;
  created_at: string;
}

interface WishlistItem {
  id: string;
  name: string;
  currentPrice: number;
  targetPrice: number;
  lastUpdated: string;
  priceChange: number;
  category: string;
  image: string;
}

export default function FundsPage() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);

  const [wishlist] = useState<WishlistItem[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro',
      currentPrice: 134900,
      targetPrice: 120000,
      lastUpdated: '2h ago',
      priceChange: -2500,
      category: 'Electronics',
      image: 'https://m.media-amazon.com/images/I/81SigpJN1KL._SL1500_.jpg'
    },
    {
      id: '2',
      name: 'Dubai Flight',
      currentPrice: 25000,
      targetPrice: 18000,
      lastUpdated: '5h ago',
      priceChange: 1500,
      category: 'Travel',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&q=80'
    },
    {
      id: '3',
      name: 'Sony WH-1000XM5',
      currentPrice: 29990,
      targetPrice: 25000,
      lastUpdated: '1d ago',
      priceChange: 0,
      category: 'Audio',
      image: 'https://m.media-amazon.com/images/I/61vJBqg+YjL._SL1500_.jpg'
    },
    {
      id: '4',
      name: 'MacBook Air M3',
      currentPrice: 114900,
      targetPrice: 100000,
      lastUpdated: '3h ago',
      priceChange: -3000,
      category: 'Laptop',
      image: 'https://m.media-amazon.com/images/I/71TPda7cwUL._SL1500_.jpg'
    }
  ]);

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
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '2px solid #050505'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a 
            href="/home"
            style={{
              background: '#C4F000',
              border: '2px solid #050505',
              padding: '6px 8px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              textDecoration: 'none',
              color: '#050505',
              fontWeight: 800
            }}
          >
            <ArrowLeft size={16} strokeWidth={3} />
          </a>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '13px',
            fontWeight: 800,
            letterSpacing: '1.2px',
            color: '#050505'
          }}>
            SAVINGS & WISHLIST
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        {/* Stats Card */}
        <div style={{ 
          display: 'flex',
          gap: '8px'
        }}>
          <div style={{
            flex: 1,
            background: '#C4F000',
            border: '2px solid #050505',
            padding: '24px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', letterSpacing: '0.8px' }}>
              SAVED
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#050505' }}>
              {formatCurrency(stats.totalCurrent)}
            </div>
          </div>

          <div style={{
            flex: 1,
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '24px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#050505', letterSpacing: '0.8px' }}>
              PROGRESS
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#050505' }}>
              {stats.overallProgress}%
            </div>
          </div>

          <div style={{
            flex: 1,
            background: '#050505',
            border: '2px solid #050505',
            padding: '24px 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.8px' }}>
              TARGET
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
              {formatCurrency(stats.totalTarget)}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          flex: 1,
          minHeight: 0
        }}>
          {/* LEFT: Funds */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflow: 'auto'
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '1px',
              color: '#050505',
              paddingLeft: '2px'
            }}>
              FUNDS
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {funds.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '30px',
                  gap: '6px'
                }}>
                  <div style={{ fontSize: '28px', opacity: 0.2 }}>🎯</div>
                  <div style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#050505',
                    opacity: 0.5
                  }}>
                    NO FUNDS
                  </div>
                </div>
              ) : (
                funds.map((fund) => {
                  const progress = parseFloat(fund.progress);
                  
                  return (
                    <div
                      key={fund.id}
                      style={{
                        background: progress >= 100 ? '#C4F000' : '#ffffff',
                        border: '2px solid #050505',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translate(2px, -2px)';
                        e.currentTarget.style.boxShadow = '2px 2px 0px #050505';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translate(0, 0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Target size={14} strokeWidth={2.5} style={{ color: '#050505', opacity: 0.3 }} />
                        <div style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          color: '#050505',
                          lineHeight: '1.2',
                          flex: 1
                        }}>
                          {fund.name.toUpperCase()}
                        </div>
                      </div>

                      <div style={{
                        background: '#F5F5F5',
                        height: '5px',
                        border: '1px solid #050505',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          background: '#00AA00',
                          height: '100%',
                          width: `${Math.min(progress, 100)}%`,
                          transition: 'width 0.5s ease-out'
                        }} />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                        <div>
                          <div style={{
                            fontSize: '7px',
                            fontWeight: 700,
                            color: '#050505',
                            opacity: 0.5,
                            marginBottom: '1px'
                          }}>
                            SAVED
                          </div>
                          <div style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            color: '#050505'
                          }}>
                            {formatCurrency(fund.current_amount)}
                          </div>
                        </div>
                        <div style={{
                          background: progress >= 100 ? 'rgba(5, 5, 5, 0.1)' : '#f5f5f5',
                          border: '1px solid #050505',
                          padding: '2px 6px',
                          fontSize: '8px',
                          fontWeight: 700,
                          color: progress >= 100 ? '#00AA00' : '#050505'
                        }}>
                          {progress >= 100 ? '✓' : `${progress.toFixed(0)}%`}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Wishlist */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflow: 'auto'
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '1px',
              color: '#050505',
              paddingLeft: '2px'
            }}>
              WISHLIST
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px'
            }}>
              {wishlist.map((item) => {
                const isPriceGood = item.currentPrice <= item.targetPrice;
                
                return (
                  <div
                    key={item.id}
                    style={{
                      background: isPriceGood ? '#C4F000' : '#ffffff',
                      border: '2px solid #050505',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translate(-2px, -2px)';
                      e.currentTarget.style.boxShadow = '-2px 2px 0px #050505';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translate(0, 0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '100px',
                      overflow: 'hidden',
                      border: '2px solid #050505',
                      background: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px'
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '8px'
                        }}
                      />
                    </div>
                    
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: '#050505',
                      lineHeight: '1.3',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      minHeight: '26px',
                      marginBottom: '7px'
                    }}>
                      {item.name.toUpperCase()}
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: item.priceChange < 0 ? '#00AA00' : item.priceChange > 0 ? '#DC2626' : '#f5f5f5',
                      border: '1px solid #050505',
                      padding: '5px 7px',
                      justifyContent: 'center',
                      marginBottom: '7px'
                    }}>
                      {item.priceChange < 0 ? (
                        <TrendingDown size={10} strokeWidth={3} color="#ffffff" />
                      ) : item.priceChange > 0 ? (
                        <TrendingUp size={10} strokeWidth={3} color="#ffffff" />
                      ) : (
                        <Minus size={10} strokeWidth={3} color="#050505" />
                      )}
                      <span style={{
                        fontSize: '8px',
                        fontWeight: 800,
                        color: item.priceChange !== 0 ? '#ffffff' : '#050505'
                      }}>
                        {item.priceChange !== 0 ? formatCurrency(Math.abs(item.priceChange)) : 'SAME'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                      <div>
                        <div style={{
                          fontSize: '8px',
                          fontWeight: 700,
                          color: '#050505',
                          opacity: 0.5,
                          marginBottom: '2px'
                        }}>
                          NOW
                        </div>
                        <div style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          color: '#050505'
                        }}>
                          {formatCurrency(item.currentPrice)}
                        </div>
                      </div>
                      <div style={{
                        background: isPriceGood ? 'rgba(0, 170, 0, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                        border: '1px solid #050505',
                        padding: '4px 7px',
                        fontSize: '8px',
                        fontWeight: 700,
                        color: isPriceGood ? '#00AA00' : '#DC2626'
                      }}>
                        {isPriceGood ? '✓ BUY' : 'WAIT'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}