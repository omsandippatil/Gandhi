'use client';

import React from 'react';

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  emoji: string;
}

interface MonthlyExpensesProps {
  title: string;
  expenseData?: {
    totalExpenses: number;
    categories: ExpenseCategory[];
  };
}

const MonthlyExpenses: React.FC<MonthlyExpensesProps> = ({ title, expenseData }) => {
  // Placeholder data if none provided
  const data = expenseData || {
    totalExpenses: 39000,
    categories: [
      { category: 'Housing', amount: 15000, percentage: 38, emoji: '🏠' },
      { category: 'Food', amount: 8000, percentage: 21, emoji: '🍲' },
      { category: 'Transportation', amount: 5000, percentage: 13, emoji: '🚗' },
      { category: 'Utilities', amount: 4000, percentage: 10, emoji: '💡' },
      { category: 'Entertainment', amount: 3000, percentage: 8, emoji: '🎬' },
      { category: 'Others', amount: 4000, percentage: 10, emoji: '📦' }
    ]
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-medium tracking-wide text-black mb-4">{title}</h2>
      <div className="mb-4">
        <p className="text-lg font-bold text-black">₹{data.totalExpenses.toLocaleString('en-IN')}</p>
        <p className="text-sm text-gray-600">Total Monthly Expenses</p>
      </div>
      
      {/* Placeholder for pie chart */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 h-40 mb-4 flex items-center justify-center">
        <span className="text-gray-400">Expense Distribution Chart Placeholder</span>
      </div>
      
      <div className="space-y-3">
        {data.categories.map((category, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <span className="mr-2 text-lg">{category.emoji}</span>
                <span className="text-sm font-medium text-black">{category.category}</span>
              </div>
              <span className="text-sm font-bold text-black">₹{category.amount.toLocaleString('en-IN')}</span>
            </div>
            <div className="w-full bg-gray-200 h-1 rounded-full">
              <div 
                className="bg-black h-1 rounded-full" 
                style={{ width: `${category.percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-600">{category.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyExpenses;