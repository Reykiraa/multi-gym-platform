import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Badge from '../ui/Badge';
import { type User } from '../../types';

const fetchUser = async (): Promise<User> => {
  // Mock API call
  return {
    id: 1,
    name: "Budi",
    email: "budi@email.com",
    role: "user",
    credit_balance: 50
  };
};

const Navbar: React.FC = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  return (
    <nav className="flex items-center justify-between py-4 border-b border-zinc-800 mb-6">
      <div className="text-xl font-bold text-white tracking-wider">
        GYMNOX
      </div>
      <div>
        <Badge variant="warning" className="text-sm px-3 py-1.5">
          {isLoading ? 'Memuat...' : `Saldo: ${user?.credit_balance ?? 0}`}
        </Badge>
      </div>
    </nav>
  );
};

export default Navbar;
