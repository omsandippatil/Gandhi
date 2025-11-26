import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import { AlertTriangle } from 'lucide-react';

// Define window interface extension for global data
declare global {
  interface Window {
    investmentData?: {
      totalInvested: number;
      totalReturned: number;
      totalReturns: number;
    };
  }
}

// Define interfaces for component data
interface AllocationData {
  allocation: {
    mutualFunds: {
      percentage: number;
      largeCap: { percentage: number; return: number };
      midCap: { percentage: number; return: number };
      smallCap: { percentage: number; return: number };
    };
    gold: { percentage: number; return: number };
    stocks: { percentage: number; return: number };
    crypto: { percentage: number; return: number };
  };
  pieData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  monthlySavings: number;
  monthlyInvestment: {
    largeCap: number;
    midCap: number;
    smallCap: number;
    gold: number;
    stocks: number;
    crypto: number;
    total: number;
  };
  futureValue: {
    largeCap: number;
    midCap: number;
    smallCap: number;
    gold: number;
    stocks: number;
    crypto: number;
    total: number;
  };
  totalInvestment: number;
  totalReturns: number;
  overallReturn: number;
  timeHorizon: number;
}

// Define the props interface for the component
interface InvestmentAllocationProps {
  title: string;
  userData: {
    income: number;       // Monthly income
    expenses: number;     // Monthly expenses
    timeHorizon: number;  // Investment time horizon in years
    age: number;          // User's age
    monthlySavings?: number; // Monthly savings (income - expenses)
  };
}

// Define custom tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      name: string;
      value: number;
    };
  }>;
}

export default function InvestmentAllocation({ title, userData }: InvestmentAllocationProps) {
  const [allocationData, setAllocationData] = useState<AllocationData | null>(null);

  useEffect(() => {
    if (userData) {
      const { income, expenses, timeHorizon, age } = userData;
      
      // Calculate monthly savings (income - expenses)
      const monthlySavings = userData.monthlySavings || (income - expenses);
      
      // Use 50% of monthly savings for investment
      const recommendedMonthlyInvestment = monthlySavings * 0.5;
      
      // Define the allocation based on income criteria only
      let allocation = {
        mutualFunds: {
          percentage: 0,
          largeCap: { percentage: 0, return: 14 },
          midCap: { percentage: 0, return: 16 },
          smallCap: { percentage: 0, return: 18 }
        },
        gold: { percentage: 0, return: 8 },
        stocks: { percentage: 0, return: 15 },
        crypto: { percentage: 0, return: 50 }
      };
      
      // Apply allocation strategy based on monthly income
      if (income < 25000) {
        // Scenario 1 - Low income
        allocation.mutualFunds.percentage = 80;
        allocation.mutualFunds.largeCap.percentage = 48;
        allocation.mutualFunds.midCap.percentage = 24;
        allocation.mutualFunds.smallCap.percentage = 8;
        allocation.gold.percentage = 20;
      } else if (income < 100000) {
        // Scenario 2 - Medium income
        allocation.mutualFunds.percentage = 60;
        allocation.mutualFunds.largeCap.percentage = 30;
        allocation.mutualFunds.midCap.percentage = 18;
        allocation.mutualFunds.smallCap.percentage = 12;
        allocation.gold.percentage = 20;
        allocation.stocks.percentage = 20;
      } else {
        // Scenario 3 - High income
        allocation.mutualFunds.percentage = 50;
        allocation.mutualFunds.largeCap.percentage = 22.5;
        allocation.mutualFunds.midCap.percentage = 12.5;
        allocation.mutualFunds.smallCap.percentage = 15;
        allocation.gold.percentage = 20;
        allocation.stocks.percentage = 25;
        allocation.crypto.percentage = 5;
      }
      
      // Calculate monthly amounts for each category
      const mutualFundsTotal = (recommendedMonthlyInvestment * allocation.mutualFunds.percentage) / 100;
      const goldAmount = (recommendedMonthlyInvestment * allocation.gold.percentage) / 100;
      const stocksAmount = (recommendedMonthlyInvestment * allocation.stocks.percentage) / 100;
      const cryptoAmount = (recommendedMonthlyInvestment * allocation.crypto.percentage) / 100;
      
      // Calculate mutual fund sub-allocations (monthly)
      const largeCapAmount = (mutualFundsTotal * allocation.mutualFunds.largeCap.percentage) / 100;
      const midCapAmount = (mutualFundsTotal * allocation.mutualFunds.midCap.percentage) / 100;
      const smallCapAmount = (mutualFundsTotal * allocation.mutualFunds.smallCap.percentage) / 100;
      
      // Annual investments (monthly * 12)
      const annualLargeCapInvestment = largeCapAmount * 12;
      const annualMidCapInvestment = midCapAmount * 12;
      const annualSmallCapInvestment = smallCapAmount * 12;
      const annualGoldInvestment = goldAmount * 12;
      const annualStocksInvestment = stocksAmount * 12;
      const annualCryptoInvestment = cryptoAmount * 12;
      
      // Annual step-up rate
      const stepUpRate = 5.5 / 100;
      
      // Initialize future values and investment trackers
      let largeCapFutureValue = 0;
      let midCapFutureValue = 0;
      let smallCapFutureValue = 0;
      let goldFutureValue = 0;
      let stocksFutureValue = 0;
      let cryptoFutureValue = 0;
      let totalInvestment = 0;
      
      // Current annual investment amounts (will increase with step-up)
      let currentLargeCapInvestment = annualLargeCapInvestment;
      let currentMidCapInvestment = annualMidCapInvestment;
      let currentSmallCapInvestment = annualSmallCapInvestment;
      let currentGoldInvestment = annualGoldInvestment;
      let currentStocksInvestment = annualStocksInvestment;
      let currentCryptoInvestment = annualCryptoInvestment;
      
      // Compound interest calculation with annual returns and step-up
      for (let year = 1; year <= timeHorizon; year++) {
        if (year > 1) {
          // Apply step-up for subsequent years
          currentLargeCapInvestment *= (1 + stepUpRate);
          currentMidCapInvestment *= (1 + stepUpRate);
          currentSmallCapInvestment *= (1 + stepUpRate);
          currentGoldInvestment *= (1 + stepUpRate);
          currentStocksInvestment *= (1 + stepUpRate);
          currentCryptoInvestment *= (1 + stepUpRate);
        }
        
        // Add this year's investments to the total
        totalInvestment += currentLargeCapInvestment + currentMidCapInvestment + 
                          currentSmallCapInvestment + currentGoldInvestment + 
                          currentStocksInvestment + currentCryptoInvestment;
        
        // Apply annual returns
        largeCapFutureValue = Math.max(0, (largeCapFutureValue + currentLargeCapInvestment) * 
                                      (1 + allocation.mutualFunds.largeCap.return / 100));
        
        midCapFutureValue = Math.max(0, (midCapFutureValue + currentMidCapInvestment) * 
                                    (1 + allocation.mutualFunds.midCap.return / 100));
        
        smallCapFutureValue = Math.max(0, (smallCapFutureValue + currentSmallCapInvestment) * 
                                      (1 + allocation.mutualFunds.smallCap.return / 100));
        
        goldFutureValue = Math.max(0, (goldFutureValue + currentGoldInvestment) * 
                                  (1 + allocation.gold.return / 100));
        
        stocksFutureValue = Math.max(0, (stocksFutureValue + currentStocksInvestment) * 
                                    (1 + allocation.stocks.return / 100));
        
        // For crypto, apply high volatility simulation
        if (currentCryptoInvestment > 0) {
          // Annual crypto return with volatility simulation
          const volatileAnnualReturn = Math.random() * 150 - 50; // -50% to +100%
          cryptoFutureValue = Math.max(0, (cryptoFutureValue + currentCryptoInvestment) * 
                                      (1 + volatileAnnualReturn / 100));
        }
      }
      
      // Calculate total future value
      const totalFutureValue = largeCapFutureValue + midCapFutureValue + smallCapFutureValue + 
                              goldFutureValue + stocksFutureValue + cryptoFutureValue;
      
      // Calculate overall return percentage
      const overallReturn = ((totalFutureValue - totalInvestment) / totalInvestment) * 100;
      
      // Calculate total returns (profit)
      const totalReturns = totalFutureValue - totalInvestment;
      
      // Prepare data for pie chart using shades of black
      const pieData = [
        { name: 'Large Cap', value: largeCapAmount, color: '#000000' },
        { name: 'Mid Cap', value: midCapAmount, color: '#333333' },
        { name: 'Small Cap', value: smallCapAmount, color: '#555555' },
        { name: 'Gold', value: goldAmount, color: '#777777' },
        { name: 'Stocks', value: stocksAmount, color: '#999999' }
      ];
      
      // Only add crypto if it exists in the allocation
      if (cryptoAmount > 0) {
        pieData.push({ name: 'Crypto', value: cryptoAmount, color: '#bbbbbb' });
      }
      
      // Remove any categories with zero value
      const filteredPieData = pieData.filter(item => item.value > 0);
      
      // Save data to component state
      setAllocationData({
        allocation,
        pieData: filteredPieData,
        monthlySavings,
        monthlyInvestment: {
          largeCap: largeCapAmount,
          midCap: midCapAmount,
          smallCap: smallCapAmount,
          gold: goldAmount,
          stocks: stocksAmount,
          crypto: cryptoAmount,
          total: recommendedMonthlyInvestment
        },
        futureValue: {
          largeCap: largeCapFutureValue,
          midCap: midCapFutureValue,
          smallCap: smallCapFutureValue,
          gold: goldFutureValue,
          stocks: stocksFutureValue,
          crypto: cryptoFutureValue,
          total: totalFutureValue
        },
        totalInvestment,
        totalReturns,
        overallReturn,
        timeHorizon
      });
      
      // Save total invested and returns to window for other components to access
      window.investmentData = {
        totalInvested: totalInvestment,
        totalReturned: totalFutureValue,
        totalReturns: totalReturns
      };
    }
  }, [userData]);

  if (!allocationData) {
    return <div>Loading allocation data...</div>;
  }

  // Format currency in INR
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded">
          <p className="font-mono text-sm">{`${payload[0].name}: ${formatCurrency(payload[0].value)}`}</p>
          <p className="font-mono text-xs text-gray-600">{`${(payload[0].value / allocationData.monthlyInvestment.total * 100).toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="font-mono text-black">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      {/* Allocation Chart and Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="md:col-span-1 bg-white rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-3">Monthly Investment Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {allocationData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {allocationData.pieData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div className="w-3 h-3 mr-2" style={{ backgroundColor: entry.color }}></div>
                <span className="text-xs">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Investment Details */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg p-4 shadow mb-4">
            <h3 className="font-semibold mb-3">Investment Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Investment Type</th>
                    <th className="text-right py-2">Monthly Investment</th>
                    <th className="text-right py-2">Projected Returns</th>
                  </tr>
                </thead>
                <tbody>
                  {allocationData.monthlyInvestment.largeCap > 0 && (
                    <tr className="border-b">
                      <td className="py-2">Large Cap Mutual Funds</td>
                      <td className="text-right">{formatCurrency(allocationData.monthlyInvestment.largeCap)}</td>
                      <td className="text-right">{formatCurrency(allocationData.futureValue.largeCap)}</td>
                    </tr>
                  )}
                  {allocationData.monthlyInvestment.midCap > 0 && (
                    <tr className="border-b">
                      <td className="py-2">Mid Cap Mutual Funds</td>
                      <td className="text-right">{formatCurrency(allocationData.monthlyInvestment.midCap)}</td>
                      <td className="text-right">{formatCurrency(allocationData.futureValue.midCap)}</td>
                    </tr>
                  )}
                  {allocationData.monthlyInvestment.smallCap > 0 && (
                    <tr className="border-b">
                      <td className="py-2">Small Cap Mutual Funds</td>
                      <td className="text-right">{formatCurrency(allocationData.monthlyInvestment.smallCap)}</td>
                      <td className="text-right">{formatCurrency(allocationData.futureValue.smallCap)}</td>
                    </tr>
                  )}
                  {allocationData.monthlyInvestment.gold > 0 && (
                    <tr className="border-b">
                      <td className="py-2">Gold</td>
                      <td className="text-right">{formatCurrency(allocationData.monthlyInvestment.gold)}</td>
                      <td className="text-right">{formatCurrency(allocationData.futureValue.gold)}</td>
                    </tr>
                  )}
                  {allocationData.monthlyInvestment.stocks > 0 && (
                    <tr className="border-b">
                      <td className="py-2">Stocks</td>
                      <td className="text-right">{formatCurrency(allocationData.monthlyInvestment.stocks)}</td>
                      <td className="text-right">{formatCurrency(allocationData.futureValue.stocks)}</td>
                    </tr>
                  )}
                  {allocationData.monthlyInvestment.crypto > 0 && (
                    <tr className="border-b">
                      <td className="py-2 flex items-center">
                        Cryptocurrency
                        <AlertTriangle className="ml-1 text-yellow-500" size={14} />
                      </td>
                      <td className="text-right">{formatCurrency(allocationData.monthlyInvestment.crypto)}</td>
                      <td className="text-right">{formatCurrency(allocationData.futureValue.crypto)}</td>
                    </tr>
                  )}
                  <tr className="font-semibold">
                    <td className="py-2">Total</td>
                    <td className="text-right">{formatCurrency(allocationData.monthlyInvestment.total)}</td>
                    <td className="text-right">{formatCurrency(allocationData.futureValue.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-right mt-3">
              <p className="text-sm font-semibold">Total Return: {formatPercentage(allocationData.overallReturn)}</p>
              <p className="text-sm">Total Invested: {formatCurrency(allocationData.totalInvestment)}</p>
              <p className="text-sm">Total Profit: {formatCurrency(allocationData.totalReturns)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}