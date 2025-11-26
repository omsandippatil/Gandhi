"use client";

import React, { useState, useEffect } from 'react';

interface Transaction {
  date: Date;
  amount: number;
}

interface ChartPoint {
  x: number;
  y: number;
  isPrediction?: boolean;
}

interface ForecastData {
  amount: number | null;
  daysUntil: number | null;
  date: Date | null;
}

const ForecastCard = () => {
  const [forecast, setForecast] = useState<ForecastData>({ 
    amount: null, 
    daysUntil: null, 
    date: null 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    fetchAndPredict();
  }, []);

  const fetchAndPredict = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get/transactions?type=credit');
      
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const result = await response.json();
      
      if (!result.success || !result.data || result.data.length === 0) {
        throw new Error('No transaction data available');
      }
      
      const transactions = result.data;

      const sortedTx: Transaction[] = transactions
        .map((tx: any) => ({
          date: new Date(tx.date),
          amount: parseFloat(tx.amount)
        }))
        .sort((a: Transaction, b: Transaction) => a.date.getTime() - b.date.getTime());

      const intervals: number[] = [];
      for (let i = 1; i < sortedTx.length; i++) {
        const daysDiff = (sortedTx[i].date.getTime() - sortedTx[i - 1].date.getTime()) / (1000 * 60 * 60 * 24);
        intervals.push(daysDiff);
      }

      const amounts = sortedTx.map((tx: Transaction) => tx.amount);
      const { slope: amountSlope, intercept: amountIntercept } = linearRegression(
        amounts.map((_: number, i: number) => i),
        amounts
      );
      
      const nextAmount = amountSlope * amounts.length + amountIntercept;
      const avgInterval = intervals.reduce((a: number, b: number) => a + b, 0) / intervals.length;
      const lastDate = sortedTx[sortedTx.length - 1].date;
      const nextDate = new Date(lastDate.getTime() + avgInterval * 24 * 60 * 60 * 1000);
      const today = new Date();
      const daysUntil = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      setForecast({
        amount: Math.max(0, nextAmount),
        daysUntil: Math.max(0, daysUntil),
        date: nextDate
      });

      const chartPoints: ChartPoint[] = sortedTx.slice(-6).map((tx: Transaction, i: number) => ({
        x: (i / 7) * 100,
        y: normalizeToChart(tx.amount, amounts)
      }));
      
      chartPoints.push({
        x: 100,
        y: normalizeToChart(nextAmount, amounts),
        isPrediction: true
      });

      setChartData(chartPoints);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const linearRegression = (x: number[], y: number[]) => {
    const n = x.length;
    const sumX = x.reduce((a: number, b: number) => a + b, 0);
    const sumY = y.reduce((a: number, b: number) => a + b, 0);
    const sumXY = x.reduce((acc: number, xi: number, i: number) => acc + xi * y[i], 0);
    const sumX2 = x.reduce((acc: number, xi: number) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  };

  const normalizeToChart = (value: number, allValues: number[]) => {
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;
    return 30 - ((value - min) / range) * 25;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="brutal-shadow" style={{
        background: '#C4F000',
        border: '3px solid #050505',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%'
      }}>
        <div style={{ 
          fontFamily: "'Inter', sans-serif", 
          fontSize: '11px', 
          fontWeight: 800, 
          marginBottom: '6px', 
          letterSpacing: '1px', 
          color: '#050505' 
        }}>
          FORECAST
        </div>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', minHeight: 0, marginBottom: '6px' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 35" preserveAspectRatio="none" style={{ display: 'block' }}>
            <polyline
              points="0,20 16,25 33,10 50,18 66,8 83,15 100,10"
              fill="none"
              stroke="#050505"
              strokeWidth="1.5"
              opacity="0.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <animate attributeName="opacity" values="0.15;0.3;0.15" dur="2s" repeatCount="indefinite"/>
            </polyline>
          </svg>
        </div>
        
        <div style={{ 
          fontSize: '18px', 
          fontWeight: 900, 
          color: '#050505',
          opacity: 0.15,
          background: '#050505',
          width: '60%',
          height: '18px',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '6px'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'shimmer 1.5s infinite'
          }} />
        </div>
        
        <div style={{ 
          fontSize: '9px', 
          fontWeight: 700, 
          color: '#050505',
          opacity: 0.15,
          background: '#050505',
          width: '70%',
          height: '10px',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'shimmer 1.5s infinite 0.2s'
          }} />
        </div>
        
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="brutal-shadow" style={{
        background: '#C4F000',
        border: '3px solid #050505',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
      }}>
        <div style={{ fontSize: '10px', fontWeight: 800, color: '#050505', marginBottom: '4px' }}>
          NO DATA
        </div>
        <div style={{ fontSize: '8px', fontWeight: 600, color: '#050505', opacity: 0.6 }}>
          {error}
        </div>
      </div>
    );
  }

  const polylinePoints = chartData
    .map((point: ChartPoint) => `${point.x},${point.y}`)
    .join(' ');

  return (
    <div className="brutal-shadow" style={{
      background: '#C4F000',
      border: '3px solid #050505',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%'
    }}>
      <div style={{ 
        fontFamily: "'Inter', sans-serif", 
        fontSize: '11px', 
        fontWeight: 800, 
        marginBottom: '6px', 
        letterSpacing: '1px', 
        color: '#050505' 
      }}>
        FORECAST
      </div>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', minHeight: 0, marginBottom: '6px' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 35" preserveAspectRatio="none" style={{ display: 'block' }}>
          {chartData.length > 0 && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#050505"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />
          )}
        </svg>
      </div>
      
      <div style={{ 
        fontSize: '18px', 
        fontWeight: 900, 
        color: '#050505',
        letterSpacing: '-0.5px',
        marginBottom: '4px'
      }}>
        {forecast.amount !== null && formatAmount(forecast.amount)}
      </div>
      
      <div style={{ 
        fontSize: '9px', 
        fontWeight: 700, 
        color: '#050505',
        opacity: 0.6,
        letterSpacing: '0.3px'
      }}>
        {forecast.daysUntil !== null && 
          `Next in ${forecast.daysUntil} ${forecast.daysUntil === 1 ? 'day' : 'days'}`
        }
      </div>
    </div>
  );
};

export default ForecastCard;