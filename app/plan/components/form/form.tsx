'use client';

import React, { useState, useEffect } from 'react';

// Define TypeScript interfaces for our data structures
interface UserFinancialData {
  income: number;
  age: number;
  expenses: number;
  location: string;
  debts: Array<{name: string; amount: number; interest: number}>;
  liabilities: number;
  financialGoals: string[];
  timeHorizon: number;
  monthlySavings?: number;
  [key: string]: number | string | string[] | any; // Add index signature to accommodate any property
}

interface FormDataType {
  income: number;
  age: number;
  expenses: number;
  location: string;
  debtAmount: number;
  debtInterest: number;
  liabilities: number;
  financialGoals: string[];
  timeHorizon: number;
  monthlySavings?: number;
  [key: string]: number | string | string[] | undefined;
}

interface FinancialGoal {
  id: string;
  label: string;
  emoji: string;
}

interface FieldConfig {
  min: number;
  max: number;
  step: number;
  increment: number;
}

interface FieldConfigurations {
  [key: string]: FieldConfig;
}

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  emoji: string;
  step?: number;
  min?: number;
  max?: number;
  format?: (val: number) => string;
  field: string;
  isCurrency?: boolean;
}

interface FinancialInputSidebarProps {
  onDataSubmit: (data: UserFinancialData) => void;
  isLoading: boolean;
}

// Aesthetic emojis for different financial categories
const FINANCIAL_EMOJIS: Record<string, string> = {
  income: '✦',
  age: '⦿',
  expenses: '⟐',
  location: '⌘',
  debts: '⎔',
  liabilities: '◈',
  goals: '❖',
  timeHorizon: '⦿',
  plus: '⊕',
  minus: '⊖'
};

// Available cities in India for dropdown
const INDIAN_CITIES: string[] = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Surat', 'Kochi', 'Chandigarh', 'Coimbatore', 'Indore'
];

// Available financial goals with aesthetic emojis
const FINANCIAL_GOALS: FinancialGoal[] = [
  { id: 'phone', label: 'Smartphone', emoji: '📱' },
  { id: 'car', label: 'Car', emoji: '🚘' },
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'education', label: 'Education', emoji: '🎓' },
  { id: 'vacation', label: 'Vacation', emoji: '✈️' },
  { id: 'wedding', label: 'Wedding', emoji: '💍' }
];

// Field configurations for validation and increment/decrement behavior
const FIELD_CONFIGS: FieldConfigurations = {
  income: { min: 1000, max: 10000000, step: 1000, increment: 1000 },
  age: { min: 18, max: 100, step: 1, increment: 1 },
  expenses: { min: 0, max: 5000000, step: 1000, increment: 1000 },
  debtAmount: { min: 0, max: 10000000, step: 10000, increment: 10000 },
  liabilities: { min: 0, max: 10000000, step: 10000, increment: 10000 },
  timeHorizon: { min: 1, max: 40, step: 1, increment: 1 }
};

// Format a number with proper Indian formatting (commas and ₹ symbol)
const formatIndianCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const Form: React.FC<FinancialInputSidebarProps> = ({ onDataSubmit, isLoading }) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataType>({
    income: 30000,
    age: 30,
    expenses: 15000,
    location: 'Delhi',
    debtAmount: 0,
    debtInterest: 10,
    liabilities: 0,
    financialGoals: ['phone', 'car'],
    timeHorizon: 15,
  });

  // Calculate monthly savings whenever income or expenses change
  useEffect(() => {
    setFormData((prev: FormDataType) => ({
      ...prev,
      monthlySavings: prev.income - prev.expenses
    }));
  }, [formData.income, formData.expenses]);

  const handleNumberChange = (field: string, value: number): void => {
    const config = FIELD_CONFIGS[field] || { min: 0, max: 1000000, step: 1, increment: 1 };
    // Ensure value is within bounds
    const boundedValue = Math.max(config.min, Math.min(config.max, value));
    
    setFormData((prev: FormDataType) => ({
      ...prev,
      [field]: boundedValue
    }));
  };

  // Handle location change
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFormData((prev: FormDataType) => ({
      ...prev,
      location: e.target.value
    }));
  };

  // Toggle financial goals
  const handleGoalToggle = (goalId: string): void => {
    setFormData((prev: FormDataType) => {
      const updatedGoals = prev.financialGoals.includes(goalId)
        ? prev.financialGoals.filter((g: string) => g !== goalId)
        : [...prev.financialGoals, goalId];
      
      return {
        ...prev,
        financialGoals: updatedGoals
      };
    });
  };

  // Smart value adjustments based on field type
  const incrementValue = (field: string): void => {
    const config = FIELD_CONFIGS[field] || { min: 0, max: 1000000, step: 1, increment: 1 };
    setFormData((prev: FormDataType) => {
      const currentValue = prev[field] as number;
      return {
        ...prev,
        [field]: Math.min(currentValue + config.increment, config.max)
      };
    });
  };

  const decrementValue = (field: string): void => {
    const config = FIELD_CONFIGS[field] || { min: 0, max: 1000000, step: 1, increment: 1 };
    setFormData((prev: FormDataType) => {
      const currentValue = prev[field] as number;
      return {
        ...prev,
        [field]: Math.max(currentValue - config.increment, config.min)
      };
    });
  };

  const handleSubmit = (): void => {
    try {
      // Create a proper data structure for submission
      const submissionData: UserFinancialData = {
        income: formData.income,
        age: formData.age,
        expenses: formData.expenses,
        location: formData.location,
        debts: [
          {
            name: 'General Debt', 
            amount: formData.debtAmount || 0, 
            interest: formData.debtInterest || 10
          }
        ],
        liabilities: formData.liabilities,
        financialGoals: formData.financialGoals,
        timeHorizon: formData.timeHorizon,
        monthlySavings: formData.income - formData.expenses,
        // Adding empty investments array to ensure component compatibility
        investments: []
      };
      
      // Pass the form data to the parent component
      onDataSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  // Improved number input with better formatting and precision
  const NumberInput: React.FC<NumberInputProps> = ({ 
    label, 
    value, 
    onChange, 
    onIncrement,
    onDecrement,
    emoji, 
    field,
    step = 1000, 
    min = 0, 
    max = 10000000,
    format,
    isCurrency = false
  }) => {
    // Default formatter based on currency flag
    const defaultFormatter = isCurrency 
      ? (val: number) => formatIndianCurrency(val)
      : (val: number) => `${val.toLocaleString('en-IN')}`;
    
    const formatter = format || defaultFormatter;
    const displayValue = formatter(value);
    
    // Handle input focus for better UX
    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(value.toString());

    // Update local input value when the parent value changes
    useEffect(() => {
      if (!isFocused) {
        setInputValue(value.toString());
      }
    }, [value, isFocused]);

    // Handle direct text input
    const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    // Handle slider input
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = Number(e.target.value);
      onChange(newValue); // Update the parent state immediately
    };

    // Process the input value when the input loses focus
    const handleBlur = () => {
      setIsFocused(false);

      // Clean the input based on whether it's currency or not
      const cleanValue = isCurrency 
        ? inputValue.replace(/[^0-9]/g, '') 
        : inputValue.replace(/[^0-9.]/g, '');
      
      // Convert to number, default to current value if invalid
      const numValue = cleanValue ? parseFloat(cleanValue) : value;
      
      // Apply min/max bounds
      const boundedValue = Math.max(min, Math.min(max, numValue));
      
      // Update parent component state
      onChange(boundedValue);
      
      // Sync the input value with the bounded value
      setInputValue(boundedValue.toString());
    };

    // Handle "Enter" key press
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleBlur();
      }
    };

    return (
      <div className="mb-3 bg-gray-50 p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <span className="mr-1 text-md text-black">{emoji}</span>
            <span className="text-xs font-medium tracking-wide text-black">{label}</span>
          </div>
          <div className="flex items-center">
            <button 
              onClick={onDecrement}
              className="w-7 h-7 flex items-center justify-center text-md text-black hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Decrease value"
              type="button"
            >
              {FINANCIAL_EMOJIS.minus}
            </button>
            <div className="mx-1 text-xs font-medium min-w-16 text-center text-black">
              {isFocused ? (
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleDirectInput}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  className="w-20 text-center bg-white border border-gray-200 rounded px-1 py-1 focus:outline-none focus:border-black"
                  aria-label={`Enter ${label} directly`}
                  autoFocus
                />
              ) : (
                <div
                  onClick={() => {
                    setIsFocused(true);
                    setInputValue(value.toString());
                  }}
                  className="cursor-text w-20 text-center"
                >
                  {displayValue}
                </div>
              )}
            </div>
            <button 
              onClick={onIncrement}
              className="w-7 h-7 flex items-center justify-center text-md text-black hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Increase value"
              type="button"
            >
              {FINANCIAL_EMOJIS.plus}
            </button>
          </div>
        </div>
        <div className="relative w-full h-1 bg-gray-200 rounded-full">
          <div 
            className="absolute h-1 bg-black rounded-full"
            style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
          ></div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleSliderChange}
            className="absolute w-full h-1 opacity-0 cursor-pointer"
            aria-label={`Adjust ${label}`}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{isCurrency ? formatIndianCurrency(min) : min}</span>
          <span className="text-xs text-gray-500">{isCurrency ? formatIndianCurrency(max) : max}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-72 h-screen bg-white border-r border-gray-100 p-1 overflow-y-auto font-mono" style={{
      scrollbarWidth: 'thin',
      scrollbarColor: '#cbd5e0 #ffffff',
    }}>
      <style jsx global>{`
        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 transparent;
        }
      `}</style>
      
      <div className="py-2 mb-2 text-center">
        <h1 className="text-xl font-bold tracking-tight text-black">Gandhi</h1>
        <p className="text-xs text-black">Financial Planning Tool</p>
      </div>
      
      {/* Core Form Fields */}
      <div className="mb-3 space-y-2">
        <NumberInput 
          label="Monthly Income" 
          value={formData.income} 
          onChange={(value) => handleNumberChange('income', value)} 
          onIncrement={() => incrementValue('income')}
          onDecrement={() => decrementValue('income')}
          emoji={FINANCIAL_EMOJIS.income}
          field="income"
          step={FIELD_CONFIGS.income.step}
          min={FIELD_CONFIGS.income.min}
          max={FIELD_CONFIGS.income.max}
          isCurrency={true}
        />
        
        <NumberInput 
          label="Age" 
          value={formData.age} 
          onChange={(value) => handleNumberChange('age', value)}
          onIncrement={() => incrementValue('age')}
          onDecrement={() => decrementValue('age')} 
          emoji={FINANCIAL_EMOJIS.age}
          field="age"
          step={FIELD_CONFIGS.age.step}
          min={FIELD_CONFIGS.age.min}
          max={FIELD_CONFIGS.age.max}
          format={(val) => `${val} years`}
        />
        
        <NumberInput 
          label="Monthly Expenses" 
          value={formData.expenses} 
          onChange={(value) => handleNumberChange('expenses', value)}
          onIncrement={() => incrementValue('expenses')}
          onDecrement={() => decrementValue('expenses')} 
          emoji={FINANCIAL_EMOJIS.expenses}
          field="expenses"
          step={FIELD_CONFIGS.expenses.step}
          min={FIELD_CONFIGS.expenses.min}
          max={FIELD_CONFIGS.expenses.max}
          isCurrency={true}
        />
        
        <NumberInput 
          label="Time Horizon" 
          value={formData.timeHorizon} 
          onChange={(value) => handleNumberChange('timeHorizon', value)}
          onIncrement={() => incrementValue('timeHorizon')}
          onDecrement={() => decrementValue('timeHorizon')} 
          emoji={FINANCIAL_EMOJIS.timeHorizon}
          field="timeHorizon"
          step={FIELD_CONFIGS.timeHorizon.step}
          min={FIELD_CONFIGS.timeHorizon.min}
          max={FIELD_CONFIGS.timeHorizon.max}
          format={(val) => `${val} years`}
        />
      </div>
      
      {/* Submit Button */}
      <button 
        className="w-full py-3 px-3 relative overflow-hidden group bg-black text-white text-xs font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg mb-3"
        onClick={handleSubmit}
        disabled={isLoading}
        aria-label="Generate financial plan"
        type="button"
      >
        <span className="relative z-10">
          {isLoading ? 'Generating Plan...' : 'Generate Financial Plan'}
        </span>
        <span className="absolute left-0 bottom-0 h-full bg-gray-800 w-0 transition-all duration-300 group-hover:w-full"></span>
      </button>
      
      {/* Advanced Options Toggle */}
      <div className="text-center">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-gray-500 hover:text-black transition-colors"
          aria-expanded={showAdvanced}
          aria-controls="advanced-options"
          type="button"
        >
          {showAdvanced ? '▲ Hide Advanced Options' : '▼ Show Advanced Options'}
        </button>
      </div>
      
      {/* Advanced Options */}
      {showAdvanced && (
        <div id="advanced-options" className="mt-3 space-y-2">
          <div className="mb-2 bg-gray-50 p-2 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <span className="mr-1 text-md text-black">{FINANCIAL_EMOJIS.location}</span>
                <span className="text-xs font-medium tracking-wide text-black">Location</span>
              </div>
            </div>
            <select 
              className="w-full py-1.5 px-2 border border-gray-200 rounded-md bg-white text-xs text-black focus:outline-none focus:border-black transition-colors"
              value={formData.location}
              onChange={handleLocationChange}
              aria-label="Select your location"
            >
              {INDIAN_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <NumberInput 
            label="Debt Amount" 
            value={formData.debtAmount} 
            onChange={(value) => handleNumberChange('debtAmount', value)}
            onIncrement={() => incrementValue('debtAmount')}
            onDecrement={() => decrementValue('debtAmount')} 
            emoji={FINANCIAL_EMOJIS.debts}
            field="debtAmount"
            step={FIELD_CONFIGS.debtAmount.step}
            min={FIELD_CONFIGS.debtAmount.min}
            max={FIELD_CONFIGS.debtAmount.max}
            isCurrency={true}
          />
          
          <NumberInput 
            label="Total Liabilities" 
            value={formData.liabilities} 
            onChange={(value) => handleNumberChange('liabilities', value)}
            onIncrement={() => incrementValue('liabilities')}
            onDecrement={() => decrementValue('liabilities')} 
            emoji={FINANCIAL_EMOJIS.liabilities}
            field="liabilities"
            step={FIELD_CONFIGS.liabilities.step}
            min={FIELD_CONFIGS.liabilities.min}
            max={FIELD_CONFIGS.liabilities.max}
            isCurrency={true}
          />
          
          <div className="mb-3">
            <div className="flex items-center mb-2">
              <span className="mr-1 text-md text-black">{FINANCIAL_EMOJIS.goals}</span>
              <h3 className="text-xs font-medium tracking-wide text-black">Financial Goals</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {FINANCIAL_GOALS.map(goal => (
                <button
                  key={goal.id}
                  className={`flex items-center justify-between p-2 h-10 rounded-md ${formData.financialGoals.includes(goal.id) ? 'bg-black text-white shadow-md' : 'bg-gray-50 text-black border border-gray-100 shadow-sm'} transition-all duration-200 hover:border-gray-300`}
                  onClick={() => handleGoalToggle(goal.id)}
                  aria-pressed={formData.financialGoals.includes(goal.id)}
                  aria-label={`Select ${goal.label} as a financial goal`}
                  type="button"
                >
                  <div className="flex items-center">
                    <span className="mr-1 text-md">{goal.emoji}</span>
                    <span className="text-xs font-medium">{goal.label}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full border ${formData.financialGoals.includes(goal.id) ? 'bg-white border-white' : 'border-gray-300'}`}>
                    {formData.financialGoals.includes(goal.id) && (
                      <div className="w-full h-full rounded-full bg-black"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;