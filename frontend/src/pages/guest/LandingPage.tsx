import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { ChevronRight, MapPin, Wallet, Maximize } from 'lucide-react';
import gym3 from '../../assets/gym3.jpg';
import LegalModal from '../../components/modals/LegalModal';
import Logo from '../../components/shared/Logo';

const LandingPage: React.FC = () => {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalType, setLegalType] = useState<'tos' | 'pp' | null>(null);

  const openLegalModal = (type: 'tos' | 'pp') => {
    setLegalType(type);
    setLegalModalOpen(true);
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans selection:bg-yellow-500 selection:text-black scroll-smooth">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${gym3})`, backgroundPosition: 'center top' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-zinc-950"></div>
        </div>

        {/* Header (Absolute Top) */}
        <header className="relative z-10 w-full px-6 py-5 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <Link to="/register">
              <button className="bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold px-5 py-2 rounded-full uppercase tracking-widest transition-colors">
                Join Now
              </button>
            </Link>
            <Link to="/login">
              <button className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-5 py-2 rounded-full uppercase tracking-widest transition-colors border border-zinc-700">
                Sign In
              </button>
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex-grow flex flex-col justify-center px-6 max-w-7xl mx-auto w-full pt-12 pb-20">
          
          {/* Badge */}
          <div className="bg-zinc-950/50 backdrop-blur-md border border-zinc-800 rounded-full px-3 py-1.5 flex items-center gap-3 w-fit mb-6">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-zinc-700 border-2 border-zinc-900 overflow-hidden"><img src="https://i.pravatar.cc/100?img=11" alt="user" className="w-full h-full object-cover"/></div>
              <div className="w-6 h-6 rounded-full bg-zinc-700 border-2 border-zinc-900 overflow-hidden"><img src="https://i.pravatar.cc/100?img=12" alt="user" className="w-full h-full object-cover"/></div>
              <div className="w-6 h-6 rounded-full bg-zinc-700 border-2 border-zinc-900 overflow-hidden"><img src="https://i.pravatar.cc/100?img=13" alt="user" className="w-full h-full object-cover"/></div>
            </div>
            <span className="text-yellow-500 text-[10px] font-bold tracking-widest uppercase pr-2">
              4K+ Elite<br/>Members
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase leading-[1.1] mb-6 max-w-2xl tracking-tight">
            Strong Body Starts With <span className="text-yellow-500">Smart Plan</span>
          </h1>

          {/* Description */}
          <div className="border-l-2 border-yellow-500 pl-5 mb-10 max-w-lg">
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              Access premium training facilities worldwide. Build strength, improve health, boost power, and stay fit with expert support and a flexible credit system.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-max">
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto text-sm sm:text-base py-4 px-8 uppercase tracking-widest font-bold flex items-center justify-center">
                Join Us Now <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto"
            >
              <Button variant="outline" className="w-full sm:w-auto text-sm sm:text-base py-4 px-8 uppercase tracking-widest font-bold border-yellow-500 text-yellow-500 hover:bg-yellow-500/10">
                Explore More
              </Button>
            </button>
          </div>

        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-zinc-950 px-6 py-20 border-t border-zinc-900/50">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          <div className="text-yellow-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            About Us
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white text-center uppercase leading-tight mb-16 max-w-4xl tracking-tight">
            Our Fitness Center Helps Build Strong Body, Boost Power, Improve Health, And Feel Better Daily
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Card 1 */}
            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-3xl p-8 flex flex-col items-start hover:border-yellow-500/30 transition-colors">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-white text-lg font-bold tracking-widest uppercase mb-3">Access Anywhere</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                Seamless entry to our entire network of elite training facilities across the globe with a single tap.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-3xl p-8 flex flex-col items-start hover:border-yellow-500/30 transition-colors">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Wallet className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-white text-lg font-bold tracking-widest uppercase mb-3">Pay-Per-Visit Credits</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                No locked-in contracts. Load credits and only pay for the sessions you actually attend. Transparent and flexible.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-3xl p-8 flex flex-col items-start hover:border-yellow-500/30 transition-colors">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
                <Maximize className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-white text-lg font-bold tracking-widest uppercase mb-3">Elite Infrastructure</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                Train with professional-grade equipment in environments designed for high-performance athletes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 flex flex-col items-center justify-center py-12 px-6 border-t border-zinc-900/50">
        <div className="flex items-center gap-2 mb-8">
          <Logo size="sm" />
        </div>

        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-8">
          <button onClick={() => openLegalModal('tos')} className="text-white text-xs sm:text-sm font-semibold tracking-wider uppercase hover:text-yellow-500 transition-colors underline decoration-zinc-700 underline-offset-4 bg-transparent border-none cursor-pointer">Terms of Service</button>
          <button onClick={() => openLegalModal('pp')} className="text-white text-xs sm:text-sm font-semibold tracking-wider uppercase hover:text-yellow-500 transition-colors underline decoration-zinc-700 underline-offset-4 bg-transparent border-none cursor-pointer">Privacy Policy</button>
          <a href="https://wa.me/6281315792492" target="_blank" rel="noopener noreferrer" className="text-white text-xs sm:text-sm font-semibold tracking-wider uppercase hover:text-yellow-500 transition-colors underline decoration-zinc-700 underline-offset-4">Contact Us</a>
        </div>

        <p className="text-zinc-500 text-[10px] sm:text-xs tracking-wider uppercase">
          &copy; 2024 RoamFit Platform. All rights reserved.
        </p>
      </footer>
      
      <LegalModal 
        isOpen={legalModalOpen} 
        onClose={() => setLegalModalOpen(false)} 
        type={legalType} 
      />
    </div>
  );
};

export default LandingPage;
