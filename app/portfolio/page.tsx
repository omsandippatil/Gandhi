'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, TrendingUp, BarChart3 } from 'lucide-react';

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
    
    // Generate random but realistic price movement data
    const points = 20;
    const data: number[] = [];
    const buyPrice = investment.buy_price;
    const currentPrice = investment.current_price;
    
    // Create a path from buy to current with some volatility
    for (let i = 0; i < points; i++) {
      const progress = i / (points - 1);
      const baseValue = buyPrice + (currentPrice - buyPrice) * progress;
      const volatility = (Math.random() - 0.5) * (buyPrice * 0.1);
      data.push(baseValue + volatility);
    }

    // Normalize data to canvas height
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    const range = maxVal - minVal || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw line graph
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

    // Fill area under curve
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = isProfit ? 'rgba(125, 166, 0, 0.15)' : 'rgba(220, 38, 38, 0.15)';
    ctx.fill();

  }, [investment]);

  return <canvas ref={canvasRef} width={110} height={30} />;
};

const PieChart = ({ investments }: { investments: Investment[] }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate distribution by type
    const distribution: { [key: string]: number } = {};
    investments.forEach(inv => {
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

    // Draw center circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.55, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

  }, [investments]);

  // Calculate distribution percentages
  const distribution: { [key: string]: number } = {};
  investments.forEach(inv => {
    const value = parseFloat(inv.current_value);
    distribution[inv.type] = (distribution[inv.type] || 0) + value;
  });
  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);

  const typeLabels: { [key: string]: string } = {
    stock: 'Stocks',
    mf: 'Mutual Funds',
    gold: 'Gold',
    crypto: 'Crypto'
  };

  const colors: { [key: string]: string } = {
    stock: '#C4F000',
    mf: '#9BC400',
    gold: '#7DA600',
    crypto: '#5E8800'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
      <canvas ref={canvasRef} width={200} height={200} style={{ display: 'block', margin: '0 auto' }} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {Object.entries(distribution).map(([type, value]) => (
          <div key={type} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '10px',
            fontWeight: 700
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: colors[type]
              }} />
              <span style={{ color: '#050505', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                {typeLabels[type]}
              </span>
            </div>
            <span style={{ color: '#050505' }}>
              {((value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CompactPortfolioDashboard() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

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

  const formatCurrency = (amount: string | number) => {
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

  const { data: investments, summary } = portfolioData;
  const totalProfitLoss = parseFloat(summary.totalProfitLoss);
  const totalProfitLossPercentage = parseFloat(summary.totalProfitLossPercentage);

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
        <button style={{
          background: '#050505',
          border: '2px solid #050505',
          color: '#C4F000',
          padding: '8px 16px',
          fontSize: '11px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          letterSpacing: '0.5px'
        }}>
          <BarChart3 size={16} strokeWidth={3} />
          ANALYZE
        </button>
      </div>

      <div style={{
        flex: 1,
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '16px',
        overflow: 'hidden'
      }}>
        {/* Left Column - Summary Cards + Pie Chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'auto' }}>
          {/* Summary Cards */}
          <div style={{
            background: '#C4F000',
            border: '2px solid #050505',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '8px', fontWeight: 700, color: '#050505', marginBottom: '4px', letterSpacing: '0.5px', opacity: 0.7 }}>
              TOTAL INVESTED
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#050505' }}>
              ₹{(parseFloat(summary.totalInvested) / 1000).toFixed(0)}k
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '8px', fontWeight: 700, color: '#050505', marginBottom: '4px', letterSpacing: '0.5px', opacity: 0.7 }}>
              CURRENT VALUE
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#050505' }}>
              ₹{(parseFloat(summary.totalCurrentValue) / 1000).toFixed(0)}k
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '8px', fontWeight: 700, color: '#050505', marginBottom: '4px', letterSpacing: '0.5px', opacity: 0.7 }}>
              PROFIT & LOSS
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: totalProfitLoss >= 0 ? '#7DA600' : '#DC2626' }}>
              {totalProfitLoss >= 0 ? '+' : ''}₹{(totalProfitLoss / 1000).toFixed(1)}k
            </div>
          </div>

          <div style={{
            background: totalProfitLoss >= 0 ? '#9BC400' : '#DC2626',
            border: '2px solid #050505',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ fontSize: '8px', fontWeight: 700, color: totalProfitLoss >= 0 ? '#050505' : '#ffffff', marginBottom: '4px', letterSpacing: '0.5px', opacity: totalProfitLoss >= 0 ? 0.7 : 0.9 }}>
              TOTAL RETURN
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: totalProfitLoss >= 0 ? '#050505' : '#ffffff' }}>
              {totalProfitLossPercentage >= 0 ? '+' : ''}{totalProfitLossPercentage.toFixed(2)}%
            </div>
          </div>

          {/* Pie Chart */}
          <div style={{
            background: '#ffffff',
            border: '2px solid #050505',
            padding: '12px',
            marginTop: '4px'
          }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 800,
              color: '#050505',
              letterSpacing: '1px',
              marginBottom: '12px'
            }}>
              ASSET DISTRIBUTION
            </div>
            <PieChart investments={investments} />
          </div>
        </div>

        {/* Right Column - Investments Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '10px',
          alignContent: 'start',
          overflowY: 'auto'
        }}>
          {investments.map((investment) => {
            const profitLoss = parseFloat(investment.profit_loss);
            const profitLossPercentage = parseFloat(investment.profit_loss_percentage);
            const isProfit = profitLoss >= 0;

            return (
              <div key={investment.id} style={{
                background: '#ffffff',
                border: '2px solid #050505',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                position: 'relative',
                height: 'fit-content'
              }}>
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
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#050505', paddingRight: '50px', letterSpacing: '0.3px' }}>
                  {investment.asset_name}
                </div>

                {/* Platform & Quantity */}
                <div style={{ display: 'flex', gap: '8px', fontSize: '8px', fontWeight: 700, color: '#050505', opacity: 0.6, letterSpacing: '0.3px' }}>
                  <span>{investment.platform}</span>
                  <span>•</span>
                  <span>QTY: {investment.quantity}</span>
                </div>

                {/* Mini Graph */}
                <div style={{ marginTop: '2px', marginBottom: '2px' }}>
                  <MiniGraph investment={investment} />
                </div>

                {/* Prices */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>
                    <div style={{ fontSize: '7px', fontWeight: 700, color: '#050505', opacity: 0.5, letterSpacing: '0.5px' }}>BUY</div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#050505' }}>₹{investment.buy_price.toLocaleString()}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '7px', fontWeight: 700, color: '#050505', opacity: 0.5, letterSpacing: '0.5px' }}>CURRENT</div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#050505' }}>₹{investment.current_price.toLocaleString()}</div>
                  </div>
                </div>

                {/* Investment & Value */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', paddingTop: '6px', borderTop: '1px solid #e5e5e5' }}>
                  <div>
                    <div style={{ fontSize: '7px', fontWeight: 700, color: '#050505', opacity: 0.5, letterSpacing: '0.5px' }}>INVESTED</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#050505' }}>
                      {formatCurrency(investment.total_investment)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '7px', fontWeight: 700, color: '#050505', opacity: 0.5, letterSpacing: '0.5px' }}>VALUE</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#050505' }}>
                      {formatCurrency(investment.current_value)}
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
                  <div style={{ fontSize: '10px', fontWeight: 800, color: isProfit ? '#050505' : '#DC2626' }}>
                    {isProfit ? '+' : ''}{formatCurrency(investment.profit_loss)}
                  </div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: isProfit ? '#050505' : '#DC2626' }}>
                    {isProfit ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}