"use client";

import React, { useState } from 'react';
import { ShoppingCart, FileText, Calculator, MessageSquare } from 'lucide-react';
import BalanceCard from './components/Balance'
import SpendMeterCard from './components/SpendMeter';
import ForecastCard from './components/Forecast';
import FundsCard from './components/Funds';
import ExpenseIncomeCard from './components/ExpenseIncome';
import IncomeExpenseChartCard from './components/IncomeExpenseChart';
import TransactionsCard from './components/Transactions';
import NewsCard from './components/News';
import PortfolioCard from './components/Portfolio';
import BillboardCard from './components/Billboard';

const Dashboard = () => {
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);

  return (
    <div style={{
      fontFamily: "'Space Grotesk', monospace",
      background: '#F5F5F5',
      minHeight: '100vh',
      padding: '1vw',
      boxSizing: 'border-box',
      backgroundImage: `repeating-conic-gradient(#050505 0% 25%, #E8E8E8 0% 50%) 50% / 40px 40px`,
      backgroundSize: '40px 40px',
      backgroundAttachment: 'fixed'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;700&family=Hind+Guntur:wght@700&family=Inter:wght@700;800&display=swap');
        
        .brutal-shadow {
          box-shadow: 0.3vw 0.3vw 0 #050505;
        }
        
        .brutal-shadow:hover {
          transform: translate(0.15vw, 0.15vw);
          box-shadow: 0.15vw 0.15vw 0 #050505;
        }

        button {
          transition: all 0.2s ease;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 0',
        marginBottom: '6px'
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(14px, 1.4vw, 18px)',
          fontWeight: 800,
          color: '#050505',
          letterSpacing: '1.5px'
        }}>
          GANDHI
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(8px, 0.7vw, 10px)',
          fontWeight: 700,
          color: '#050505'
        }}>
          <div style={{ 
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              background: '#C4F000',
              border: '2px solid #050505',
              padding: '4px 8px',
              fontWeight: 800
            }}>
              PAISHE: 2,450
            </div>
          </div>
          <button
            style={{
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: '4px 8px',
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(8px, 0.7vw, 10px)',
              fontWeight: 800,
              cursor: 'pointer',
              letterSpacing: '0.5px',
              color: '#050505',
              boxShadow: '2px 2px 0 #050505',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = '1px 1px 0 #050505';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = '2px 2px 0 #050505';
            }}
          >
            LEADERBOARD: #127
          </button>
          <div style={{ 
            letterSpacing: '0.5px',
            fontWeight: 600,
            color: '#666'
          }}>
            demo@gandhi.money
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: '1.4 fr 1.5fr 0.8fr 0.8fr',
        gap: 'clamp(8px, 0.8vw, 12px)',
        height: 'calc(100vh - 60px)',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        
        <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <BalanceCard />
        </div>
        <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <SpendMeterCard />
        </div>
        <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <ForecastCard />
        </div>
        <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <FundsCard />
        </div>
        <ExpenseIncomeCard />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 0.6vw, 8px)' }}>
          <IncomeExpenseChartCard />

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(4px, 0.4vw, 6px)',
            flex: '0.02 0 auto'
          }}>
            {[
              { icon: ShoppingCart, bg: '#C4F000' },
              { icon: FileText, bg: '#FFFFFF' },
              { icon: Calculator, bg: '#C4F000' },
              { icon: MessageSquare, bg: '#FFFFFF' }
            ].map((btn, i) => {
              const Icon = btn.icon;
              return (
                <button
                  key={i}
                  onMouseEnter={() => setHoveredButton(i)}
                  onMouseLeave={() => setHoveredButton(null)}
                  className={hoveredButton === i ? '' : 'brutal-shadow'}
                  style={{
                    background: btn.bg,
                    border: '3px solid #050505',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#050505',
                    padding: '0',
                    aspectRatio: '1 / 1',
                    width: '100%'
                  }}
                >
                  <Icon size={14} strokeWidth={3} />
                </button>
              );
            })}
          </div>
        </div>

        <TransactionsCard />
        <NewsCard />
        <PortfolioCard />
        <BillboardCard />

      </div>
    </div>
  );
};

export default Dashboard;