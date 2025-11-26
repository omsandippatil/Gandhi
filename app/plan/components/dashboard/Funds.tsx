'use client';

import React, { useEffect } from 'react';
import { 
  BookOpen, 
  Home, 
  Plane, 
  Sparkles
} from 'lucide-react';

interface UserFinancialData {
  income: number;
  age: number;
  expenses: number;
  monthlySavings?: number;
  savings: number;
  timeHorizon: number;
  financialGoals: string[];
}

interface FundItem {
  name: string;
  icon: React.ReactNode;
  monthlyInvestment: number;
  projectedAmount: number;
  tenure: number;
}

interface ProjectionResult {
  totalAmount: number;
  totalInvested: number;
}

interface FundsProps {
  title: string;
  userData: UserFinancialData;
}

// Define unique global variables to store total investments and returns
declare global {
  interface Window {
    finPlanTotalInvestments: number;
    finPlanTotalReturns: number;
  }
}

const Funds: React.FC<FundsProps> = ({ title, userData }) => {
  // Handle negative savings
  if (userData.savings < 0) {
    const emptyFundsData: FundItem[] = [
      {
        name: "Children's Education",
        icon: <BookOpen size={20} color="black" />,
        monthlyInvestment: 0,
        projectedAmount: 0,
        tenure: 0
      },
      {
        name: "Home DownPayment",
        icon: <Home size={20} color="black" />,
        monthlyInvestment: 0,
        projectedAmount: 0,
        tenure: 0
      },
      {
        name: "Vacation Fund",
        icon: <Plane size={20} color="black" />,
        monthlyInvestment: 0,
        projectedAmount: 0,
        tenure: 0
      },
      {
        name: "Dream Fund",
        icon: <Sparkles size={20} color="black" />,
        monthlyInvestment: 0,
        projectedAmount: 0,
        tenure: 0
      }
    ];

    // Set global variables to 0 when no investments are possible
    useEffect(() => {
      window.finPlanTotalInvestments = 0;
      window.finPlanTotalReturns = 0;
    }, []);

    return renderFunds(title, emptyFundsData);
  }

  // Calculate available amount for investment (20% or 25% of savings based on income)
  const investmentPercentage = userData.income < 30000 ? 0.25 : 0.20;
  
  // Annual growth rate for salary
  const annualSalaryGrowthRate = 0.055;
  
  // Interest rate for investments
  const interestRate = 0.06;
  
  // Calculate priority distribution based on goals
  let homeDownPaymentPriority = 0.40;
  let educationPriority = 0.30;
  let vacationPriority = 0.15;
  let dreamFundPriority = 0.15;
  
  // Adjust priorities based on financial goals if available
  if (userData.financialGoals && userData.financialGoals.length > 0) {
    const hasEducationGoal = userData.financialGoals.some(goal => 
      goal.toLowerCase().includes('education') || goal.toLowerCase().includes('study'));
    const hasHomeGoal = userData.financialGoals.some(goal => 
      goal.toLowerCase().includes('home') || goal.toLowerCase().includes('house'));
    const hasVacationGoal = userData.financialGoals.some(goal => 
      goal.toLowerCase().includes('vacation') || goal.toLowerCase().includes('travel'));
    
    if (hasEducationGoal) educationPriority = 0.30;
    if (hasHomeGoal) homeDownPaymentPriority = 0.45;
    if (hasVacationGoal) vacationPriority = 0.15;
    
    // Recalculate remaining priorities to ensure total is 1
    const totalPriority = educationPriority + homeDownPaymentPriority + vacationPriority;
    const remainingPriority = 1 - totalPriority;
    
    dreamFundPriority = remainingPriority;
  }
  
  // Calculate monthly investment amounts for each fund
  const monthlySavings = userData.monthlySavings || (userData.income - userData.expenses);
  const monthlyInvestmentTotal = Math.max(0, monthlySavings * investmentPercentage);
  
  const educationMonthly = Math.max(0, monthlyInvestmentTotal * educationPriority);
  const homeDownPaymentMonthly = Math.max(0, monthlyInvestmentTotal * homeDownPaymentPriority);
  const vacationMonthly = Math.max(0, monthlyInvestmentTotal * vacationPriority);
  const dreamFundMonthly = Math.max(0, monthlyInvestmentTotal * dreamFundPriority);
  
  // Properly calculate compound interest with annual salary growth
  const calculateProjectedAmount = (monthlyAmount: number, years: number): ProjectionResult => {
    if (years <= 0 || monthlyAmount <= 0) return { totalAmount: 0, totalInvested: 0 };
    
    let totalAmount = 0;
    let currentMonthlyAmount = monthlyAmount;
    let totalInvested = 0;
    
    for (let year = 0; year < years; year++) {
      let yearlyContribution = 0;
      
      // Calculate contributions for this year
      for (let month = 0; month < 12; month++) {
        yearlyContribution += currentMonthlyAmount;
      }
      
      // Track total invested amount
      totalInvested += yearlyContribution;
      
      // Add this year's contribution to total
      totalAmount += yearlyContribution;
      
      // Apply interest to the total amount
      totalAmount *= (1 + interestRate);
      
      // Increase monthly contribution for next year based on salary growth
      currentMonthlyAmount *= (1 + annualSalaryGrowthRate);
    }
    
    return { totalAmount, totalInvested };
  };
  
  // Calculate tenures for different funds
  const educationTenure = userData.timeHorizon;
  const homeDownPaymentTenure = userData.timeHorizon;
  const vacationTenure = userData.timeHorizon;
  const dreamFundTenure = userData.timeHorizon;
  
  // Calculate education fund and check if it exceeds 2 crore
  let educationResult = calculateProjectedAmount(educationMonthly, educationTenure);
  let educationProjectedAmount = educationResult.totalAmount;
  let educationTotalInvested = educationResult.totalInvested;
  let finalEducationTenure = educationTenure;
  const educationLimit = 20000000; // 2 crores in rupees
  
  // If education fund exceeds 2 crores, adjust the tenure
  if (educationProjectedAmount > educationLimit) {
    // Find the optimal tenure that stays under 2 crores
    for (let year = 1; year <= educationTenure; year++) {
      const result = calculateProjectedAmount(educationMonthly, year);
      if (result.totalAmount >= educationLimit) {
        finalEducationTenure = year - 1;
        const finalResult = calculateProjectedAmount(educationMonthly, finalEducationTenure);
        educationProjectedAmount = finalResult.totalAmount;
        educationTotalInvested = finalResult.totalInvested;
        break;
      }
    }
  }
  
  // Calculate other funds
  const homeResult = calculateProjectedAmount(homeDownPaymentMonthly, homeDownPaymentTenure);
  const vacationResult = calculateProjectedAmount(vacationMonthly, vacationTenure);
  const dreamResult = calculateProjectedAmount(dreamFundMonthly, dreamFundTenure);
  
  // Generate fund data
  const fundsData: FundItem[] = [
    {
      name: "Children's Education",
      icon: <BookOpen size={20} color="black" />,
      monthlyInvestment: educationMonthly,
      projectedAmount: educationProjectedAmount,
      tenure: finalEducationTenure
    },
    {
      name: "Home DownPayment",
      icon: <Home size={20} color="black" />,
      monthlyInvestment: homeDownPaymentMonthly,
      projectedAmount: homeResult.totalAmount,
      tenure: homeDownPaymentTenure
    },
    {
      name: "Vacation Fund",
      icon: <Plane size={20} color="black" />,
      monthlyInvestment: vacationMonthly,
      projectedAmount: vacationResult.totalAmount,
      tenure: vacationTenure
    },
    {
      name: "Dream Fund",
      icon: <Sparkles size={20} color="black" />,
      monthlyInvestment: dreamFundMonthly,
      projectedAmount: dreamResult.totalAmount,
      tenure: dreamFundTenure
    }
  ];

  // Calculate total investments and returns for all funds
  const totalInvestments = educationTotalInvested + 
                          homeResult.totalInvested + 
                          vacationResult.totalInvested + 
                          dreamResult.totalInvested;
  
  const totalReturns = educationProjectedAmount + 
                      homeResult.totalAmount + 
                      vacationResult.totalAmount + 
                      dreamResult.totalAmount - 
                      totalInvestments;

  // Save totals to global variables for other components to access
  useEffect(() => {
    window.finPlanTotalInvestments = totalInvestments;
    window.finPlanTotalReturns = totalReturns;
  }, [totalInvestments, totalReturns]);

  return renderFunds(title, fundsData);
};

// Separate rendering function for clean code organization
const renderFunds = (title: string, fundsData: FundItem[]) => {
  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-wide text-black">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fundsData.map((fund, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="mr-2">{fund.icon}</span>
                <span className="text-sm font-mono font-medium text-black">{fund.name}</span>
              </div>
              <span className="text-xs font-mono text-black bg-gray-100 px-2 py-1 rounded">
                {fund.tenure} years
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-black">Monthly investment:</span>
                <span className="text-sm font-mono font-medium text-black">
                  ₹{Math.round(fund.monthlyInvestment).toLocaleString('en-IN')}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-black">Projected value:</span>
                <span className="text-sm font-mono font-medium text-black">
                  ₹{Math.round(fund.projectedAmount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-xs font-mono text-black">
          * Projections based on 6% annual returns and 5.5% annual salary growth
        </p>
      </div>
    </div>
  );
};

export default Funds;