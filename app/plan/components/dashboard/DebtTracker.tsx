'use client';

import React, { useState, useEffect } from 'react';

interface DebtTrackerProps {
  title: string;
  userData?: {
    totalDebt?: number;
    savings?: number;
    tenure?: number; // in months
  };
}

const DebtTracker: React.FC<DebtTrackerProps> = ({ title, userData }) => {
  const [debtDetails, setDebtDetails] = useState({
    originalDebt: 0,
    remainingDebt: 0,
    monthlyPayment: 0,
    debtFreeDate: '',
    monthsToDebtFree: 0,
    percentPaid: 0,
    showComponent: false
  });

  useEffect(() => {
    if (!userData || !userData.totalDebt || userData.totalDebt <= 0) {
      setDebtDetails(prev => ({ ...prev, showComponent: false }));
      return;
    }

    const totalDebt = userData.totalDebt || 1000000;
    const savings = userData.savings || 10000;
    const tenure = userData.tenure || 12; // Default to 12 months if not provided
    
    // Calculate monthly payment from savings (20% of savings)
    const monthlySavings = savings * 0.2 / 12;
    
    // Calculate debt payoff with increasing savings (5.5% annual increase)
    let remainingDebt = totalDebt;
    let months = 0;
    let currentMonthlySavings = monthlySavings;
    
    while (remainingDebt > 0 && months < 600) { // Cap at 50 years (600 months) to prevent infinite loops
      months++;
      
      // Increase savings by 5.5% each year (compounded monthly)
      if (months % 12 === 0) {
        currentMonthlySavings *= 1.055;
      }
      
      remainingDebt -= currentMonthlySavings;
    }
    
    // Calculate debt-free date
    const today = new Date();
    const payoffDate = new Date(today);
    payoffDate.setMonth(today.getMonth() + months);
    
    const formattedDate = `${payoffDate.toLocaleString('default', { month: 'long' })} ${payoffDate.getFullYear()}`;
    
    // Calculate percent paid
    const percentPaid = Math.min(100, Math.round((totalDebt - Math.max(0, remainingDebt)) / totalDebt * 100));
    
    setDebtDetails({
      originalDebt: totalDebt,
      remainingDebt: Math.max(0, remainingDebt),
      monthlyPayment: parseFloat(monthlySavings.toFixed(2)),
      debtFreeDate: formattedDate,
      monthsToDebtFree: months,
      percentPaid: percentPaid,
      showComponent: true
    });
    
  }, [userData]);

  if (!debtDetails.showComponent) {
    return null;
  }

  return (
    <div className="w-full font-mono">
      <h2 className="text-xl font-medium tracking-wide text-black mb-4">{title}</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-black">Total Debt</p>
          <p className="text-lg font-bold text-black">₹{debtDetails.originalDebt.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-black">Monthly Payment</p>
          <p className="text-lg font-bold text-black">₹{debtDetails.monthlyPayment.toLocaleString('en-IN')}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-black">Months to Debt-Free</p>
          <p className="text-lg font-bold text-black">{debtDetails.monthsToDebtFree}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-black">Debt Free Date</p>
          <p className="text-lg font-bold text-black">{debtDetails.debtFreeDate}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-black">Total Debt</h4>
            <div className="text-right">
              <p className="text-sm font-bold text-black">₹{Math.max(0, debtDetails.originalDebt - (debtDetails.originalDebt * debtDetails.percentPaid / 100)).toLocaleString('en-IN')}</p>
              <p className="text-xs text-black">of ₹{debtDetails.originalDebt.toLocaleString('en-IN')}</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
            <div 
              className="bg-black h-2 rounded-full" 
              style={{ width: `${debtDetails.percentPaid}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div>
              <p className="text-xs text-black">Payment</p>
              <p className="text-sm font-medium text-black">₹{debtDetails.monthlyPayment.toLocaleString('en-IN')}/mo</p>
            </div>
            <div>
              <p className="text-xs text-black">Progress</p>
              <p className="text-sm font-medium text-black">{debtDetails.percentPaid}% paid</p>
            </div>
            <div>
              <p className="text-xs text-black">Months Left</p>
              <p className="text-sm font-medium text-black">{debtDetails.monthsToDebtFree}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebtTracker;