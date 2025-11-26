// Define types for user input data
export interface UserFinancialData {
  income: number;           // Monthly income in INR
  age: number;              // User's age
  expenses: number;         // Monthly expenses in INR
  location: string;         // City in India
  debts: number;            // Total outstanding debt in INR
  liabilities: number;      // Total liabilities in INR
  financialGoals: string[]; // ["phone", "car", "home"]
  timeHorizon: number;      // Investment time horizon in years
  monthlySavings?: number;  // Calculated field: income - expenses
}

// Define expected output from the API
export interface InvestmentPlan {
  overview: {
    currentAssets: number;
    projectedAssets: number[];  // Year-wise projection
    currentLiabilities: number;
    projectedLiabilities: number[];  // Year-wise projection
    currentNetWorth: number;
    projectedNetWorth: number[];  // Year-wise projection
  };
  incomeVsExpenses: {
    monthlyIncome: number;
    monthlyExpenses: {
      housing: number;
      utilities: number;
      groceries: number;
      transportation: number;
      entertainment: number;
      other: number;
    };
    savingsRate: number;  // Percentage
  };
  monthlyExpenses: {
    recurringBills: {
      rent: number;
      electricity: number;
      internet: number;
      mobile: number;
      subscriptions: number;
      other: number;
    };
    totalSubscriptionCosts: number;
    totalExpenses: number;
  };
  funds: {
    emergencyFund: {
      target: number;
      current: number;
      monthlyContribution: number;
      timeToReach: number;  // In months
    };
    childrenEducationFund: {
      target: number;
      current: number;
      monthlyContribution: number;
      timeToReach: number;  // In months
    };
    retirementFund: {
      target: number;
      current: number;
      monthlyContribution: number;
      timeToReach: number;  // In months
    };
    dreamFunds: {
      [key: string]: {
        target: number;
        current: number;
        monthlyContribution: number;
        timeToReach: number;  // In months
      };
    };
  };
  investmentGraph: {
    months: number[];
    investments: number[];
    returns: number[];
  };
  investmentAllocation: {
    monthly: {
      equityMutualFunds: {
        amount: number;
        percentage: number;
        breakdown: {
          largeCap: number;  // 60% of equity
          midCapFlexiCap: number;  // 25% of equity
          smallCap: number;  // 15% of equity
        };
      };
      debt: {
        amount: number;
        percentage: number;
        breakdown: {
          fixedDeposits: number;
          governmentBonds: number;
        };
      };
      gold: {
        amount: number;
        percentage: number;
      };
      nps: {
        amount: number;
        percentage: number;
      };
      ppf: {
        amount: number;
        percentage: number;
      };
    };
    expectedReturns: {
      after5Years: number;
      after10Years: number;
      after20Years: number;
      afterTimeHorizon: number;
    };
    expectedTotalReturns: {  // Added total returns over investment period
      equityMutualFunds: number;
      debt: number;
      gold: number;
      nps: number;
      ppf: number;
      total: number;
    };
  };
  milestoneTracker: {
    financialIndependence: {
      targetAge: number;
      targetAmount: number;
      progress: number;  // Percentage
    };
    majorMilestones: {
      [key: string]: {
        targetAge: number;
        targetAmount: number;
        progress: number;  // Percentage
      };
    };
  };
  portfolioPerformance: {
    totalInvestedAmount: number;
    monthlyInvestments: {
      [key: string]: number;  // Asset-wise monthly investment
    };
    projectedGrowth: {
      [key: string]: number[];  // Asset-wise yearly projections
    };
  };
  debtRepaymentTracker: {
    totalDebt: number;
    monthlyPayment: number;
    estimatedRepaymentTime: number;  // In months
    repaymentPlan: {
      [key: string]: number;  // Monthly payment per debt type
    };
  };
}

// API configuration
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const MODEL = 'llama3-70b-8192';

/**
 * Generate a comprehensive investment plan based on user financial data
 * @param userData The user's financial information
 * @returns A detailed investment plan with allocations and projections
 */
export async function generateInvestmentPlan(userData: UserFinancialData): Promise<InvestmentPlan> {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not defined in environment variables');
  }

  // Calculate monthly savings if not provided
  const monthlySavings = userData.monthlySavings ?? (userData.income - userData.expenses);
  
  const prompt = `
  You are a financial advisor specializing in Indian investment planning.
  Based on the following user financial data, create a detailed investment plan following modern financial principles.
  Consider all amounts in Indian Rupees (₹).

  User Financial Data:
  - Monthly Income: ₹${userData.income}
  - Age: ${userData.age} years
  - Monthly Expenses: ₹${userData.expenses}
  - Location: ${userData.location}
  - Total Outstanding Debts: ₹${userData.debts}
  - Total Liabilities: ₹${userData.liabilities}
  - Financial Goals: ${userData.financialGoals.join(', ')}
  - Investment Time Horizon: ${userData.timeHorizon} years
  - Monthly Savings (Income - Expenses): ₹${monthlySavings}

  Please provide a comprehensive financial plan with the following components:
  1. Overview of current and projected assets, liabilities, and net worth
  2. Income vs expenses breakdown with savings rate
  3. Monthly expense categorization
  4. Fund allocations (Emergency, Education, Retirement, Dream funds)
  5. Investment graph data for visualization
  6. Investment allocation recommendations following:
     - "100 minus age" rule for equity allocation
     - 60% large-cap, 25% mid-cap/flexi-cap, 15% small-cap for mutual funds
     - Suitable debt instruments for the Indian market
  7. Expected total returns for each investment type over the entire investment period
  8. Milestone tracker based on age and goals
  9. Portfolio performance projections
  10. Debt repayment strategy

  Assume:
  - Annual salary increase of 8-10%
  - Annual investment return of 12% for equity, 7% for debt, 8% for gold
  - Inflation rate of 6% per annum
  - Life expectancy of 80 years
  
  Respond only with a valid JSON object matching the exact structure provided in the template below.
  Include detailed numerical values for all fields without placeholders.
  
  Template:
  ${JSON.stringify({
    overview: {
      currentAssets: 0,
      projectedAssets: [0, 0, 0],
      currentLiabilities: 0,
      projectedLiabilities: [0, 0, 0],
      currentNetWorth: 0,
      projectedNetWorth: [0, 0, 0]
    },
    incomeVsExpenses: {
      monthlyIncome: 0,
      monthlyExpenses: {
        housing: 0,
        utilities: 0,
        groceries: 0,
        transportation: 0,
        entertainment: 0,
        other: 0
      },
      savingsRate: 0
    },
    monthlyExpenses: {
      recurringBills: {
        rent: 0,
        electricity: 0,
        internet: 0,
        mobile: 0,
        subscriptions: 0,
        other: 0
      },
      totalSubscriptionCosts: 0,
      totalExpenses: 0
    },
    funds: {
      emergencyFund: {
        target: 0,
        current: 0,
        monthlyContribution: 0,
        timeToReach: 0
      },
      childrenEducationFund: {
        target: 0,
        current: 0,
        monthlyContribution: 0,
        timeToReach: 0
      },
      retirementFund: {
        target: 0,
        current: 0,
        monthlyContribution: 0,
        timeToReach: 0
      },
      dreamFunds: {}
    },
    investmentGraph: {
      months: [],
      investments: [],
      returns: []
    },
    investmentAllocation: {
      monthly: {
        equityMutualFunds: {
          amount: 0,
          percentage: 0,
          breakdown: {
            largeCap: 0,
            midCapFlexiCap: 0,
            smallCap: 0
          }
        },
        debt: {
          amount: 0,
          percentage: 0,
          breakdown: {
            fixedDeposits: 0,
            governmentBonds: 0
          }
        },
        gold: {
          amount: 0,
          percentage: 0
        },
        nps: {
          amount: 0,
          percentage: 0
        },
        ppf: {
          amount: 0,
          percentage: 0
        }
      },
      expectedReturns: {
        after5Years: 0,
        after10Years: 0,
        after20Years: 0,
        afterTimeHorizon: 0
      },
      expectedTotalReturns: {
        equityMutualFunds: 0,
        debt: 0,
        gold: 0,
        nps: 0,
        ppf: 0,
        total: 0
      }
    },
    milestoneTracker: {
      financialIndependence: {
        targetAge: 0,
        targetAmount: 0,
        progress: 0
      },
      majorMilestones: {}
    },
    portfolioPerformance: {
      totalInvestedAmount: 0,
      monthlyInvestments: {},
      projectedGrowth: {}
    },
    debtRepaymentTracker: {
      totalDebt: 0,
      monthlyPayment: 0,
      estimatedRepaymentTime: 0,
      repaymentPlan: {}
    }
  }, null, 2)}
  `;

  try {
    // Make a direct API call to Groq
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a financial advisor specializing in Indian investment planning. Respond only with valid JSON data according to the template provided.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    const responseContent = responseData.choices[0].message.content;
    
    if (!responseContent) {
      throw new Error('Empty response from Groq API');
    }

    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not find valid JSON in the response');
      }
      
      const jsonString = jsonMatch[0];
      const investmentPlan = JSON.parse(jsonString) as InvestmentPlan;
      
      // Process and validate the data
      validateInvestmentPlan(investmentPlan, userData);
      
      return investmentPlan;
    } catch (parseError) {
      console.error('Error parsing Groq response:', parseError);
      throw new Error('Failed to parse investment plan data');
    }
  } catch (apiError) {
    console.error('Error calling Groq API:', apiError);
    throw new Error('Failed to generate investment plan');
  }
}

/**
 * Validates and corrects the investment plan data
 * @param plan The investment plan to validate
 * @param userData The original user data
 */
function validateInvestmentPlan(plan: InvestmentPlan, userData: UserFinancialData): void {
  // Calculate monthly savings if not provided in userData
  const monthlySavings = userData.monthlySavings ?? (userData.income - userData.expenses);
  
  // Ensure emergency fund target is at least 6 months of expenses
  const minEmergencyFund = userData.expenses * 6;
  if (plan.funds.emergencyFund.target < minEmergencyFund) {
    plan.funds.emergencyFund.target = minEmergencyFund;
    // Recalculate time to reach
    if (plan.funds.emergencyFund.monthlyContribution > 0) {
      plan.funds.emergencyFund.timeToReach = 
        Math.ceil((plan.funds.emergencyFund.target - plan.funds.emergencyFund.current) / 
        plan.funds.emergencyFund.monthlyContribution);
    }
  }

  // Ensure all percentages in investment allocation add up to 100%
  const totalPercentage = 
    plan.investmentAllocation.monthly.equityMutualFunds.percentage + 
    plan.investmentAllocation.monthly.debt.percentage + 
    plan.investmentAllocation.monthly.gold.percentage + 
    plan.investmentAllocation.monthly.nps.percentage + 
    plan.investmentAllocation.monthly.ppf.percentage;

  if (Math.abs(totalPercentage - 100) > 0.1) {
    // Adjust percentages proportionally
    const factor = 100 / totalPercentage;
    plan.investmentAllocation.monthly.equityMutualFunds.percentage *= factor;
    plan.investmentAllocation.monthly.debt.percentage *= factor;
    plan.investmentAllocation.monthly.gold.percentage *= factor;
    plan.investmentAllocation.monthly.nps.percentage *= factor;
    plan.investmentAllocation.monthly.ppf.percentage *= factor;
  }

  // Ensure equity breakdown percentages add up to 100%
  const equityBreakdownTotal = 
    (plan.investmentAllocation.monthly.equityMutualFunds.breakdown.largeCap / 
    plan.investmentAllocation.monthly.equityMutualFunds.amount * 100) + 
    (plan.investmentAllocation.monthly.equityMutualFunds.breakdown.midCapFlexiCap / 
    plan.investmentAllocation.monthly.equityMutualFunds.amount * 100) + 
    (plan.investmentAllocation.monthly.equityMutualFunds.breakdown.smallCap / 
    plan.investmentAllocation.monthly.equityMutualFunds.amount * 100);

  if (Math.abs(equityBreakdownTotal - 100) > 0.1) {
    // Reset to recommended 60/25/15 split
    const equityAmount = plan.investmentAllocation.monthly.equityMutualFunds.amount;
    plan.investmentAllocation.monthly.equityMutualFunds.breakdown.largeCap = equityAmount * 0.6;
    plan.investmentAllocation.monthly.equityMutualFunds.breakdown.midCapFlexiCap = equityAmount * 0.25;
    plan.investmentAllocation.monthly.equityMutualFunds.breakdown.smallCap = equityAmount * 0.15;
  }

  // Ensure investment graph has enough data points (at least 60 months)
  const minDataPoints = 60;
  if (plan.investmentGraph.months.length < minDataPoints) {
    const lastMonth = plan.investmentGraph.months.length > 0 ? 
      plan.investmentGraph.months[plan.investmentGraph.months.length - 1] : 0;
    const lastInvestment = plan.investmentGraph.investments.length > 0 ? 
      plan.investmentGraph.investments[plan.investmentGraph.investments.length - 1] : 0;
    const lastReturn = plan.investmentGraph.returns.length > 0 ? 
      plan.investmentGraph.returns[plan.investmentGraph.returns.length - 1] : 0;

    // Extrapolate to have at least minDataPoints
    for (let i = plan.investmentGraph.months.length; i < minDataPoints; i++) {
      plan.investmentGraph.months.push(lastMonth + i);
      
      // Assume monthly investment stays constant
      const newInvestment = lastInvestment + monthlySavings;
      plan.investmentGraph.investments.push(newInvestment);
      
      // Assume returns grow at approximately 10% annually (0.8% monthly)
      const newReturn = lastReturn * 1.008;
      plan.investmentGraph.returns.push(newReturn);
    }
  }

  // Calculate expected total returns if not provided or incorrect
  if (!plan.investmentAllocation.expectedTotalReturns ||
      plan.investmentAllocation.expectedTotalReturns.total === 0) {
    const monthlyEquity = plan.investmentAllocation.monthly.equityMutualFunds.amount;
    const monthlyDebt = plan.investmentAllocation.monthly.debt.amount;
    const monthlyGold = plan.investmentAllocation.monthly.gold.amount;
    const monthlyNPS = plan.investmentAllocation.monthly.nps.amount;
    const monthlyPPF = plan.investmentAllocation.monthly.ppf.amount;
    
    // Calculate total returns using compound interest formula
    // FV = P * ((1 + r)^n - 1) / r * (1 + r), where:
    // FV = Future value, P = Monthly payment, r = Monthly interest rate, n = Number of months
    const months = userData.timeHorizon * 12;
    const equityMonthlyRate = 0.12 / 12; // 12% annual / 12 months
    const debtMonthlyRate = 0.07 / 12;   // 7% annual / 12 months
    const goldMonthlyRate = 0.08 / 12;   // 8% annual / 12 months
    const npsMonthlyRate = 0.1 / 12;     // 10% annual / 12 months
    const ppfMonthlyRate = 0.071 / 12;   // 7.1% annual / 12 months
    
    // Calculate compound growth for each investment type
    const equityTotal = monthlyEquity * ((Math.pow(1 + equityMonthlyRate, months) - 1) / equityMonthlyRate) * (1 + equityMonthlyRate);
    const debtTotal = monthlyDebt * ((Math.pow(1 + debtMonthlyRate, months) - 1) / debtMonthlyRate) * (1 + debtMonthlyRate);
    const goldTotal = monthlyGold * ((Math.pow(1 + goldMonthlyRate, months) - 1) / goldMonthlyRate) * (1 + goldMonthlyRate);
    const npsTotal = monthlyNPS * ((Math.pow(1 + npsMonthlyRate, months) - 1) / npsMonthlyRate) * (1 + npsMonthlyRate);
    const ppfTotal = monthlyPPF * ((Math.pow(1 + ppfMonthlyRate, months) - 1) / ppfMonthlyRate) * (1 + ppfMonthlyRate);
    
    // Calculate total invested amount for each investment type
    const equityInvested = monthlyEquity * months;
    const debtInvested = monthlyDebt * months;
    const goldInvested = monthlyGold * months;
    const npsInvested = monthlyNPS * months;
    const ppfInvested = monthlyPPF * months;
    
    // Calculate returns as future value minus total invested
    plan.investmentAllocation.expectedTotalReturns = {
      equityMutualFunds: equityTotal - equityInvested,
      debt: debtTotal - debtInvested,
      gold: goldTotal - goldInvested,
      nps: npsTotal - npsInvested,
      ppf: ppfTotal - ppfInvested,
      total: (equityTotal + debtTotal + goldTotal + npsTotal + ppfTotal) - 
             (equityInvested + debtInvested + goldInvested + npsInvested + ppfInvested)
    };
  }

  // Ensure all financial goals are included in dream funds and major milestones
  userData.financialGoals.forEach(goal => {
    if (!plan.funds.dreamFunds[goal]) {
      // Add missing goal with default values
      plan.funds.dreamFunds[goal] = {
        target: goal === 'phone' ? 50000 : goal === 'car' ? 800000 : 5000000, // Default targets
        current: 0,
        monthlyContribution: monthlySavings * 0.1, // Allocate 10% of savings
        timeToReach: 0 // Will be calculated below
      };
      
      // Calculate time to reach
      plan.funds.dreamFunds[goal].timeToReach = Math.ceil(
        plan.funds.dreamFunds[goal].target / plan.funds.dreamFunds[goal].monthlyContribution
      );
    }

    if (!plan.milestoneTracker.majorMilestones[goal]) {
      // Add missing milestone
      const targetAge = userData.age + Math.ceil(plan.funds.dreamFunds[goal].timeToReach / 12);
      plan.milestoneTracker.majorMilestones[goal] = {
        targetAge: targetAge,
        targetAmount: plan.funds.dreamFunds[goal].target,
        progress: (plan.funds.dreamFunds[goal].current / plan.funds.dreamFunds[goal].target) * 100
      };
    }
  });
}

/**
 * Sample usage example - this demonstrates how to use the API
 */
export async function sampleUsage() {
  const userData: UserFinancialData = {
    income: 120000,
    age: 30,
    expenses: 60000,
    location: "Bangalore",
    debts: 1000000,
    liabilities: 1500000,
    financialGoals: ["phone", "car", "home"],
    timeHorizon: 20
  };

  try {
    const plan = await generateInvestmentPlan(userData);
    console.log("Investment Plan Generated:", plan);
    return plan;
  } catch (error) {
    console.error("Error generating investment plan:", error);
    throw error;
  }
}

// Export functions for use in components
export default {
  generateInvestmentPlan,
  sampleUsage
};