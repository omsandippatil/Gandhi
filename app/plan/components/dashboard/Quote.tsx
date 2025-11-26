'use client';

import React, { useState, useEffect } from 'react';

interface QuoteProps {
  title: string;
  quoteData?: {
    text: string;
    author: string;
  };
}

const Quote: React.FC<QuoteProps> = ({ title, quoteData }) => {
  // State to store the selected quote
  const [selectedQuote, setSelectedQuote] = useState<{text: string, author: string} | null>(null);
  
  // Expanded quotes collection with Indian investors and influencers
  const quotes = [
    {
      text: "An investment in knowledge pays the best interest.",
      author: "Benjamin Franklin"
    },
    {
      text: "The stock market is a device for transferring money from the impatient to the patient.",
      author: "Warren Buffett"
    },
    {
      text: "Don't save what is left after spending, spend what is left after saving.",
      author: "Warren Buffett"
    },
    {
      text: "It's not how much money you make, but how much money you keep.",
      author: "Robert Kiyosaki"
    },
    {
      text: "The goal isn't more money. The goal is living life on your terms.",
      author: "Chris Brogan"
    },
    // Ankur Warikoo quotes
    {
      text: "The biggest risk is not taking any risk at all. In a world that's changing quickly, the only strategy that is guaranteed to fail is not taking risks.",
      author: "Ankur Warikoo"
    },
    {
      text: "Wealth is not about having a lot of money, it's about having a lot of options.",
      author: "Ankur Warikoo"
    },
    {
      text: "Financial freedom is not about being rich. It is about having control over your life and the choices you make.",
      author: "Ankur Warikoo"
    },
    {
      text: "Success is never owned, it's rented. And the rent is due every day.",
      author: "Ankur Warikoo"
    },
    {
      text: "The difference between successful people and really successful people is that really successful people say no to almost everything.",
      author: "Ankur Warikoo"
    },
    // Other Indian investors and influencers
    {
      text: "Don't run behind money, run behind skills that will bring money to you forever.",
      author: "Radhika Gupta"
    },
    {
      text: "Investment is not just about returns, it's about sleeping well at night.",
      author: "Nilesh Shah"
    },
    {
      text: "A bear market is the best time to build wealth if you can keep your emotions aside and think logically.",
      author: "Basant Maheshwari"
    },
    {
      text: "Risk comes from not knowing what you're doing.",
      author: "Rakesh Jhunjhunwala"
    },
    {
      text: "Never test the depth of a river with both feet.",
      author: "Vijay Kedia"
    }
  ];
  
  // Use useEffect to handle the random selection on the client side only
  useEffect(() => {
    // Use provided quote or select a random one
    if (quoteData) {
      setSelectedQuote(quoteData);
    } else {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setSelectedQuote(quotes[randomIndex]);
    }
  }, [quoteData]); // Dependency array includes quoteData
  
  // Render nothing until client-side hydration completes
  if (!selectedQuote) {
    return (
      <div className="w-full bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-medium tracking-wide text-black mb-4">{title}</h2>
        <div className="relative">
          <div className="h-16"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-medium tracking-wide text-black mb-4">{title}</h2>
      
      <div className="relative">
        <div className="absolute -top-6 -left-4 text-4xl text-gray-200 font-serif">"</div>
        <p className="text-lg italic text-black mb-2 relative z-10 font-mono">{selectedQuote.text}</p>
        <div className="absolute -bottom-6 -right-4 text-4xl text-gray-200 font-serif rotate-180">"</div>
        <p className="text-sm text-right mt-2 text-black font-mono">— {selectedQuote.author}</p>
      </div>
    </div>
  );
};

export default Quote;