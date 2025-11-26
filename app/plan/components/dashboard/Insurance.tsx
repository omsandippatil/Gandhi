'use client';
import React from 'react';

interface InsuranceProps {
  title: string;
  userData: {
    income: number;
    savings: number;
    [key: string]: any;
  };
}

const Insurance: React.FC<InsuranceProps> = ({ 
  title, 
  userData 
}) => {
  // Basic validation - ensure no negative values
  const monthlyIncome = Math.max(0, Number(userData?.income) || 0);
  const savings = Math.max(0, Number(userData?.savings) || 0);
  
  // Don't show component if no savings
  if (savings <= 0) {
    return null;
  }

  // Constants
  const INSURANCE_ALLOCATION = 0.10; // 10% of savings for insurance
  const availableBudget = savings * INSURANCE_ALLOCATION;
  
  // Income thresholds
  const LOW_INCOME = 20000;     // Low income threshold
  const MEDIUM_INCOME = 30000;  // Medium income threshold

  // Calculate insurance premiums based on income level
  const calculateInsurances = () => {
    const insurances = [];
    let remainingBudget = availableBudget;
    
    // Calculate life insurance (for all income levels)
    const lifeInsuranceCoverage = monthlyIncome * 200; // 200x monthly salary coverage
    const lifeInsurancePremium = Math.min(remainingBudget, lifeInsuranceCoverage * 0.0004); // 0.04% of coverage
    remainingBudget -= lifeInsurancePremium;
    
    insurances.push({
      type: 'Life',
      premium: Math.round(lifeInsurancePremium),
      coverage: Math.round(lifeInsuranceCoverage)
    });
    
    // Add medical insurance for medium and high income
    if (monthlyIncome >= MEDIUM_INCOME && remainingBudget > 0) {
      const medicalCoverage = monthlyIncome * 10; // 10x monthly salary coverage
      const medicalPremium = Math.min(remainingBudget, medicalCoverage * 0.005); // 0.5% of coverage
      remainingBudget -= medicalPremium;
      
      insurances.push({
        type: 'Medical',
        premium: Math.round(medicalPremium),
        coverage: Math.round(medicalCoverage)
      });
    }
    
    // Add car insurance for high income
    if (monthlyIncome > MEDIUM_INCOME && remainingBudget > 0) {
      const carValue = monthlyIncome * 6; // Assumed car value as 6x monthly income
      const carPremium = Math.min(remainingBudget, carValue * 0.006); // 0.6% of car value
      
      insurances.push({
        type: 'Car',
        premium: Math.round(carPremium),
        coverage: Math.round(carValue)
      });
    }
    
    return insurances;
  };

  const insurances = calculateInsurances();
  const totalMonthlyPremium = insurances.reduce((sum, insurance) => sum + insurance.premium, 0);

  return (
    <div className="w-full md:w-auto font-mono text-black">
      <h3 className="text-base font-bold mb-3">{title}</h3>
      
      <div className="grid gap-3">
        {insurances.map((insurance, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="grid gap-2">
              <div className="flex justify-between text-sm">
                <span>{insurance.type}:</span>
                <span className="font-bold">
                  ₹{(insurance.premium / 12).toLocaleString('en-IN', {
                    maximumFractionDigits: 0
                  })}/mo
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Cover:</span>
                <span className="font-bold">
                  ₹{insurance.coverage.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
          <div className="flex justify-between text-sm font-bold">
            <span>Total Monthly:</span>
            <span>
              ₹{(totalMonthlyPremium / 12).toLocaleString('en-IN', {
                maximumFractionDigits: 0
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insurance;