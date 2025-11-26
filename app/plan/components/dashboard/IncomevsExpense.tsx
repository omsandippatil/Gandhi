'use client';

import React from 'react';

interface IncomeExpensePredictionProps {
  title: string;
  userData: any; // Using the userData from page.tsx
  income: number;
  expenses: number;
  monthlySavings?: number;
}

const IncomeExpensePrediction: React.FC<IncomeExpensePredictionProps> = ({ 
  title, 
  userData,
  income, 
  expenses, 
  monthlySavings
}) => {
  // Ensure income and expenses are non-negative
  const safeIncome = Math.max(0, income);
  const safeExpenses = Math.max(0, expenses);
  
  // Calculate savings if not directly provided, ensure it's non-negative
  const calculatedSavings = monthlySavings !== undefined 
    ? Math.max(0, monthlySavings) 
    : Math.max(0, safeIncome - safeExpenses);
  
  // Calculate savings rate as a percentage
  const savingsRate = safeIncome > 0 ? Math.round((calculatedSavings / safeIncome) * 100) : 0;
  
  // Constants for projections
  const INFLATION_RATE = 0.04; // 4.0% annual inflation
  const SALARY_GROWTH_RATE = 0.055; // 5.5% annual salary growth
  
  // Get time horizon from userData or default to 5 years
  const timeHorizon = userData.timeHorizon || 5;
  
  // Calculate projections for the time horizon
  const calculateProjections = () => {
    let projectedIncome = safeIncome;
    let projectedExpenses = safeExpenses;
    
    // Calculate final values after time horizon years
    for (let year = 1; year <= timeHorizon; year++) {
      projectedIncome = projectedIncome * (1 + SALARY_GROWTH_RATE);
      projectedExpenses = projectedExpenses * (1 + INFLATION_RATE);
    }
    
    // Ensure projected values are non-negative
    const futureSavings = Math.max(0, projectedIncome - projectedExpenses);
    const futureSavingsRate = projectedIncome > 0 
      ? Math.round((futureSavings / projectedIncome) * 100) 
      : 0;
    
    return {
      futureIncome: Math.max(0, projectedIncome),
      futureExpenses: Math.max(0, projectedExpenses),
      futureSavings,
      futureSavingsRate
    };
  };
  
  const projections = calculateProjections();
  
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4 font-mono text-black">{title}</h2>
      
      {/* Savings Rate Bar - Simplified */}
      <div className="mb-6">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-mono text-black">Current Savings Rate</span>
          <span className="text-sm font-bold font-mono text-black">{savingsRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-black h-2 rounded-full" 
            style={{ width: `${Math.min(savingsRate, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Future Projections */}
      <div className="border border-gray-200 rounded-lg p-4 mb-4">
        <h3 className="text-md font-bold mb-4 font-mono text-black">Future Projections ({timeHorizon} years)</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs text-gray-700 font-mono">Projected Monthly Income</h4>
            <p className="text-lg font-bold font-mono text-black">{formatCurrency(projections.futureIncome)}</p>
          </div>
          
          <div>
            <h4 className="text-xs text-gray-700 font-mono">Projected Monthly Expenses</h4>
            <p className="text-lg font-bold font-mono text-black">{formatCurrency(projections.futureExpenses)}</p>
          </div>
          
          <div>
            <h4 className="text-xs text-gray-700 font-mono">Projected Monthly Savings</h4>
            <p className="text-lg font-bold font-mono text-black">{formatCurrency(projections.futureSavings)}</p>
          </div>
          
          <div>
            <h4 className="text-xs text-gray-700 font-mono">Projected Savings Rate</h4>
            <p className="text-lg font-bold font-mono text-black">{projections.futureSavingsRate}%</p>
          </div>
        </div>
      </div>
      
      <div className="text-xs text-gray-700 font-mono mt-2">
        <p>Assumptions: {SALARY_GROWTH_RATE * 100}% annual salary growth, {INFLATION_RATE * 100}% annual inflation</p>
      </div>
    </div>
  );
};

export default IncomeExpensePrediction;