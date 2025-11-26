"use client";

import React, { useState, useEffect } from 'react';

const BalanceCard = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/get/users');
        const result = await response.json();
        if (result.success) {
          setBalance(result.data.balance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  // Convert numbers to Devanagari
  const toDevanagariNumber = (num: number): string => {
    const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
    return num.toString().split('').map(digit => devanagariDigits[parseInt(digit)]).join('');
  };

  // Mumbai money slang converter - पेटी for lakh, खोका for crore
  const convertToMumbaiSlang = (amount: number): string => {
    if (amount === 0) return 'शून्य';
    
    const crore = Math.floor(amount / 10000000);
    const lakh = Math.floor((amount % 10000000) / 100000);
    const thousand = Math.floor((amount % 100000) / 1000);
    const hundred = Math.floor((amount % 1000) / 100);
    const remaining = amount % 100;

    const parts: string[] = [];

    // Crore (खोका)
    if (crore > 0) {
      const croreWords = ['', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ'];
      if (crore <= 9) {
        parts.push(`${croreWords[crore]} खोका`);
      } else {
        parts.push(`${toDevanagariNumber(crore)} खोका`);
      }
    }

    // Lakh (पेटी)
    if (lakh > 0) {
      const lakhWords = ['', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ'];
      if (lakh <= 9) {
        parts.push(`${lakhWords[lakh]} पेटी`);
      } else if (lakh === 25) {
        parts.push('पच्चीस पेटी');
      } else if (lakh === 50) {
        parts.push('पचास पेटी');
      } else if (lakh === 75) {
        parts.push('पचहत्तर पेटी');
      } else {
        parts.push(`${toDevanagariNumber(lakh)} पेटी`);
      }
    }

    // Thousand
    if (thousand > 0) {
      const thousandWords: { [key: number]: string } = {
        1: 'एक हजार',
        2: 'दो हजार',
        3: 'तीन हजार',
        4: 'चार हजार',
        5: 'पांच हजार',
        10: 'दस हजार',
        15: 'पंद्रह हजार',
        20: 'बीस हजार',
        25: 'पच्चीस हजार',
        50: 'पचास हजार',
        75: 'पचहत्तर हजार'
      };
      parts.push(thousandWords[thousand] || `${toDevanagariNumber(thousand)} हजार`);
    }

    // Hundred
    if (hundred > 0) {
      const hundredWords = ['', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ'];
      if (hundred <= 9) {
        parts.push(`${hundredWords[hundred]} सौ`);
      } else {
        parts.push(`${toDevanagariNumber(hundred)} सौ`);
      }
    }

    // Remaining (1-99)
    if (remaining > 0) {
      const ones = ['', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ'];
      const teens = ['दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'];
      const tens = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];

      if (remaining < 10) {
        parts.push(ones[remaining]);
      } else if (remaining < 20) {
        parts.push(teens[remaining - 10]);
      } else {
        const tensDigit = Math.floor(remaining / 10);
        const onesDigit = remaining % 10;
        if (onesDigit === 0) {
          parts.push(tens[tensDigit]);
        } else {
          parts.push(`${tens[tensDigit]} ${ones[onesDigit]}`);
        }
      }
    }

    return parts.join(' ') || 'शून्य';
  };

  return (
    <div className="brutal-shadow" style={{
      background: '#C4F000',
      border: '3px solid #050505',
      padding: 'clamp(12px, 1.2vw, 18px)',
      transition: 'all 0.2s',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%'
    }}>
      {loading ? (
        <>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(10px, 1vw, 14px)',
            fontWeight: 800,
            marginBottom: '8px',
            letterSpacing: '1px',
            color: '#050505'
          }}>
            BALANCE
          </div>
          <div style={{
            background: '#050505',
            opacity: 0.1,
            height: 'clamp(24px, 2.5vw, 36px)',
            width: '70%',
            marginBottom: '8px',
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite'
          }} />
          <div style={{
            background: '#050505',
            opacity: 0.1,
            height: 'clamp(12px, 1vw, 16px)',
            width: '90%',
            marginTop: 'auto',
            borderRadius: '4px',
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: '0.2s'
          }} />
        </>
      ) : (
        <>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(10px, 1vw, 14px)',
            fontWeight: 800,
            marginBottom: '8px',
            letterSpacing: '1px',
            color: '#050505'
          }}>
            BALANCE
          </div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(24px, 2.5vw, 36px)',
            fontWeight: 800,
            marginBottom: '6px',
            color: '#050505'
          }}>
            ₹{balance?.toLocaleString('en-IN') ?? '0'}
          </div>
          <div style={{
            fontFamily: "'Hind Guntur', sans-serif",
            fontSize: 'clamp(10px, 1vw, 14px)',
            fontWeight: 700,
            color: '#050505',
            marginTop: 'auto',
            lineHeight: '1.4'
          }}>
            {balance !== null ? convertToMumbaiSlang(balance) : ''}
          </div>
        </>
      )}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default BalanceCard;