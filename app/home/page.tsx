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
import NewsCard from './components/Borrowings';
import PortfolioCard from './components/Portfolio';
import BillboardCard from './components/Billboard';
import NotificationPopup from './components/ui/Notification';

const Dashboard = () => {
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

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

        .card-link {
          text-decoration: none;
          color: inherit;
          display: contents;
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
          <NotificationPopup 
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />
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
            onClick={() => handleNavigation('/leaderboard')}
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
        
        <a href="/balance" className="card-link">
          <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <BalanceCard />
          </div>
        </a>
        <a href="/spend" className="card-link">
          <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <SpendMeterCard />
          </div>
        </a>
        <a href="/forecast" className="card-link">
          <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <ForecastCard />
          </div>
        </a>
        <a href="/funds" className="card-link">
          <div style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            <FundsCard />
          </div>
        </a>
        
        <a href="/expense-income" className="card-link">
          <ExpenseIncomeCard />
        </a>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 0.6vw, 8px)' }}>
          <a href="/chart" className="card-link">
            <IncomeExpenseChartCard />
          </a>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(4px, 0.4vw, 6px)',
            flex: '0.02 0 auto'
          }}>
            {[
              { icon: ShoppingCart, bg: '#C4F000', path: '/smartbuy' },
              { icon: FileText, bg: '#FFFFFF', path: '/tax' },
              { icon: Calculator, bg: '#C4F000', path: '/plan' },
              { icon: MessageSquare, bg: '#FFFFFF', path: '/chat' }
            ].map((btn, i) => {
              const Icon = btn.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleNavigation(btn.path)}
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

        <a href="/transactions" className="card-link">
          <TransactionsCard />
        </a>
        <a href="/borrowings" className="card-link">
          <NewsCard />
        </a>
        <a href="/portfolio" className="card-link">
          <PortfolioCard />
        </a>
        <a href="/billboard" className="card-link">
          <BillboardCard />
        </a>

      </div>
    </div>
  );
};

export default Dashboard;