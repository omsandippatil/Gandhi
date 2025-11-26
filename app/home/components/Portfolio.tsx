"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioItem {
  id: string;
  type: string;
  asset_name: string;
  current_value: string;
  profit_loss: string;
  profit_loss_percentage: string;
}

interface PortfolioSummary {
  stocks: { value: number; returns: number };
  mf: { value: number; returns: number };
  gold: { value: number; returns: number };
}

const PortfolioCard = () => {
  const [portfolio, setPortfolio] = useState<PortfolioSummary>({
    stocks: { value: 0, returns: 0 },
    mf: { value: 0, returns: 0 },
    gold: { value: 0, returns: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/get/portfolio');
        const result = await response.json();
        
        if (result.success) {
          // Group by type and calculate cumulative values
          const grouped: PortfolioSummary = {
            stocks: { value: 0, returns: 0 },
            mf: { value: 0, returns: 0 },
            gold: { value: 0, returns: 0 }
          };

          let stocksInvestment = 0;
          let stocksProfit = 0;
          let mfInvestment = 0;
          let mfProfit = 0;

          result.data.forEach((item: PortfolioItem) => {
            const currentValue = parseFloat(item.current_value);
            const profitLoss = parseFloat(item.profit_loss);

            if (item.type === 'stock') {
              grouped.stocks.value += currentValue;
              stocksInvestment += (currentValue - profitLoss);
              stocksProfit += profitLoss;
            } else if (item.type === 'mf') {
              grouped.mf.value += currentValue;
              mfInvestment += (currentValue - profitLoss);
              mfProfit += profitLoss;
            } else if (item.type === 'gold') {
              grouped.gold.value += currentValue;
            }
          });

          // Calculate returns percentage
          if (stocksInvestment > 0) {
            grouped.stocks.returns = (stocksProfit / stocksInvestment) * 100;
          }
          if (mfInvestment > 0) {
            grouped.mf.returns = (mfProfit / mfInvestment) * 100;
          }

          setPortfolio(grouped);
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  const portfolioDisplay = [
    { name: 'SIP', amount: portfolio.mf.value, returns: portfolio.mf.returns },
    { name: 'GOLD', amount: portfolio.gold.value, returns: portfolio.gold.returns },
    { name: 'STOCKS', amount: portfolio.stocks.value, returns: portfolio.stocks.returns }
  ];

  return (
    <div className="brutal-shadow" style={{
      gridColumn: 'span 2',
      background: '#C4F000',
      border: '3px solid #050505',
      padding: 'clamp(10px, 1vw, 14px)',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      minWidth: 0,
      minHeight: 0
    }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(10px, 1vw, 14px)', fontWeight: 800, marginBottom: '12px', letterSpacing: '1px', color: '#050505' }}>
        PORTFOLIO
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', gap: 'clamp(8px, 0.8vw, 10px)', flex: 1, minHeight: 0 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              flex: 1,
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: 'clamp(10px, 1vw, 14px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 0
            }}>
              <div style={{
                background: '#050505',
                opacity: 0.1,
                height: 'clamp(8px, 0.7vw, 10px)',
                width: '50%',
                marginBottom: '8px',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`
              }} />
              <div style={{
                background: '#050505',
                opacity: 0.1,
                height: 'clamp(12px, 1.1vw, 15px)',
                width: '70%',
                marginBottom: '6px',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1 + 0.2}s`
              }} />
              <div style={{
                background: '#050505',
                opacity: 0.1,
                height: 'clamp(10px, 0.9vw, 12px)',
                width: '40%',
                borderRadius: '4px',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1 + 0.4}s`
              }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 'clamp(8px, 0.8vw, 10px)', flex: 1, minHeight: 0 }}>
          {portfolioDisplay.map((item, i) => {
            const bgColor = item.name === 'SIP' ? '#FFFFFF' : '#FFFFFF';
            return (
            <div key={i} style={{
              flex: 1,
              background: bgColor,
              border: '2px solid #050505',
              padding: 'clamp(10px, 1vw, 14px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minWidth: 0
            }}>
              <div style={{
                fontSize: 'clamp(8px, 0.75vw, 10px)',
                fontWeight: 700,
                marginBottom: '8px',
                color: '#050505'
              }}>
                {item.name}
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(14px, 1.3vw, 18px)',
                fontWeight: 800,
                marginBottom: '6px',
                color: '#050505'
              }}>
                ₹{Math.round(item.amount).toLocaleString('en-IN')}
              </div>
              <div style={{
                fontSize: 'clamp(8px, 0.7vw, 9px)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: item.returns > 0 ? '#050505' : '#FF0000'
              }}>
                {item.returns !== 0 && (
                  <>
                    {item.returns > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {item.returns > 0 ? '+' : ''}{item.returns.toFixed(2)}%
                  </>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default PortfolioCard;