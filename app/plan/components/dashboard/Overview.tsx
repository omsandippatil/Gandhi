import { useEffect, useState } from 'react';

// Type definitions for global variables
type InvestmentDataType = {
  totalInvested: number;
  totalReturned: number;
  totalReturns: number;
};

export default function FinancialOverviewCards() {
  const [financialData, setFinancialData] = useState({
    totalInvested: 0,
    totalReturns: 0,
    netWorth: 0
  });

  useEffect(() => {
    // Function to calculate all financial data
    const calculateFinancialData = () => {
      // Get investment data
      const investmentData: InvestmentDataType = (window as any).investmentData || {
        totalInvested: 0,
        totalReturned: 0,
        totalReturns: 0
      };
      
      // Get financial planning data
      const totalInvestments = (window as any).finPlanTotalInvestments || 0;
      const totalReturns = (window as any).finPlanTotalReturns || 0;
      
      // Calculate total invested amount from all sources
      const totalInvested = investmentData.totalInvested + totalInvestments;
      
      // Calculate total returns from all sources
      const totalReturnAmount = investmentData.totalReturns + totalReturns;
      
      // Calculate net worth (total invested + total returns)
      const netWorth = totalInvested + totalReturnAmount;
      
      setFinancialData({
        totalInvested,
        totalReturns: totalReturnAmount,
        netWorth
      });
    };
    
    // Calculate data initially
    calculateFinancialData();
    
    // Set up event listener for finance data updates
    const handleFinanceUpdate = () => {
      calculateFinancialData();
    };
    
    window.addEventListener('financeDataUpdated', handleFinanceUpdate);
    
    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('financeDataUpdated', handleFinanceUpdate);
    };
  }, []);

  // Function to format currency with Indian format and abbreviations (K, lacs, cr)
  const formatCurrency = (amount: number) => {
    // Handle negative values
    const value = amount < 0 ? 0 : amount;
    
    // Format based on value range
    if (value >= 10000000) { // 1 crore and above
      return `₹${(value / 10000000).toFixed(2)}<span class="text-xs font-mono ml-1">cr</span>`;
    } else if (value >= 100000) { // 1 lac and above
      return `₹${(value / 100000).toFixed(2)}<span class="text-xs font-mono ml-1">lac</span>`;
    } else if (value >= 1000) { // 1K and above
      return `₹${(value / 1000).toFixed(2)}<span class="text-xs font-mono ml-1">K</span>`;
    } else {
      return `₹${value.toFixed(2)}`;
    }
  };

  return (
    <div className="w-full bg-gray-50">
      <div className="flex flex-row space-x-4 w-full">
        {/* Card 1: Total Amount Invested */}
        <div className="bg-white rounded-lg shadow-md p-4 flex-1">
          <h3 className="text-gray-500 font-mono text-xs uppercase tracking-wider mb-2">Total Amount Invested</h3>
          <p className="font-mono text-black text-xl font-bold"
             dangerouslySetInnerHTML={{ __html: formatCurrency(financialData.totalInvested) }}>
          </p>
        </div>
        
        {/* Card 2: Profit Made */}
        <div className="bg-white rounded-lg shadow-md p-4 flex-1">
          <h3 className="text-gray-500 font-mono text-xs uppercase tracking-wider mb-2">Profit Made</h3>
          <p className="font-mono text-black text-xl font-bold"
             dangerouslySetInnerHTML={{ __html: formatCurrency(financialData.totalReturns) }}>
          </p>
        </div>
        
        {/* Card 3: Net Worth */}
        <div className="bg-white rounded-lg shadow-md p-4 flex-1">
          <h3 className="text-gray-500 font-mono text-xs uppercase tracking-wider mb-2">Net Worth</h3>
          <p className="font-mono text-black text-xl font-bold"
             dangerouslySetInnerHTML={{ __html: formatCurrency(financialData.netWorth) }}>
          </p>
        </div>
      </div>
    </div>
  );
}