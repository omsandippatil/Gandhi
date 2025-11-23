'use client';

import Link from 'next/link';

export default function Maintenance() {
  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #0a0a0a;
          color: #e5e5e5;
          overflow-x: hidden;
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 73%; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      <style jsx>{`
        .page-maintenance {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(to bottom, #0a0a0a, #1a1a1a);
        }

        .content {
          width: 100%;
          max-width: 500px;
          text-align: center;
        }

        .title {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .subtitle {
          font-size: 15px;
          color: #888888;
          margin-bottom: 48px;
          font-weight: 400;
        }

        .progress-container {
          margin-bottom: 48px;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: #2a2a2a;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 2px;
          animation: progress 2s ease-out forwards;
        }

        .progress-text {
          font-size: 13px;
          color: #666666;
          font-weight: 500;
        }

        .back-link {
          margin-top: 24px;
        }

        .link-button {
          display: inline-block;
          padding: 12px 24px;
          background: #1a1a1a;
          color: #e5e5e5;
          text-decoration: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #2a2a2a;
          transition: all 0.2s ease;
        }

        .link-button:hover {
          background: #2a2a2a;
          border-color: #3a3a3a;
        }

        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 2s ease-in-out infinite;
        }

        @media (max-width: 768px) {
          .title {
            font-size: 24px;
          }
          
          .subtitle {
            font-size: 14px;
          }
        }
      `}</style>

      <div className="page-maintenance">
        <div className="content">
          <h1 className="title">
            <span className="status-dot"></span>
            Processing
          </h1>
          <p className="subtitle">Please wait while we complete the operation</p>
          
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <p className="progress-text">73% complete</p>
          </div>

          <div className="back-link">
            <Link href="/" className="link-button">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
