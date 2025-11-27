'use client';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface Investment {
  id: string;
  type: 'stock' | 'mf' | 'gold' | 'crypto';
  asset_name: string;
  quantity: number;
  buy_price: number;
  current_price: number;
  buy_date: string;
  platform: string;
  total_investment: string;
  current_value: string;
  profit_loss: string;
  profit_loss_percentage: string;
}

interface PortfolioData {
  data: Investment[];
  summary: {
    totalInvested: string;
    totalCurrentValue: string;
    totalProfitLoss: string;
    totalProfitLossPercentage: string;
  };
}

const MiniGraph = ({ investment }: { investment: Investment }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const profitLoss = parseFloat(investment.profit_loss);
    const isProfit = profitLoss >= 0;
    
    const points = 20;
    const data: number[] = [];
    const buyPrice = investment.buy_price;
    const currentPrice = investment.current_price;
    
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const baseValue = buyPrice + (currentPrice - buyPrice) * progress;
      const volatility = (Math.random() - 0.5) * (buyPrice * 0.1);
      data.push(baseValue + volatility);
    }

    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.strokeStyle = isProfit ? '#7DA600' : '#DC2626';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';

    data.forEach((value, index) => {
      const x = (index / (points - 1)) * canvas.width;
      const y = canvas.height - ((value - minVal) / range) * (canvas.height - 10) - 5;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = isProfit ? 'rgba(125, 166, 0, 0.15)' : 'rgba(220, 38, 38, 0.15)';
    ctx.fill();
  }, [investment]);

  return <canvas ref={canvasRef} width={110} height={30} />;
};

export default function PortfolioDashboard() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const pieChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (portfolioData && pieChartRef.current) {
      drawPieChart();
    }
  }, [portfolioData, selectedType]);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/get/portfolio');
      const data = await response.json();
      if (data.success) {
        setPortfolioData(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setLoading(false);
    }
  };

  const drawPieChart = () => {
    const canvas = pieChartRef.current;
    if (!canvas || !portfolioData) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const distribution: { [key: string]: number } = {};
    portfolioData.data.forEach(inv => {
      const value = parseFloat(inv.current_value);
      distribution[inv.type] = (distribution[inv.type] || 0) + value;
    });

    const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
    
    const colors: { [key: string]: string } = {
      stock: '#C4F000',
      mf: '#9BC400',
      gold: '#7DA600',
      crypto: '#5E8800'
    };

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startAngle = -Math.PI / 2;

    Object.entries(distribution).forEach(([type, value]) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[type];
      ctx.fill();

      startAngle += sliceAngle;
    });

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.55, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatCompactCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${(num / 1000).toFixed(1)}k`;
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      stock: '#C4F000',
      mf: '#9BC400',
      gold: '#7DA600',
      crypto: '#5E8800'
    };
    return colors[type] || '#C4F000';
  };

  const getFilteredInvestments = () => {
    if (!portfolioData) return [];
    if (selectedType === 'all') return portfolioData.data;
    return portfolioData.data.filter(inv => inv.type === selectedType);
  };

  const getDistribution = () => {
    if (!portfolioData) return {};
    const distribution: { [key: string]: number } = {};
    portfolioData.data.forEach(inv => {
      const value = parseFloat(inv.current_value);
      distribution[inv.type] = (distribution[inv.type] || 0) + value;
    });
    return distribution;
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

  if (!portfolioData) return null;

  const { summary } = portfolioData;
  const totalProfitLoss = parseFloat(summary.totalProfitLoss);
  const totalProfitLossPercentage = parseFloat(summary.totalProfitLossPercentage);
  const filteredInvestments = getFilteredInvestments();
  const distribution = getDistribution();
  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);

  const typeLabels: { [key: string]: string } = {
    stock: 'Stocks',
    mf: 'Mutual Funds',
    gold: 'Gold',
    crypto: 'Crypto'
  };

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
            PORTFOLIO
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setSelectedType('all')}
            style={{
              background: selectedType === 'all' ? '#C4F000' : '#ffffff',
              border: '2px solid #050505',
              padding: '6px 10px',
              fontSize: '9px',
              fontWeight: 700,
              color: '#050505',
              cursor: 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.5px'
            }}
          >
            ALL
          </button>
          {Object.keys(distribution).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                background: selectedType === type ? getTypeColor(type) : '#ffffff',
                border: '2px solid #050505',
                padding: '6px 10px',
                fontSize: '9px',
                fontWeight: 700,
                color: '#050505',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.5px'
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}
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
            TOTAL INVESTED
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#050505' }}>
            {formatCurrency(summary.totalInvested)}
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
            CURRENT VALUE
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#050505' }}>
            {formatCurrency(summary.totalCurrentValue)}
          </div>
        </div>

        <div style={{
          flex: 1,
          background: totalProfitLoss >= 0 ? '#9BC400' : '#DC2626',
          border: '2px solid #050505',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: totalProfitLoss >= 0 ? '#050505' : '#ffffff', marginBottom: '4px', letterSpacing: '0.5px' }}>
            PROFIT & LOSS
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: totalProfitLoss >= 0 ? '#050505' : '#ffffff' }}>
            {totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss)}
          </div>
        </div>

        <div style={{
          flex: 1,
          background: totalProfitLoss >= 0 ? '#7DA600' : '#991B1B',
          border: '2px solid #050505',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff', marginBottom: '4px', letterSpacing: '0.5px' }}>
            TOTAL RETURN
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
            {totalProfitLossPercentage >= 0 ? '+' : ''}{totalProfitLossPercentage.toFixed(2)}%
          </div>
        </div>
      </div>



      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '16px 20px',
        display: 'flex',
        gap: '20px',
        overflow: 'hidden'
      }}>
        {/* Left - Investments Grid */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
          alignContent: 'start'
        }}>
          {filteredInvestments.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              gap: '12px'
            }}>
              <div style={{ fontSize: '48px', opacity: 0.2 }}>📈</div>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#050505',
                opacity: 0.5
              }}>
                NO INVESTMENTS FOUND
              </div>
            </div>
          ) : (
            filteredInvestments.map((investment) => {
              const profitLoss = parseFloat(investment.profit_loss);
              const profitLossPercentage = parseFloat(investment.profit_loss_percentage);
              const isProfit = profitLoss >= 0;

              return (
                <div
                  key={investment.id}
                  style={{
                    background: '#ffffff',
                    border: '2px solid #050505',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    position: 'relative',
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
                  {/* Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: getTypeColor(investment.type),
                    border: '1px solid #050505',
                    padding: '2px 6px',
                    fontSize: '7px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {investment.type}
                  </div>

                  {/* Asset Name */}
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#050505',
                    paddingRight: '50px',
                    marginBottom: '2px'
                  }}>
                    {investment.asset_name}
                  </div>

                  {/* Platform & Quantity */}
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    fontSize: '8px',
                    fontWeight: 700,
                    color: '#050505',
                    opacity: 0.6
                  }}>
                    <span>{investment.platform}</span>
                    <span>•</span>
                    <span>QTY: {investment.quantity}</span>
                  </div>

                  {/* Mini Graph */}
                  <div style={{ margin: '2px 0' }}>
                    <MiniGraph investment={investment} />
                  </div>

                  {/* Prices */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px',
                    paddingBottom: '6px',
                    borderBottom: '1px solid #e5e5e5'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '7px',
                        fontWeight: 700,
                        color: '#050505',
                        opacity: 0.5,
                        marginBottom: '2px'
                      }}>
                        BUY
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#050505' }}>
                        ₹{investment.buy_price.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '7px',
                        fontWeight: 700,
                        color: '#050505',
                        opacity: 0.5,
                        marginBottom: '2px'
                      }}>
                        NOW
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#050505' }}>
                        ₹{investment.current_price.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Investment & Value */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '6px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '7px',
                        fontWeight: 700,
                        color: '#050505',
                        opacity: 0.5,
                        marginBottom: '2px'
                      }}>
                        INVESTED
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#050505' }}>
                        {formatCompactCurrency(investment.total_investment)}
                      </div>
                    </div>
                    <div>
                      <div style={{
                        fontSize: '7px',
                        fontWeight: 700,
                        color: '#050505',
                        opacity: 0.5,
                        marginBottom: '2px'
                      }}>
                        VALUE
                      </div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#050505' }}>
                        {formatCompactCurrency(investment.current_value)}
                      </div>
                    </div>
                  </div>

                  {/* P&L Footer */}
                  <div style={{
                    background: isProfit ? '#C4F000' : '#FEE2E2',
                    border: '1px solid #050505',
                    padding: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '2px'
                  }}>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: isProfit ? '#050505' : '#DC2626'
                    }}>
                      {isProfit ? '+' : ''}{formatCompactCurrency(investment.profit_loss)}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: isProfit ? '#050505' : '#DC2626'
                    }}>
                      {isProfit ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right - Pie Chart */}
        <div style={{
          width: '300px',
          background: '#ffffff',
          border: '2px solid #050505',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#050505',
            letterSpacing: '1px'
          }}>
            ASSET DISTRIBUTION
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <canvas ref={pieChartRef} width={200} height={200} />
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {Object.entries(distribution).map(([type, value]) => (
              <div
                key={type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px',
                  background: selectedType === type ? '#f5f5f5' : 'transparent',
                  border: selectedType === type ? '1px solid #050505' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setSelectedType(type)}
                onMouseEnter={(e) => {
                  if (selectedType !== type) {
                    e.currentTarget.style.background = '#fafafa';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedType !== type) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    background: getTypeColor(type),
                    border: '1px solid #050505'
                  }} />
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#050505',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    {typeLabels[type]}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#050505'
                  }}>
                    {((value / total) * 100).toFixed(1)}%
                  </span>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 600,
                    color: '#050505',
                    opacity: 0.5
                  }}>
                    {formatCompactCurrency(value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}