"use client";
import { useState } from 'react';

// Define UserFinancialData interface to include all needed properties
interface UserFinancialData {
  income: number;
  age: number;
  expenses: number;
  location: string;
  debts: Array<{name: string; amount: number; interest: number}>;
  liabilities: number;
  financialGoals: string[];
  timeHorizon: number;
  monthlySavings: number; // Changed from optional to required
  investments: Array<{type: string; amount: number}>; // Changed from optional to required
  savings: number; // Changed from optional to required
  dependents: any;
}

// Define props interfaces for components
interface IncomeExpensePredictionProps {
  title: string;
  userData: UserFinancialData;
  income: number;
  expenses: number;
  monthlySavings: number;
}

interface EmergencyFundProps {
  title: string;
  userData: UserFinancialData;
}

interface InvestmentVsReturnsProps {
  timeHorizon?: number;
}

interface InvestmentAllocationProps {
  title: string;
  userData: UserFinancialData;
}

interface DebtTrackerProps {
  title: string;
  userData: UserFinancialData;
}

interface FundsProps {
  title: string;
  userData: UserFinancialData;
}

interface InsuranceProps {
  title: string;
  userData: UserFinancialData;
}

interface QuoteProps {
  title: string;
}

// Dashboard components
import Overview from './components/dashboard/Overview';
import IncomeVsExpenses from './components/dashboard/IncomevsExpense';
import EmergencyFund from './components/dashboard/EmergencyFund';
import InvestmentVsReturns from './components/dashboard/InvestmentvsReturns';
import InvestmentAllocation from './components/dashboard/InvestmentAllocation';
import DebtTracker from './components/dashboard/DebtTracker';
import Quote from './components/dashboard/Quote';
import Form from './components/form/form';
import Card from './components/ui/card';
import Funds from './components/dashboard/Funds';
import Insurance from './components/dashboard/Insurance';

export default function Home() {
  // Modified the initial state to include default values for required properties
  const [userData, setUserData] = useState<UserFinancialData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Updated type for form submission to account for partially filled data
  const handleFormSubmit = (formData: Partial<UserFinancialData>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Calculate and ensure all required properties have values
      const monthlySavings = formData.monthlySavings ?? (formData.income ?? 0) - (formData.expenses ?? 0);
      const savings = formData.savings ?? monthlySavings * 3; // Default to 3 months of savings
      
      // Create a complete user data object with default values where needed
      const completeUserData: UserFinancialData = {
        income: formData.income ?? 0,
        age: formData.age ?? 30,
        expenses: formData.expenses ?? 0,
        location: formData.location ?? '',
        debts: formData.debts ?? [],
        liabilities: formData.liabilities ?? 0,
        financialGoals: formData.financialGoals ?? [],
        timeHorizon: formData.timeHorizon ?? 10,
        monthlySavings: monthlySavings,
        investments: formData.investments ?? [],
        savings: savings,
        dependents: formData.dependents ?? null
      };
      
      // Store the user data
      setUserData(completeUserData);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to process financial data. Please try again.');
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen bg-white flex overflow-hidden">
      {/* Left Panel - Input Form (25%) */}
      <div className="w-1/4 border-r border-gray-200 overflow-y-auto h-full">
        <div className="p-4">
          <Form 
            onDataSubmit={handleFormSubmit} 
            isLoading={isLoading} 
          />
          {error && <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
        </div>
      </div>
      
      {/* Main Content Area (60%) */}
      <div className="w-3/5 overflow-y-auto h-full">
        {!userData && !isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="text-gray-600 mb-4">Enter your financial details to get started with your personalized investment plan.</p>
              <Quote title="Financial Wisdom" />
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Generating your personalized investment plan...</p>
            </div>
          </div>
        ) : userData && (
          <div className="p-4 space-y-6">
            {/* Overview */}
            <Card className="p-4">
              <Overview />
            </Card>
            
            {/* Investment vs Returns Graph */}
            <Card className="p-4">
              <InvestmentVsReturns 
                timeHorizon={userData.timeHorizon}
              />
            </Card>
            
            {/* Income vs Expenses */}
            <Card className="p-4">
              <IncomeVsExpenses 
                title="Income vs Expenses"
                userData={userData}
                income={userData.income}
                expenses={userData.expenses}
                monthlySavings={userData.monthlySavings}
              />
            </Card>
            
            {/* Funds */}
            <Card className="p-4">
              <Funds 
                title="Funds"
                userData={userData} 
              />
            </Card>
            
            {/* Debt Tracker */}
            <Card className="p-4">
              <DebtTracker 
                title="Debt Tracker"
                userData={userData} 
              />
            </Card>
            
            {/* Investment Allocation */}
            <Card className="p-4">
              <InvestmentAllocation 
                title="Investment Allocation"
                userData={userData} 
              />
            </Card>
          </div>
        )}
      </div>
      
      {/* Right Sidebar (20%) */}
      <div className="w-1/5 border-l border-gray-200 overflow-y-auto h-full">
        {userData && (
          <div className="p-4 space-y-6">
            {/* Emergency Fund */}
            <Card className="p-4">
              <EmergencyFund 
                title="Emergency Fund"
                userData={userData} 
              />
            </Card>
            
            {/* Insurance */}
            <Card className="p-4">
              <Insurance 
                title="Insurance"
                userData={userData}
              />
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}