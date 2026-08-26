import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="container mx-auto max-w-7xl px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-black text-white tracking-widest">GYMNOX</div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="outline" className="px-6">Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 container mx-auto max-w-4xl py-12">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 uppercase tracking-tight">
          Elite Training <span className="text-yellow-500">Access</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Platform akses multi-gym pertama. Pay-per-visit, tanpa ikatan kontrak bulanan. Olahraga di mana saja, kapan saja.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link to="/register" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto text-lg py-4 px-10">
              Join Now
            </Button>
          </Link>
          <Link to="/login" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto text-lg py-4 px-10">
              Member Login
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-zinc-900 text-zinc-600">
        &copy; 2026 Gymnox Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
