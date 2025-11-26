'use client';
import React, { useEffect } from 'react';

// Define global state that can be accessed by other components
interface GlobalFinanceData {
  totalInvested: number;
  totalReturned: number;
  targetAmount: number;
  currentBalance: number;
  monthsToTarget: number;
}

// Create a global object to store the finance data
declare global {
  interface Window {
    financeData?: GlobalFinanceData;
  }
}

interface EmergencyFundProps {
  title: string;
  userData: {
    income: number;
    savings: number;
    timeHorizon: number;
    [key: string]: any;
  };
}

const EmergencyFund: React.FC<EmergencyFundProps> = ({
  title,
  userData
}) => {
  // Basic validation - ensure no negative values
  const income = Math.max(0, Number(userData?.income) || 0);
  const savings = Math.max(0, Number(userData?.savings) || 0);
  const timeHorizon = Math.max(0, Number(userData?.timeHorizon) || 0);
  
  // Constants
  const INVEST_RATE = 0.05;    // 5% of savings
  const ANNUAL_RETURN = 0.05;  // 5% return
  const SAVINGS_BUMP = 0.055;  // 5.5% yearly increase
  const SAFE_RETURN = 0.06;    // 6% after target
  const TARGET_MULT = 6;       // 6x salary target
  
  const monthlyContrib = Math.max(0, savings * INVEST_RATE);
  const targetAmount = Math.max(0, income * TARGET_MULT);
  
  const calculateProjection = () => {
    if (!income || !savings || !timeHorizon) {
      return {
        futureValue: 0,
        totalContributed: 0,
        totalReturns: 0,
        yearsToTarget: 0,
        monthsToTarget: 0,
        isValid: false
      };
    }
    
    let balance = 0;
    let currentContrib = monthlyContrib;
    let monthsToTarget = 0;
    let accumulating = true;
    let totalContributed = 0;
    
    while (accumulating && monthsToTarget < timeHorizon * 12) {
      totalContributed += currentContrib;
      balance += currentContrib;
      const previousBalance = balance;
      balance *= (1 + ANNUAL_RETURN/12);
      
      if (balance >= targetAmount) {
        accumulating = false;
        break;
      }
      
      if ((monthsToTarget + 1) % 12 === 0) {
        currentContrib *= (1 + SAVINGS_BUMP);
      }
      
      monthsToTarget++;
    }
    
    let remainingMonths = timeHorizon * 12 - monthsToTarget;
    const balanceBeforeGrowth = balance;
    
    while (remainingMonths > 0) {
      balance *= (1 + SAFE_RETURN/12);
      remainingMonths--;
    }
    
    const totalReturns = balance - totalContributed;
    
    return {
      futureValue: Math.max(0, Math.round(balance)),
      totalContributed: Math.max(0, Math.round(totalContributed)),
      totalReturns: Math.max(0, Math.round(totalReturns)),
      yearsToTarget: Math.floor(monthsToTarget / 12),
      monthsToTarget: monthsToTarget % 12,
      isValid: true
    };
  };
  
  const projection = calculateProjection();

  // Use useEffect to update global state when the projection changes
  useEffect(() => {
    if (projection.isValid) {
      // Initialize window.financeData if it doesn't exist
      if (typeof window !== 'undefined') {
        window.financeData = window.financeData || {
          totalInvested: 0,
          totalReturned: 0,
          targetAmount: 0,
          currentBalance: 0,
          monthsToTarget: 0
        };
        
        // Update the global finance data
        window.financeData.totalInvested = projection.totalContributed;
        window.financeData.totalReturned = projection.totalReturns;
        window.financeData.targetAmount = targetAmount;
        window.financeData.currentBalance = projection.futureValue;
        window.financeData.monthsToTarget = projection.yearsToTarget * 12 + projection.monthsToTarget;
        
        // Trigger a custom event so other components can react to changes
        const event = new CustomEvent('financeDataUpdated', { 
          detail: window.financeData 
        });
        window.dispatchEvent(event);
      }
    }
  }, [projection, targetAmount]);
  
  if (!projection.isValid) {
    return (
      <div className="w-full md:w-auto font-mono text-black">
        <h3 className="text-base font-bold mb-3">{title}</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            {!income ? "Income missing" :
              !savings ? "Savings missing" :
              "Time horizon missing"}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full md:w-auto font-mono text-black">
      <h3 className="text-base font-bold mb-3">{title}</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span>Monthly:</span>
            <span className="font-bold">
              ₹{monthlyContrib.toLocaleString('en-IN', {
                maximumFractionDigits: 0
              })}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Fund:</span>
            <span className="font-bold">
              ₹{projection.futureValue.toLocaleString('en-IN')}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Time to:</span>
            <span className="font-bold">
              {projection.yearsToTarget > 0 &&
                 `${projection.yearsToTarget}y `}
              {projection.monthsToTarget > 0 &&
                 `${projection.monthsToTarget}m`}
              {projection.yearsToTarget === 0 &&
                 projection.monthsToTarget === 0 && 'Done'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Total Invested:</span>
            <span className="font-bold">
              ₹{projection.totalContributed.toLocaleString('en-IN')}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Total Returns:</span>
            <span className="font-bold">
              ₹{projection.totalReturns.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyFund;