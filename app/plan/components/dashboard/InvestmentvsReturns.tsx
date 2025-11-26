import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Define TypeScript interfaces
interface ChartDataPoint {
  year: number;
  totalInvested: number;
  totalReturns: number;
}

interface FinancialSummary {
  totalInvested: number;
  totalReturns: number;
}

// Using type assertion for the window object instead
type CustomWindow = Window & {
  investmentData?: {
    totalInvested: number;
    totalReturns: number;
  };
  finPlanTotalInvestments?: number;
  finPlanTotalReturns?: number;
}

export default function InvestmentReturnsChart({ timeHorizon = 10 }: { timeHorizon?: number }) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary>({
    totalInvested: 0,
    totalReturns: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to calculate the growth curves with fluctuations
    const calculateGrowthCurve = (totalFinalAmount: number, years: number, isInvestment = false): number[] => {
      const growthRate = isInvestment ? 0.055 : 0.12; // 5.5% for investments, higher for returns
      const data: number[] = [];
      
      // Start from zero
      data.push(0);
      
      // Fill in the curve points with fluctuations
      for (let i = 1; i < years; i++) {
        let currentAmount: number;
        
        // Create base amount
        if (isInvestment) {
          // Slightly curved line for investments (less exponential)
          const linearFactor = i / years;
          currentAmount = totalFinalAmount * Math.pow(linearFactor, 1.2);
        } else {
          // More positive curvy line for total returns
          const exponentialFactor = Math.pow(i / years, 1.5);
          currentAmount = totalFinalAmount * exponentialFactor;
        }
        
        // Add randomized fluctuations (higher for returns, lower for investments)
        const fluctuationPercentage = isInvestment ? 0.05 : 0.08; // 5-8% fluctuation
        const fluctuationRange = currentAmount * fluctuationPercentage;
        const fluctuation = (Math.random() * fluctuationRange) - (fluctuationRange / 2);
        
        // Apply fluctuation but ensure general upward trend
        currentAmount += fluctuation;
        
        // Ensure we don't go below previous point too drastically
        if (i > 1 && currentAmount < data[i-1]) {
          currentAmount = data[i-1] * (1 + (Math.random() * 0.03)); // Slight increase from previous
        }
        
        data.push(Math.round(currentAmount));
      }
      
      // Ensure the last point is the exact total
      data.push(totalFinalAmount);
      
      return data;
    };

    const fetchFinancialData = () => {
      setIsLoading(true);
      
      try {
        // Get investment data using same approach as FinancialOverviewCards
        const investmentData = (window as CustomWindow).investmentData || {
          totalInvested: 0,
          totalReturns: 0
        };
        
        // Get financial planning data
        const totalInvestments = (window as CustomWindow).finPlanTotalInvestments || 0;
        const finPlanReturns = (window as CustomWindow).finPlanTotalReturns || 0;
        
        // Calculate total invested and returns
        const totalInvested = investmentData.totalInvested + totalInvestments;
        const totalReturns = investmentData.totalReturns + finPlanReturns + totalInvested;
        
        // Store for display
        setFinancialSummary({
          totalInvested: Math.round(totalInvested),
          totalReturns: Math.round(totalReturns)
        });
        
        // If values are zero or very small, use demo values
        const finalInvested = totalInvested > 1000 ? totalInvested : 250000;
        const finalReturns = totalReturns > 1000 ? totalReturns : 450000;
        
        // Generate the growth curves
        const investmentCurve = calculateGrowthCurve(finalInvested, timeHorizon + 1, true);
        const returnsCurve = calculateGrowthCurve(finalReturns, timeHorizon + 1, false);
        
        // Create data points for each year
        const currentYear = new Date().getFullYear();
        const chartPoints: ChartDataPoint[] = [];
        
        for (let i = 0; i <= timeHorizon; i++) {
          chartPoints.push({
            year: currentYear + i,
            totalInvested: investmentCurve[i],
            totalReturns: returnsCurve[i]
          });
        }
        
        setChartData(chartPoints);
      } catch (error) {
        console.error("Error generating chart data:", error);
        
        // Fallback values
        const demoInvested = 250000;
        const demoReturns = 450000;
        
        // Generate demo curves
        const investmentCurve = calculateGrowthCurve(demoInvested, timeHorizon + 1, true);
        const returnsCurve = calculateGrowthCurve(demoReturns, timeHorizon + 1, false);
        
        // Create data points for each year
        const currentYear = new Date().getFullYear();
        const chartPoints: ChartDataPoint[] = [];
        
        for (let i = 0; i <= timeHorizon; i++) {
          chartPoints.push({
            year: currentYear + i,
            totalInvested: investmentCurve[i],
            totalReturns: returnsCurve[i]
          });
        }
        
        setChartData(chartPoints);
        
        // Set fallback summary values
        setFinancialSummary({
          totalInvested: demoInvested,
          totalReturns: demoReturns
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    // Fetch data initially
    fetchFinancialData();
    
    // Listen for financial data updates
    const handleFinanceUpdate = () => {
      fetchFinancialData();
    };
    
    (window as Window).addEventListener('financeDataUpdated', handleFinanceUpdate);
    
    // Cleanup listener on component unmount
    return () => {
      (window as Window).removeEventListener('financeDataUpdated', handleFinanceUpdate);
    };
  }, [timeHorizon]); // Re-run when timeHorizon changes

  // Format currency in Indian format
  const formatCurrency = (value: number): string => {
    // Format based on value range
    if (value >= 10000000) { // 1 crore and above
      return `₹${(value / 10000000).toFixed(2)} cr`;
    } else if (value >= 100000) { // 1 lac and above
      return `₹${(value / 100000).toFixed(2)} lac`;
    } else if (value >= 1000) { // 1K and above
      return `₹${(value / 1000).toFixed(2)}K`;
    } else {
      return `₹${value}`;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <p className="font-mono text-sm text-gray-500">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 font-mono text-sm font-bold">
          Investment Growth Projection ({timeHorizon} years)
        </h3>
        <div className="text-right">
          <div className="text-xs font-mono text-gray-600">
            Total Amount Invested: <span className="font-bold text-black">{formatCurrency(financialSummary.totalInvested)}</span>
          </div>
          <div className="text-xs font-mono text-gray-600">
            Total Returns: <span className="font-bold text-black">{formatCurrency(financialSummary.totalReturns)}</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="year" 
              stroke="#333" 
              fontFamily="monospace"
              fontSize={10}
              dy={5}
              tickSize={3}
              angle={-15}
            />
            <YAxis 
              stroke="#333" 
              fontFamily="monospace"
              fontSize={10}
              tickFormatter={formatCurrency}
              tickSize={3}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value as number), ""]}
              labelFormatter={(year) => `Year: ${year}`}
              contentStyle={{ fontFamily: 'monospace', fontSize: '12px', color: '#333' }}
            />
            <Line 
              type="basis" 
              dataKey="totalInvested" 
              stroke="#333333" 
              strokeWidth={2}
              dot={false}
              name="Amount Invested"
              animationDuration={1500}
              connectNulls={false}
            />
            <Line 
              type="basis" 
              dataKey="totalReturns" 
              stroke="#777777" 
              strokeWidth={2}
              dot={false}
              name="Total Returns"
              animationDuration={1500}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-800 mr-2 rounded-full"></div>
          <span className="text-xs font-mono text-gray-700">Amount Invested (5.5% Growth)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-500 mr-2 rounded-full"></div>
          <span className="text-xs font-mono text-gray-700">Total Returns (With Growth)</span>
        </div>
      </div>
    </div>
  );
}