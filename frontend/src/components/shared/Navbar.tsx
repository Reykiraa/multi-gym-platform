import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, User as UserIcon } from 'lucide-react';
import Badge from '../ui/Badge';
import { type User } from '../../types';

const fetchUser = async (): Promise<User> => {
  return {
    id: 1,
    name: "Budi",
    email: "budi@email.com",
    role: "user",
    credit_balance: 50
  };
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  const getMenuClass = (path: string) => {
    return location.pathname.includes(path) 
      ? 'text-yellow-500 flex flex-col items-center gap-1' 
      : 'text-zinc-500 hover:text-zinc-300 transition-colors flex flex-col items-center gap-1';
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
              <Link to="/user/gyms" className={location.pathname.includes('gym') ? 'text-yellow-500' : 'text-zinc-400 hover:text-white'}>Explore</Link>
              <Link to="/user/wallet" className="text-zinc-400 hover:text-white">Wallet</Link>
              <Link to="/user/profile" className="text-zinc-400 hover:text-white">Profile</Link>
            </div>
            <Badge variant="warning" className="text-sm px-3 py-1.5">
              {isLoading ? 'Memuat...' : `Saldo: ${user?.credit_balance ?? 0}`}
            </Badge>
          </div>

          {/* Mobile Balance (Optional: Can keep it in top nav for mobile too) */}
          <div className="md:hidden">
            <Badge variant="warning" className="text-xs px-2 py-1">
              {isLoading ? '...' : `${user?.credit_balance ?? 0} CR`}
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
