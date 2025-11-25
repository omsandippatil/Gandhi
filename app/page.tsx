'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function GandhiPage() {
  useEffect(() => {
    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-text').forEach((el) => {
      observer.observe(el);
    });

    // Scroll behavior for navbar
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      const nav = document.querySelector('nav');
      
      if (!nav) return;
      
      if (currentScroll <= 0) {
        nav.classList.remove('scroll-up');
        return;
      }
      
      if (currentScroll > lastScroll && currentScroll > 80) {
        nav.classList.add('scroll-down');
        nav.classList.remove('scroll-up');
      } else if (currentScroll < lastScroll) {
        nav.classList.remove('scroll-down');
        nav.classList.add('scroll-up');
      }
      
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700&family=Syne:wght@400;700;800&family=Hind+Guntur:wght@400;700&family=Bungee+Inline&display=swap');

        * {
          border-radius: 0px !important;
          box-sizing: border-box;
        }
        
        body {
          background-color: #F5F5F5;
          color: #050505;
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }

        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'Space Grotesk', monospace; }
        .font-devnagri { font-family: 'Hind Guntur', sans-serif; }
        .font-chunky { font-family: 'Bungee Inline', cursive; }

        .text-acid-green { color: #C4F000; }
        .bg-acid-green { background-color: #C4F000; }
        .text-void-black { color: #050505; }
        .bg-void-black { background-color: #050505; }
        .text-paper-white { color: #F5F5F5; }
        .bg-paper-white { background-color: #F5F5F5; }
        
        .noise-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        .brutal-border {
          border: 2px solid #050505;
        }
        
        .brutal-shadow {
          box-shadow: 6px 6px 0px 0px #050505;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        @media (max-width: 640px) {
          .brutal-shadow {
            box-shadow: 4px 4px 0px 0px #050505;
          }
        }
        
        .reveal-text {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .reveal-text.active {
          opacity: 1;
          transform: translateY(0);
        }

        .receipt-clip {
          clip-path: polygon(
            0% 0%, 100% 0%, 100% 100%, 
            95% 98%, 90% 100%, 85% 98%, 80% 100%, 
            75% 98%, 70% 100%, 65% 98%, 60% 100%, 
            55% 98%, 50% 100%, 45% 98%, 40% 100%, 
            35% 98%, 30% 100%, 25% 98%, 20% 100%, 
            15% 98%, 10% 100%, 5% 98%, 0% 100%
          );
        }
        
        .grid-bg {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
        }

        @media (max-width: 640px) {
          .grid-bg {
            background-size: 20px 20px;
          }
        }

        .grid-bg-dark {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px);
        }

        @media (max-width: 640px) {
          .grid-bg-dark {
            background-size: 20px 20px;
          }
        }

        .gandhi-portrait-fade {
          position: relative;
        }
        .gandhi-portrait-fade img {
          mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
        }

        .monkey-fade {
          position: relative;
        }
        .monkey-fade::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 15%;
          background: linear-gradient(to bottom, rgba(5,5,5,0) 0%, #050505 100%);
          pointer-events: none;
          z-index: 1;
        }

        .text-chunky-green {
          color: #C4F000;
          -webkit-text-stroke: 2px #050505;
          paint-order: stroke fill;
          filter: drop-shadow(6px 6px 0px rgba(0,0,0,0.3));
        }

        @media (max-width: 640px) {
          .text-chunky-green {
            -webkit-text-stroke: 1.5px #050505;
            filter: drop-shadow(4px 4px 0px rgba(0,0,0,0.3));
          }
        }

        nav {
          transition: transform 0.3s ease-in-out;
        }
        nav.scroll-down {
          transform: translateY(-100%);
        }
        nav.scroll-up {
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          header {
            min-height: 0;
            padding-bottom: 0;
          }
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes ripple {
          0% {
            box-shadow: 0 0 0 0 rgba(204, 255, 0, 0.7),
                        0 0 0 0 rgba(204, 255, 0, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(204, 255, 0, 0),
                        0 0 0 16px rgba(204, 255, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(204, 255, 0, 0),
                        0 0 0 0 rgba(204, 255, 0, 0);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-pulse-fast {
          animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-ripple {
          animation: ripple 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      <div className="font-body grid-bg" style={{backgroundColor: '#F5F5F5'}}>
        <div className="noise-overlay"></div>

        {/* Navigation */}
        <nav className="fixed w-full top-0 z-50 bg-paper-white border-b-2 border-black flex justify-between items-center p-3 sm:p-4">
          <div className="text-lg sm:text-xl md:text-2xl font-display font-bold tracking-tighter uppercase cursor-pointer">Gandhi</div>
          <Link href="/home">
            <button className="brutal-border px-3 sm:px-4 py-1.5 sm:py-2 font-bold text-xs md:text-sm uppercase bg-black text-acid-green hover:bg-acid-green hover:text-black transition-colors duration-200 animate-ripple">
              Face The Truth
            </button>
          </Link>
        </nav>

        {/* Header */}
        <header className="relative flex flex-col justify-center items-center pt-40 sm:pt-48 md:pt-60 pb-0 px-4 overflow-visible z-0">
          <div className="sm:relative mb-0 w-full max-w-[250px] sm:max-w-[350px] md:max-w-[450px]">
            <div className="absolute inset-0 flex flex-col items-center justify-center top-[130px] sm:top-[100px] md:top-[-60px]">
              <div className="font-chunky text-[70px] sm:text-[120px] md:text-[170px] leading-[0.75] select-none text-center tracking-wide">
                <span className="hidden sm:inline text-black text-sm md:text-base font-display font-bold" style={{WebkitTextStroke: '0px'}}>MONEY IS THE ONLY TRUTH</span><br className="hidden sm:block" />
                <span className="text-black" style={{WebkitTextStroke: '0px'}}>GANDHI</span><br />
                <span className="text-[65px] sm:text-[105px] md:text-[150px] text-chunky-green">MONEY</span>
              </div>
            </div>
          </div>
        </header>

        {/* Desktop Gandhi Portrait */}
        <div className="hidden sm:block relative w-full max-w-[350px] md:max-w-[450px] mx-auto px-4 -mt-8 md:-mt-16 z-20 pointer-events-none">
          <div className="relative w-full gandhi-portrait-fade">
            <Image src="/gandhi.png" alt="Gandhi Portrait" width={450} height={600} className="w-full h-auto relative" />
          </div>
        </div>
        
        {/* Desktop Marquee */}
        <div className="hidden sm:block relative w-screen bg-acid-green overflow-hidden py-1 z-30 -mt-8" style={{marginLeft: 'calc(-50vw + 50%)', width: '100vw'}}>
          <div className="flex animate-marquee whitespace-nowrap font-display font-bold text-xs md:text-sm uppercase tracking-tight">
            <span className="flex gap-8 sm:gap-16 px-4 sm:px-8">
              <span>MONEY IS THE ONLY TRUTH</span>
              <span>•</span>
              <span>SATYAGRAHA FOR YOUR WALLET</span>
              <span>•</span>
              <span>STOP BUYING OVERPRICED COFFEE</span>
              <span>•</span>
              <span>YOUR BANK ACCOUNT IS WEEPING</span>
              <span>•</span>
              <span>MONEY IS THE ONLY TRUTH</span>
              <span>•</span>
              <span>SATYAGRAHA FOR YOUR WALLET</span>
              <span>•</span>
              <span>STOP BUYING OVERPRICED COFFEE</span>
              <span>•</span>
              <span>YOUR BANK ACCOUNT IS WEEPING</span>
              <span>•</span>
              <span>MONEY IS THE ONLY TRUTH</span>
              <span>•</span>
              <span>SATYAGRAHA FOR YOUR WALLET</span>
              <span>•</span>
              <span>STOP BUYING OVERPRICED COFFEE</span>
              <span>•</span>
              <span>YOUR BANK ACCOUNT IS WEEPING</span>
              <span>•</span>
              <span>MONEY IS THE ONLY TRUTH</span>
              <span>•</span>
              <span>SATYAGRAHA FOR YOUR WALLET</span>
              <span>•</span>
            </span>
            
            <span className="flex gap-8 sm:gap-16 px-4 sm:px-8">
              <span>MONEY IS THE ONLY TRUTH</span>
              <span>•</span>
              <span>SATYAGRAHA FOR YOUR WALLET</span>
              <span>•</span>
              <span>STOP BUYING OVERPRICED COFFEE</span>
              <span>•</span>
              <span>YOUR BANK ACCOUNT IS WEEPING</span>
              <span>•</span>
              <span>MONEY IS THE ONLY TRUTH</span>
              <span>•</span>
              <span>SATYAGRAHA FOR YOUR WALLET</span>
              <span>•</span>
              <span>STOP BUYING OVERPRICED COFFEE</span>
              <span>•</span>
              <span>YOUR BANK ACCOUNT IS WEEPING</span>
              <span>•</span>
              <span>MONEY IS THE ONLY TRUTH</span>
              <span>•</span>
              <span>SATYAGRAHA FOR YOUR WALLET</span>
              <span>•</span>
              <span>STOP BUYING OVERPRICED COFFEE</span>
              <span>•</span>
              <span>YOUR BANK ACCOUNT IS WEEPING</span>
              <span>•</span>
              <span>MONEY IS THE ONLY TRUTH</span>
              <span>•</span>
              <span>SATYAGRAHA FOR YOUR WALLET</span>
              <span>•</span>
            </span>
          </div>
        </div>

        {/* Mobile Gandhi Portrait & Marquee */}
        <div className="sm:hidden relative w-full z-20 pointer-events-none">
          <div className="relative w-full max-w-[250px] mx-auto px-4 -mt-12">
            <div className="relative w-full gandhi-portrait-fade">
              <Image src="/gandhi.png" alt="Gandhi Portrait" width={250} height={333} className="w-full h-auto relative" />
            </div>
          </div>
          
          <div className="relative w-screen bg-acid-green overflow-hidden py-1 z-30 -mt-8" style={{marginLeft: 'calc(-50vw + 50%)', width: '100vw'}}>
            <div className="flex animate-marquee whitespace-nowrap font-display font-bold text-xs uppercase tracking-tight">
              <span className="flex gap-8 px-4">
                <span>MONEY IS THE ONLY TRUTH</span>
                <span>•</span>
                <span>SATYAGRAHA FOR YOUR WALLET</span>
                <span>•</span>
                <span>STOP BUYING OVERPRICED COFFEE</span>
                <span>•</span>
                <span>YOUR BANK ACCOUNT IS WEEPING</span>
                <span>•</span>
                <span>MONEY IS THE ONLY TRUTH</span>
                <span>•</span>
                <span>SATYAGRAHA FOR YOUR WALLET</span>
                <span>•</span>
                <span>STOP BUYING OVERPRICED COFFEE</span>
                <span>•</span>
                <span>YOUR BANK ACCOUNT IS WEEPING</span>
                <span>•</span>
              </span>
              
              <span className="flex gap-8 px-4">
                <span>MONEY IS THE ONLY TRUTH</span>
                <span>•</span>
                <span>SATYAGRAHA FOR YOUR WALLET</span>
                <span>•</span>
                <span>STOP BUYING OVERPRICED COFFEE</span>
                <span>•</span>
                <span>YOUR BANK ACCOUNT IS WEEPING</span>
                <span>•</span>
                <span>MONEY IS THE ONLY TRUTH</span>
                <span>•</span>
                <span>SATYAGRAHA FOR YOUR WALLET</span>
                <span>•</span>
                <span>STOP BUYING OVERPRICED COFFEE</span>
                <span>•</span>
                <span>YOUR BANK ACCOUNT IS WEEPING</span>
                <span>•</span>
              </span>
            </div>
          </div>
        </div>
        
        {/* 3 Laws Section */}
        <section className="bg-void-black text-paper-white py-16 sm:py-24 px-4 sm:px-6 border-b-2 border-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mt-8 sm:mt-12">
              <div className="text-center mb-12 sm:mb-20 reveal-text">
                <div className="inline-block bg-acid-green text-black font-display font-bold text-base sm:text-xl uppercase px-3 sm:px-4 py-1 -rotate-2 animate-pulse-fast" style={{boxShadow: '3px 3px 0px 0px #fff'}}>
                  The 3 Laws of Gandhi
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-12 items-start">
                {/* See No Sales */}
                <div className="group relative w-full md:w-1/3 reveal-text bg-void-black p-3 sm:p-4 transition-transform duration-300 cursor-pointer">
                  <div className="absolute -top-2 sm:-top-4 left-1/2 transform -translate-x-1/2 w-36 sm:w-48 h-auto z-10 monkey-fade">
                    <Image src="/monkey-eye.png" alt="See No Sales" width={192} height={192} className="w-full h-auto drop-shadow-2xl transition-all" />
                  </div>
                  <div className="pt-2 sm:pt-2 text-center">
                    <h3 className="text-xl sm:text-2xl font-display font-bold uppercase mb-3 sm:mb-4 text-white hover:text-acid-green transition-colors duration-300">See No Sales</h3>
                    <p className="font-mono text-xs sm:text-sm leading-relaxed text-gray-400 hover:text-acid-green transition-colors duration-300">
                      &quot;Earth provides enough to satisfy every man&apos;s needs, but not every man&apos;s greed. The discount is a lie. The FOMO is manufactured.
                    </p>
                  </div>
                </div>

                {/* Hear No Hype */}
                <div className="group relative w-full md:w-1/3 reveal-text md:mt-12 bg-void-black p-3 sm:p-4 transition-transform duration-300 cursor-pointer" style={{transitionDelay: '100ms'}}>
                  <div className="absolute -top-2 sm:-top-4 left-1/2 transform -translate-x-1/2 w-36 sm:w-48 h-auto z-10 monkey-fade">
                    <Image src="/monkey-ear.png" alt="Hear No Hype" width={192} height={192} className="w-full h-auto drop-shadow-2xl transition-all" />
                  </div>
                  <div className="pt-2 sm:pt-2 text-center">
                    <h3 className="text-xl sm:text-2xl font-display font-bold uppercase mb-3 sm:mb-4 text-white hover:text-acid-green transition-colors duration-300">Hear No Hype</h3>
                    <p className="font-mono text-xs sm:text-sm leading-relaxed text-gray-400 hover:text-acid-green transition-colors duration-300">
                      Influencers monetize your insecurity. They sell you solutions to problems you didn&apos;t have. Unfollow. Unsubscribe. Find peace in silence.
                    </p>
                  </div>
                </div>

                {/* Speak No Flex */}
                <div className="group relative w-full md:w-1/3 reveal-text bg-void-black p-3 sm:p-4 transition-transform duration-300 cursor-pointer" style={{transitionDelay: '200ms'}}>
                  <div className="absolute -top-2 sm:-top-4 left-1/2 transform -translate-x-1/2 w-36 sm:w-48 h-auto z-10 monkey-fade">
                    <Image src="/monkey-mouth.png" alt="Speak No Flex" width={192} height={192} className="w-full h-auto drop-shadow-2xl transition-all" />
                  </div>
                  <div className="pt-2 sm:pt-2 text-center">
                    <h3 className="text-xl sm:text-2xl font-display font-bold uppercase mb-3 sm:mb-4 text-white hover:text-acid-green transition-colors duration-300">Speak No Flex</h3>
                    <p className="font-mono text-xs sm:text-sm leading-relaxed text-gray-400 group-hover:text-acid-green transition-colors duration-300">
                      Your new sneakers don&apos;t make you interesting. Flex is the emptiest form of communication. Save your words. Save your money.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Holy Audit Section */}
        <section className="bg-paper-white py-16 sm:py-24 px-4 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16 reveal-text">
              <h3 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold uppercase mb-2">The Holy Audit</h3>
              <p className="font-mono text-xs md:text-sm bg-black text-white inline-block px-2 sm:px-3 py-1 animate-pulse">WE ARE WATCHING YOU SPEND</p>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20">
              {/* Left Features */}
              <div className="hidden lg:block w-full lg:w-1/3 space-y-8 sm:space-y-12 text-center lg:text-right order-2 lg:order-1">
                <div className="reveal-text hover:translate-x-2 transition-transform">
                  <h4 className="text-lg sm:text-xl font-bold uppercase font-display bg-acid-green inline-block px-1 mb-2">Total Surveillance</h4>
                  <p className="font-mono text-xs sm:text-sm leading-relaxed">
                    We sync with your email, SMS, and WhatsApp. That &quot;secret&quot; Amazon order? We saw it. Consider us the all-seeing financial eye.
                  </p>
                </div>
                <div className="reveal-text hover:translate-x-2 transition-transform">
                  <h4 className="text-lg sm:text-xl font-bold uppercase font-display bg-black text-white inline-block px-1 mb-2">Life Currency™</h4>
                  <p className="font-mono text-xs sm:text-sm leading-relaxed">
                    That ₹1,20,000 phone is <span className="border-b-2 border-black font-bold">62 days of your mortal existence</span>. We convert rupees to hours of life.
                  </p>
                </div>
              </div>

              {/* Receipt */}
              <div className="order-1 lg:order-2 animate-float relative">
                <div className="w-[260px] sm:w-[300px] bg-white drop-shadow-2xl receipt-clip pb-6 sm:pb-8 text-black font-mono text-xs sm:text-sm relative z-10 hover:rotate-2 transition-transform duration-300">
                  <div className="text-center border-b-2 border-dashed border-gray-300 p-4 sm:p-6 pb-3 sm:pb-4">
                    <div className="font-display font-black text-2xl sm:text-3xl mb-1">BILL OF SIN</div>
                    <div className="text-xs text-gray-500">DATE: TODAY • TIME: TOO LATE</div>
                    <div className="text-xs text-gray-500">ID: #BROKE-AF-2024</div>
                  </div>
                  <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                    <div className="flex justify-between">
                      <span>THIRD WAVE COFFEE</span>
                      <span className="font-bold">2 HRS LIFE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>FAST FASHION</span>
                      <span className="font-bold">3 DAYS LIFE</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>EMI TRAP</span>
                      <span className="font-bold">6 MONTHS</span>
                    </div>
                    <div className="flex justify-between text-gray-400 italic text-xs pt-2">
                      <span>Financial Freedom</span>
                      <span>₹0.00</span>
                    </div>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 mx-4 pt-3 sm:pt-4 mb-3 sm:mb-4">
                    <div className="flex justify-between text-lg sm:text-xl font-bold font-display">
                      <span>TOTAL</span>
                      <span>DEVASTATED</span>
                    </div>
                  </div>
                  <div className="mx-4 sm:mx-6 h-10 sm:h-12 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABCAYAAAD5PA/NAAAAFklEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')] bg-repeat-x bg-cover opacity-80 grayscale"></div>
                </div>
                
                <div className="absolute top-10 -right-4 w-full h-full bg-acid-green -z-10 rotate-3 border-2 border-black animate-pulse"></div>
              </div>

              {/* Right Features */}
              <div className="hidden lg:block w-full lg:w-1/3 space-y-8 sm:space-y-12 text-center lg:text-left order-3">
                <div className="reveal-text hover:-translate-x-2 transition-transform">
                  <h4 className="text-lg sm:text-xl font-bold uppercase font-display bg-black text-white inline-block px-1 mb-2">Ascetic Streaks</h4>
                  <p className="font-mono text-xs sm:text-sm leading-relaxed">
                    Track days without unnecessary spending. Gamify your self-control. Gandhi fasted for freedom. You fast for a down payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
<section className="bg-void-black py-16 sm:py-24 px-4 relative overflow-hidden grid-bg-dark border-y-2 border-white">
  <div className="max-w-6xl mx-auto relative z-10">
    <div className="text-center mb-12 sm:mb-16 reveal-text">
      <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold uppercase mb-4 text-white">
        Arsenal of <span className="text-acid-green">Truth</span>
      </h3>
      <p className="font-mono text-xs md:text-sm text-gray-400">
        Tools forged in the fires of financial discipline
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
      {/* Automatic Sync */}
      <div className="reveal-text group bg-void-black brutal-border brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 p-6 text-center cursor-pointer">
        <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-10 h-10 text-acid-green group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </div>
        <h4 className="text-lg sm:text-xl font-display font-bold uppercase mb-2 text-white group-hover:text-acid-green transition-colors">
          Auto Sync
        </h4>
        <p className="font-mono text-xs text-gray-400 leading-relaxed">
          Email crawling. Zero manual entry. Your spending secrets extracted automatically.
        </p>
      </div>

      {/* Tax Calculation */}
      <div className="reveal-text group bg-void-black brutal-border brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 p-6 text-center cursor-pointer" style={{transitionDelay: '100ms'}}>
        <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-10 h-10 text-acid-green group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" x2="12" y1="2" y2="22"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <h4 className="text-lg sm:text-xl font-display font-bold uppercase mb-2 text-white group-hover:text-acid-green transition-colors">
          Tax Math
        </h4>
        <p className="font-mono text-xs text-gray-400 leading-relaxed">
          Calculate what you owe the system. No surprises. Only brutal honesty.
        </p>
      </div>

      {/* Finance Forecasting */}
      <div className="reveal-text group bg-void-black brutal-border brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 p-6 text-center cursor-pointer" style={{transitionDelay: '200ms'}}>
        <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-10 h-10 text-acid-green group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"/>
            <path d="m19 9-5 5-4-4-3 3"/>
          </svg>
        </div>
        <h4 className="text-lg sm:text-xl font-display font-bold uppercase mb-2 text-white group-hover:text-acid-green transition-colors">
          Future Vision
        </h4>
        <p className="font-mono text-xs text-gray-400 leading-relaxed">
          AI-powered predictions. See your financial future before you ruin it.
        </p>
      </div>

      {/* Bills Management */}
      <div className="reveal-text group bg-void-black brutal-border brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 p-6 text-center cursor-pointer" style={{transitionDelay: '300ms'}}>
        <div className="w-10 h-10 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-10 h-10 text-acid-green group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
            <path d="M10 9H8"/>
            <path d="M16 13H8"/>
            <path d="M16 17H8"/>
          </svg>
        </div>
        <h4 className="text-lg sm:text-xl font-display font-bold uppercase mb-2 text-white group-hover:text-acid-green transition-colors">
          Bill Vault
        </h4>
        <p className="font-mono text-xs text-gray-400 leading-relaxed">
          Every receipt tracked. Every bill remembered. Your paper trail immortalized.
        </p>
      </div>
    </div>
  </div>
</section>


        {/* Live Roast Section */}
        <section className="bg-acid-green py-12 sm:py-20 border-y-2 border-black">
          <div className="max-w-3xl mx-auto px-4">
            <div className="bg-white brutal-border p-4 sm:p-6 md:p-8 brutal-shadow relative hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200">
              <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase animate-pulse-fast">Live Roast</div>
              
              <div className="space-y-4 sm:space-y-6 font-mono text-xs sm:text-sm">
                <div className="flex gap-2 sm:gap-3 reveal-text">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 border border-black flex items-center justify-center font-bold shrink-0">U</div>
                  <div className="bg-gray-100 p-2 sm:p-3 border border-black w-full">
                    &quot;Should I buy these limited edition sneakers? They&apos;re on sale, down from ₹12,000 to ₹8,000.&quot;
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 reveal-text" style={{transitionDelay: '150ms'}}>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black text-acid-green border border-black flex items-center justify-center font-bold shrink-0">AI</div>
                  <div className="bg-void-black text-white p-3 sm:p-4 w-full relative" style={{boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.3)'}}>
                    <p>
                      Let me translate. You earn ₹400/hour. Those sneakers cost ₹8,000. 
                      That&apos;s <span className="text-acid-green">20 hours</span> of your finite existence—2.5 full working days. 
                      <br /><br />
                      Gandhi walked 240 miles for salt. You want to spend 20 hours of life for rubber and branded canvas? 
                      The &quot;sale&quot; is a cognitive trap.
                      <br /><br />
                      <span className="italic text-gray-400">&quot;Be the change you wish to see&quot; starts with not buying things to impress people you don&apos;t like.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-void-black text-white py-20 sm:py-32 px-4 sm:px-6 text-center relative overflow-hidden grid-bg-dark">
          <div className="relative z-10 max-w-4xl mx-auto reveal-text">
            <h2 className="text-3xl sm:text-4xl md:text-7xl font-display font-black mb-6 sm:mb-8 uppercase leading-tight">
              Stop spending.<br />Start <span className="text-acid-green italic">living.</span>
            </h2>
            <p className="font-mono mb-8 sm:mb-10 text-gray-400 text-base sm:text-lg px-4">
              &quot;Live as if you were to die tomorrow. Learn as if you were to live forever.&quot;<br />
              <span className="text-xs sm:text-sm">— But maybe don&apos;t spend as if credit cards are free money.</span>
            </p>
            <Link href="/home">
              <button className="bg-acid-green text-black font-bold text-base sm:text-lg md:text-2xl px-6 sm:px-10 py-3 sm:py-5 brutal-border hover:translate-x-1 hover:translate-y-1 hover:shadow-none brutal-shadow transition-all uppercase">
                Begin The Journey
              </button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-paper-white border-t-2 border-black py-8 sm:py-10 px-4 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-center md:text-left">
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold">Gandhi.</h1>
              <p className="font-mono text-xs mt-1 text-gray-500">Non-violent resistance to consumerism.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-mono text-xs font-bold uppercase">
              <a href="#" className="hover:text-acid-green hover:underline transition-colors">Manifesto</a>
              <a href="#" className="hover:text-acid-green hover:underline transition-colors">Terms of Suffering</a>
              <a href="#" className="hover:text-acid-green hover:underline transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}