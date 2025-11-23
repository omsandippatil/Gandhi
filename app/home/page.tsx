'use client';

import Link from 'next/link';

export default function Maintenance() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;700&family=Hind+Guntur:wght@700&family=Bungee+Inline&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Space Grotesk', monospace;
          background: #F5F5F5;
          color: #050505;
          overflow-x: hidden;
          text-transform: uppercase;
        }

        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            repeating-linear-gradient(0deg, transparent, transparent 39px, #050505 39px, #050505 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, #050505 39px, #050505 40px);
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }

        body::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.05"/></svg>');
          pointer-events: none;
          z-index: 2;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes blink {
          0%, 49%, 100% { opacity: 1; }
          50%, 99% { opacity: 0; }
        }

        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <style jsx>{`
        .page-maintenance {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 60px 20px 100px;
          position: relative;
          z-index: 3;
        }

        .maintenance-banner {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 60px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .maintenance-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 6vw, 64px);
          font-weight: 800;
          background: #050505;
          color: #CCFF00;
          padding: 20px 40px;
          border: 2px solid #050505;
          box-shadow: 6px 6px 0 #CCFF00;
        }

        .warning {
          font-size: 48px;
          animation: blink 1s ease-in-out infinite;
        }

        .gandhi-meditating {
          text-align: center;
          margin-bottom: 60px;
        }

        .gandhi-icon {
          font-size: 120px;
          margin-bottom: 30px;
          display: inline-block;
          animation: rotate 4s linear infinite;
        }

        .meditation-text .main-status {
          font-family: 'Syne', sans-serif;
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 800;
          margin-bottom: 10px;
        }

        .meditation-text .sub-status {
          font-size: clamp(14px, 2vw, 18px);
          opacity: 0.7;
        }

        .maintenance-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          width: 100%;
          max-width: 900px;
          margin-bottom: 60px;
        }

        .stat-box {
          background: #CCFF00;
          border: 2px solid #050505;
          padding: 30px 20px;
          box-shadow: 6px 6px 0 #050505;
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .stat-box:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0 #050505;
        }

        .stat-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 10px;
          opacity: 0.7;
        }

        .stat-value {
          font-family: 'Bungee Inline', cursive;
          font-size: clamp(24px, 4vw, 36px);
        }

        .truth-bomb {
          width: 100%;
          max-width: 700px;
          margin-bottom: 60px;
        }

        .truth-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 800;
          text-align: center;
          margin-bottom: 30px;
        }

        .truth-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .truth-item {
          background: #050505;
          color: #CCFF00;
          border: 2px solid #050505;
          padding: 20px 25px;
          box-shadow: 6px 6px 0 #050505;
          display: flex;
          align-items: center;
          gap: 20px;
          opacity: 0;
          transform: translateX(-50px);
          animation: slideIn 0.6s forwards;
        }

        .truth-item:nth-child(2) {
          animation-delay: 0.2s;
        }

        .truth-item:nth-child(3) {
          animation-delay: 0.4s;
        }

        .truth-item:nth-child(4) {
          animation-delay: 0.6s;
        }

        .truth-number {
          font-family: 'Bungee Inline', cursive;
          font-size: 24px;
          flex-shrink: 0;
        }

        .truth-item p {
          font-size: clamp(12px, 2vw, 16px);
          font-weight: 700;
          line-height: 1.4;
        }

        .maintenance-progress {
          width: 100%;
          max-width: 700px;
          margin-bottom: 60px;
        }

        .progress-wrapper {
          background: #F5F5F5;
          border: 2px solid #050505;
          padding: 20px;
          box-shadow: 6px 6px 0 #050505;
        }

        .progress-track {
          width: 100%;
          height: 50px;
          background: #F5F5F5;
          border: 2px solid #050505;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .progress-bar-fill {
          height: 100%;
          width: 73%;
          background: #CCFF00;
          border-right: 2px solid #050505;
          animation: pulse 2s ease-in-out infinite;
        }

        .progress-text {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 700;
        }

        .progress-percent {
          color: #CCFF00;
          background: #050505;
          padding: 5px 10px;
        }

        .contact-box {
          background: #CCFF00;
          border: 2px solid #050505;
          padding: 30px;
          box-shadow: 6px 6px 0 #050505;
          text-align: center;
          margin-bottom: 40px;
          max-width: 600px;
        }

        .contact-label {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .contact-action {
          font-family: 'Syne', sans-serif;
          font-size: clamp(20px, 3vw, 28px);
          font-weight: 800;
          margin-bottom: 15px;
        }

        .contact-email {
          font-size: 14px;
          opacity: 0.7;
        }

        .marquee-scroll {
          width: 100%;
          overflow: hidden;
          margin-bottom: 40px;
        }

        .marquee-content {
          display: flex;
          white-space: nowrap;
          animation: scroll 20s linear infinite;
          font-weight: 700;
          font-size: 18px;
        }

        .marquee-content span {
          padding: 0 20px;
        }

        .brutal-btn-secondary {
          background: #050505;
          color: #CCFF00;
          border: 2px solid #050505;
          padding: 20px 40px;
          font-family: 'Space Grotesk', monospace;
          font-weight: 700;
          font-size: 16px;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 6px 6px 0 #CCFF00;
          transition: all 0.1s;
          text-decoration: none;
          display: inline-block;
        }

        .brutal-btn-secondary:hover {
          transform: translate(3px, 3px);
          box-shadow: 3px 3px 0 #CCFF00;
        }

        .brutal-btn-secondary:active {
          transform: translate(6px, 6px);
          box-shadow: 0 0 0 #CCFF00;
        }

        .receipt-clip {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background: #050505;
          color: #CCFF00;
          padding: 15px 30px;
          border: 2px solid #050505;
          border-bottom: none;
          font-size: 12px;
          font-weight: 700;
          clip-path: polygon(0 0, 100% 0, 95% 100%, 5% 100%);
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .maintenance-banner {
            gap: 15px;
          }
          
          .warning {
            font-size: 36px;
          }
          
          .gandhi-icon {
            font-size: 80px;
          }
          
          .maintenance-stats {
            grid-template-columns: 1fr;
          }
          
          .truth-item {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
          
          .contact-box {
            padding: 20px;
          }
          
          .receipt-clip {
            font-size: 10px;
            padding: 10px 20px;
          }
          
          .brutal-btn-secondary {
            padding: 15px 30px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="page-maintenance">
        <div className="maintenance-banner">
          <div className="warning">🚨</div>
          <h1 className="maintenance-title">UNDER MAINTENANCE</h1>
          <div className="warning">🚨</div>
        </div>

        <div className="gandhi-meditating">
          <div className="gandhi-icon">🕉️</div>
          <div className="meditation-text">
            <p className="main-status">GANDHI IS AUDITING YOUR EXPENSES</p>
            <p className="sub-status">THIS MAY TAKE A WHILE...</p>
          </div>
        </div>

        <div className="maintenance-stats">
          <div className="stat-box">
            <div className="stat-icon">💰</div>
            <div className="stat-label">RUPEES COUNTED</div>
            <div className="stat-value">∞</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">📊</div>
            <div className="stat-label">JUDGMENTS PASSED</div>
            <div className="stat-value">9,999+</div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">⏰</div>
            <div className="stat-label">TIME REMAINING</div>
            <div className="stat-value">UNKNOWN</div>
          </div>
        </div>

        <div className="truth-bomb">
          <h2 className="truth-title">MEANWHILE, ACCEPT THESE TRUTHS:</h2>
          <div className="truth-list">
            <div className="truth-item">
              <span className="truth-number">01.</span>
              <p>YOU DON'T NEED THAT SUBSCRIPTION</p>
            </div>
            <div className="truth-item">
              <span className="truth-number">02.</span>
              <p>IMPULSE BUYING IS NOT A PERSONALITY TRAIT</p>
            </div>
            <div className="truth-item">
              <span className="truth-number">03.</span>
              <p>YOUR FUTURE SELF IS WATCHING</p>
            </div>
            <div className="truth-item">
              <span className="truth-number">04.</span>
              <p>COMPOUND INTEREST DOESN'T CARE ABOUT YOUR FEELINGS</p>
            </div>
          </div>
        </div>

        <div className="maintenance-progress">
          <div className="progress-wrapper">
            <div className="progress-track">
              <div className="progress-bar-fill"></div>
            </div>
            <div className="progress-text">
              <span>RESTORING FINANCIAL DISCIPLINE</span>
              <span className="progress-percent">73%</span>
            </div>
          </div>
        </div>

        <div className="contact-box">
          <p className="contact-label">NEED IMMEDIATE FINANCIAL WISDOM?</p>
          <p className="contact-action">MEDITATE ON YOUR CHOICES</p>
          <div className="contact-email">OR EMAIL: GANDHI@MONEYWISDOM.COM</div>
        </div>

        <div className="marquee-scroll">
          <div className="marquee-content">
            <span>🪙 PATIENCE IS A VIRTUE • SAVING IS DIVINE • YOUR WALLET THANKS YOU • GANDHI IS WATCHING • </span>
            <span>🪙 PATIENCE IS A VIRTUE • SAVING IS DIVINE • YOUR WALLET THANKS YOU • GANDHI IS WATCHING • </span>
          </div>
        </div>

        <div className="back-link">
          <Link href="/" className="brutal-btn-secondary">
            CHECK BACK LATER (LIKE YOUR SAVINGS ACCOUNT)
          </Link>
        </div>

        <div className="receipt-clip">
          <div>STATUS: COUNTING EVERY LAST PAISA</div>
        </div>
      </div>
    </>
  );
}
