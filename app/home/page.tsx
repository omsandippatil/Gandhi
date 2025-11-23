'use client';

import Link from 'next/link';

export default function Maintenance() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Space+Grotesk:wght@700&display=swap');
        
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

        @keyframes progressAnimation {
          0% { width: 0%; }
          100% { width: 73%; }
        }
      `}</style>

      <style jsx>{`
        .page-maintenance {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          z-index: 3;
        }

        .content-center {
          width: 100%;
          max-width: 600px;
          text-align: center;
        }

        .maintenance-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(48px, 8vw, 80px);
          font-weight: 800;
          margin-bottom: 40px;
          letter-spacing: 2px;
        }

        .maintenance-progress {
          width: 100%;
          margin-bottom: 30px;
        }

        .progress-wrapper {
          background: #F5F5F5;
          border: 2px solid #050505;
          padding: 10px;
          box-shadow: 6px 6px 0 #050505;
        }

        .progress-track {
          width: 100%;
          height: 40px;
          background: #F5F5F5;
          border: 2px solid #050505;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: #CCFF00;
          border-right: 2px solid #050505;
          animation: progressAnimation 2s ease-out forwards;
        }

        .fun-quote {
          font-family: 'Space Grotesk', monospace;
          font-size: clamp(14px, 2.5vw, 18px);
          font-weight: 700;
          opacity: 0.8;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .progress-track {
            height: 30px;
          }
        }
      `}</style>

      <div className="page-maintenance">
        <div className="content-center">
          <h1 className="maintenance-title">PROCESSING</h1>
          
          <div className="maintenance-progress">
            <div className="progress-wrapper">
              <div className="progress-track">
                <div className="progress-bar-fill"></div>
              </div>
            </div>
          </div>

          <p className="fun-quote">
            "YOUR MONEY IS SAFER WITH GANDHI THAN IN YOUR POCKET"
          </p>
        </div>
      </div>
    </>
  );
}
