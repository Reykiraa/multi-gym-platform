import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, User as UserIcon } from 'lucide-react';
import Badge from '../ui/Badge';
import { useAuthStore } from '../../store/authStore';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const getMenuClass = (path: string) => {
    return location.pathname.includes(path) 
      ? 'text-yellow-500 flex flex-col items-center gap-1' 
      : 'text-zinc-500 hover:text-zinc-300 transition-colors flex flex-col items-center gap-1';
  };

  const getDesktopMenuClass = (path: string) => {
    return location.pathname.includes(path)
      ? 'text-yellow-500'
      : 'text-zinc-400 hover:text-white transition-colors';
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full border-b border-zinc-800 bg-zinc-950 sticky top-0 z-50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/user/gyms" className="text-xl font-bold text-white tracking-wider">
            GYMNOX
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6 text-sm font-medium">
              <Link to="/user/gyms" className={getDesktopMenuClass('/user/gym')}>Explore</Link>
              <Link to="/user/wallet" className={getDesktopMenuClass('/user/wallet')}>Wallet</Link>
              <Link to="/user/profile" className={getDesktopMenuClass('/user/profile')}>Profile</Link>
            </div>
            <Badge variant="warning" className="text-sm px-3 py-1.5">
              Saldo: {user?.credit_balance ?? 0}
            </Badge>
          </div>

          {/* Mobile Balance */}
          <div className="md:hidden">
            <Badge variant="warning" className="text-xs px-2 py-1">
              {user?.credit_balance ?? 0} CR
            </Badge>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 pb-safe z-50">
        <div className="flex justify-around items-center p-3">
          <Link to="/user/gyms" className={getMenuClass('/user/gym')}>
            <Home size={24} />
            <span className="text-[10px] font-medium">Explore</span>
          </Link>
          <Link to="/user/wallet" className={getMenuClass('/user/wallet')}>
            <Wallet size={24} />
            <span className="text-[10px] font-medium">Wallet</span>
          </Link>
          <Link to="/user/profile" className={getMenuClass('/user/profile')}>
            <UserIcon size={24} />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
