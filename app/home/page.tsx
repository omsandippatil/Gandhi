"use client";

import React, { useState } from 'react';
import { ShoppingCart, FileText, Calculator, MessageSquare, Newspaper, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  const [pieMode, setPieMode] = useState('expense');
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);

  const balance = 125000;
  const budget = 50000;
  const spent = 32500;
  
  const expenseData = [
    { name: 'FOOD', value: 12000, color: '#CCFF00' },
    { name: 'RENT', value: 15000, color: '#050505' },
    { name: 'TRANSPORT', value: 3500, color: '#FFFFFF' }
  ];

  const incomeData = [
    { name: 'SALARY', value: 75000, color: '#CCFF00' },
    { name: 'FREELANCE', value: 25000, color: '#050505' }
  ];

  const dreams = [
    { name: 'CAR', saved: 45000, target: 500000 },
    { name: 'PHONE', saved: 28000, target: 80000 },
    { name: 'EMERGENCY', saved: 75000, target: 200000 },
    { name: 'HEALTH INS', saved: 12000, target: 25000 }
  ];

  const portfolio = [
    { name: 'SIP', amount: 125000, returns: 8.5 },
    { name: 'GOLD', amount: 45000, returns: 12.3 },
    { name: 'STOCKS', amount: 85000, returns: -3.2 }
  ];

  const transactions = [
    { desc: 'VADA PAV BINGE', amount: -450, date: '22 NOV' },
    { desc: 'SALARY CREDITED', amount: 75000, date: '21 NOV' },
    { desc: 'UBER AUTO', amount: -120, date: '21 NOV' }
  ];

  const bills = [
    { name: 'ELECTRICITY', amount: 3200, due: '25 NOV' },
    { name: 'WIFI', amount: 999, due: '28 NOV' }
  ];

  const currentData = pieMode === 'expense' ? expenseData : incomeData;
  const total = currentData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{
      fontFamily: "'Space Grotesk', monospace",
      background: '#F5F5F5',
      minHeight: '100vh',
      padding: '1vw',
      boxSizing: 'border-box',
      backgroundImage: `
        repeating-conic-gradient(#050505 0% 25%, #E8E8E8 0% 50%) 50% / 40px 40px
      `,
      backgroundSize: '40px 40px'
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
              background: '#CCFF00',
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
            dem@gandhi.money
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: '0.6fr 1.5fr 0.8fr 0.8fr',
        gap: 'clamp(8px, 0.8vw, 12px)',
        height: 'calc(100vh - 60px)',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        
        <div className="brutal-shadow" style={{
          background: '#CCFF00',
          border: '3px solid #050505',
          padding: 'clamp(8px, 0.8vw, 12px)',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '6px', letterSpacing: '1px', color: '#050505' }}>
            BALANCE
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(16px, 1.5vw, 22px)', fontWeight: 800, marginBottom: '4px', color: '#050505' }}>
            ₹{balance.toLocaleString('en-IN')}
          </div>
          <div style={{ fontFamily: "'Hind Guntur', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 700, color: '#050505', marginTop: 'auto' }}>
            एक पेटी पच्चीस हजार
          </div>
        </div>

        <div className="brutal-shadow" style={{
          background: '#FFFFFF',
          border: '3px solid #050505',
          padding: 'clamp(8px, 0.8vw, 12px)',
          color: '#050505',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '6px', letterSpacing: '1px', color: '#050505' }}>
            SPEND METER
          </div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(14px, 1.2vw, 18px)', fontWeight: 800, marginBottom: '8px', color: '#050505' }}>
            ₹{spent.toLocaleString('en-IN')}
          </div>
          <div style={{ background: '#F5F5F5', height: 'clamp(10px, 0.8vw, 12px)', border: '2px solid #050505', position: 'relative', marginTop: 'auto' }}>
            <div style={{
              background: '#CCFF00',
              height: '100%',
              width: `${(spent / budget) * 100}%`,
              transition: 'width 0.5s'
            }} />
          </div>
          <div style={{ fontSize: 'clamp(7px, 0.6vw, 8px)', marginTop: '4px', fontWeight: 700, color: '#050505' }}>
            {((spent / budget) * 100).toFixed(0)}% OF ₹{budget.toLocaleString('en-IN')}
          </div>
        </div>

        <div className="brutal-shadow" style={{
          background: '#CCFF00',
          border: '3px solid #050505',
          padding: 'clamp(8px, 0.8vw, 12px)',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px', color: '#050505' }}>
            FORECAST
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'stretch', position: 'relative', minHeight: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ display: 'block' }}>
              <polyline
                points="0,25 16,30 33,12 50,22 66,8 83,18 100,10"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
              />
              <polyline
                points="0,25 16,30 33,12 50,22 66,8 83,18 100,10 100,40 0,40"
                fill="#FFFFFF"
                opacity="0.3"
              />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#050505" strokeWidth="2"/>
            </svg>
          </div>
          <div style={{ fontSize: 'clamp(7px, 0.6vw, 8px)', marginTop: '6px', fontWeight: 700, color: '#050505' }}>
            NEXT SALARY IN 8 DAYS
          </div>
        </div>

        <div className="brutal-shadow" style={{
          background: '#FFFFFF',
          border: '3px solid #050505',
          padding: 'clamp(8px, 0.8vw, 12px)',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '10px', letterSpacing: '1px', color: '#050505' }}>
            DREAMS & SAFETY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 0.6vw, 10px)', flex: 1 }}>
            {dreams.map((dream, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: 'clamp(7px, 0.6vw, 8px)', fontWeight: 700, marginBottom: '4px', color: '#050505' }}>
                  {dream.name}: ₹{dream.saved.toLocaleString('en-IN')}/₹{dream.target.toLocaleString('en-IN')}
                </div>
                <div style={{ background: '#050505', height: 'clamp(6px, 0.5vw, 8px)', border: '2px solid #050505' }}>
                  <div style={{
                    background: '#CCFF00',
                    height: '100%',
                    width: `${(dream.saved / dream.target) * 100}%`
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="brutal-shadow" style={{
          background: '#FFFFFF',
          border: '3px solid #050505',
          padding: 'clamp(8px, 0.8vw, 12px)',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, letterSpacing: '1px', color: '#050505' }}>
              {pieMode.toUpperCase()}
            </div>
            <button
              onClick={() => setPieMode(pieMode === 'expense' ? 'income' : 'expense')}
              style={{
                background: pieMode === 'expense' ? '#CCFF00' : '#FFFFFF',
                color: '#050505',
                border: '2px solid #050505',
                padding: 'clamp(3px, 0.3vw, 4px) clamp(6px, 0.6vw, 8px)',
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(6px, 0.5vw, 7px)',
                fontWeight: 800,
                cursor: 'pointer',
                letterSpacing: '0.5px'
              }}
            >
              TOGGLE
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px', flex: 1 }}>
            <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ maxWidth: '130px', maxHeight: '130px' }}>
              {currentData.map((item, i) => {
                const prevTotal = currentData.slice(0, i).reduce((sum, d) => sum + d.value, 0);
                const startAngle = (prevTotal / total) * 360;
                const endAngle = ((prevTotal + item.value) / total) * 360;
                const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
                
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                
                const x1 = 100 + 80 * Math.cos(startRad);
                const y1 = 100 + 80 * Math.sin(startRad);
                const x2 = 100 + 80 * Math.cos(endRad);
                const y2 = 100 + 80 * Math.sin(endRad);
                
                return (
                  <path
                    key={i}
                    d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={item.color}
                    stroke="#050505"
                    strokeWidth="3"
                  />
                );
              })}
            </svg>
          </div>
          
          <div>
            {currentData.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: 'clamp(7px, 0.6vw, 8px)', fontWeight: 700, color: '#050505' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '9px', height: '9px', background: item.color, border: '2px solid #050505' }} />
                  {item.name}
                </div>
                <div>₹{item.value.toLocaleString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(4px, 0.6vw, 8px)' }}>
          <div className="brutal-shadow" style={{
            background: '#CCFF00',
            border: '3px solid #050505',
            padding: 'clamp(8px, 0.8vw, 12px)',
            color: '#050505',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            flex: '12 1 0',
            minHeight: 0
          }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(4px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px', color: '#050505' }}>
              INCOME VS EXPENSE
            </div>
            <div style={{ display: 'flex', gap: '4px', flex: 1, alignItems: 'flex-end', minHeight: 0 }}>
              {[
                { income: 80, expense: 40 },
                { income: 85, expense: 55 },
                { income: 75, expense: 35 },
                { income: 90, expense: 65 }
              ].map((data, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', gap: '2px', alignItems: 'flex-end', height: '100%' }}>
                  <div style={{
                    flex: 1,
                    background: '#050505',
                    height: `${data.income}%`,
                    border: '2px solid #050505'
                  }} />
                  <div style={{
                    flex: 1,
                    background: '#FFFFFF',
                    height: `${data.expense}%`,
                    border: '2px solid #050505'
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: 'clamp(6px, 0.5vw, 7px)', fontWeight: 700, color: '#050505' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '7px', height: '7px', background: '#050505', border: '2px solid #050505' }} />
                INCOME
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <div style={{ width: '7px', height: '7px', background: '#FFFFFF', border: '2px solid #050505' }} />
                EXPENSE
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'clamp(4px, 0.4vw, 6px)',
            flex: '0.4 0 auto'
          }}>
            {[
              { icon: ShoppingCart, bg: '#CCFF00' },
              { icon: FileText, bg: '#FFFFFF' },
              { icon: Calculator, bg: '#CCFF00' },
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

        <div className="brutal-shadow" style={{
          background: '#FFFFFF',
          border: '3px solid #050505',
          padding: 'clamp(8px, 0.8vw, 12px)',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '10px', letterSpacing: '1px', color: '#050505' }}>
            RECENT
          </div>
          {transactions.map((txn, i) => (
            <div key={i} style={{
              background: txn.amount > 0 ? '#CCFF00' : '#FFFFFF',
              border: '2px solid #050505',
              padding: 'clamp(8px, 0.8vw, 12px)',
              marginBottom: i === transactions.length - 1 ? '0' : 'clamp(6px, 0.6vw, 10px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  fontSize: 'clamp(7px, 0.6vw, 9px)',
                  fontWeight: 700,
                  color: '#050505'
                }}>
                  {txn.desc}
                </div>
                <div style={{
                  fontSize: 'clamp(6px, 0.5vw, 7px)',
                  color: '#050505',
                  marginTop: '2px'
                }}>
                  {txn.date}
                </div>
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(9px, 0.8vw, 11px)',
                fontWeight: 800,
                color: txn.amount > 0 ? '#050505' : '#FF0000'
              }}>
                {txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount).toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>

        <div className="brutal-shadow" style={{
          background: '#CCFF00',
          border: '3px solid #050505',
          padding: 'clamp(8px, 0.8vw, 12px)',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Newspaper size={12} strokeWidth={3} color="#050505" />
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, letterSpacing: '1px', color: '#050505' }}>
              FINANCIAL NEWS
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 0.6vw, 10px)', flex: 1 }}>
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: 'clamp(8px, 0.8vw, 12px)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(9px, 0.8vw, 11px)',
                fontWeight: 800,
                marginBottom: '4px',
                lineHeight: '1.3',
                color: '#050505'
              }}>
                SENSEX HITS ALL-TIME HIGH
              </div>
              <div style={{
                fontSize: 'clamp(7px, 0.6vw, 8px)',
                fontWeight: 700,
                color: '#050505'
              }}>
                4 HRS AGO
              </div>
            </div>
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #050505',
              padding: 'clamp(8px, 0.8vw, 12px)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 'clamp(9px, 0.8vw, 11px)',
                fontWeight: 800,
                marginBottom: '4px',
                lineHeight: '1.3',
                color: '#050505'
              }}>
                RBI CUTS REPO RATE
              </div>
              <div style={{
                fontSize: 'clamp(7px, 0.6vw, 8px)',
                fontWeight: 700,
                color: '#050505'
              }}>
                1 DAY AGO
              </div>
            </div>
          </div>
        </div>

        <div className="brutal-shadow" style={{
          gridColumn: 'span 2',
          background: '#CCFF00',
          border: '3px solid #050505',
          padding: 'clamp(10px, 1vw, 14px)',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(9px, 0.8vw, 11px)', fontWeight: 800, marginBottom: '12px', letterSpacing: '1px', color: '#050505' }}>
            PORTFOLIO
          </div>
          <div style={{ display: 'flex', gap: 'clamp(8px, 0.8vw, 10px)', flex: 1 }}>
            {portfolio.map((item, i) => (
              <div key={i} style={{
                flex: 1,
                background: '#FFFFFF',
                border: '2px solid #050505',
                padding: 'clamp(10px, 1vw, 14px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 'clamp(7px, 0.6vw, 9px)',
                  fontWeight: 800,
                  marginBottom: '8px',
                  color: '#050505',
                  letterSpacing: '0.5px'
                }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: 'clamp(11px, 1vw, 14px)',
                  fontWeight: 700,
                  marginBottom: '6px',
                  color: '#050505'
                }}>
                  ₹{item.amount.toLocaleString('en-IN')}
                </div>
                <div style={{
                  fontSize: 'clamp(9px, 0.8vw, 11px)',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: item.returns > 0 ? '#050505' : '#FF0000'
                }}>
                  {item.returns > 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {item.returns > 0 ? '+' : ''}{item.returns}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="brutal-shadow" style={{
          gridColumn: 'span 2',
          background: '#FFFFFF',
          border: '3px solid #050505',
          padding: 'clamp(10px, 1vw, 14px)',
          color: '#050505',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(8px, 0.7vw, 10px)', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.5px', color: '#050505' }}>
            UPCOMING BILLS
          </div>
          <div style={{ display: 'flex', gap: 'clamp(10px, 1vw, 12px)', flex: 1 }}>
            {bills.map((bill, i) => (
              <div key={i} style={{
                flex: 1,
                background: '#CCFF00',
                border: '2px solid #050505',
                padding: 'clamp(10px, 1vw, 14px)',
                color: '#050505',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <div style={{ fontSize: 'clamp(7px, 0.6vw, 9px)', fontWeight: 700, marginBottom: '8px', color: '#050505' }}>
                  {bill.name}
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(12px, 1.1vw, 16px)', fontWeight: 800, marginBottom: '6px', color: '#050505' }}>
                  ₹{bill.amount}
                </div>
                <div style={{ fontSize: 'clamp(7px, 0.6vw, 8px)', fontWeight: 700, color: '#050505' }}>
                  DUE: {bill.due}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;