import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login delay
    setTimeout(() => {
      setIsLoading(false);
      navigate('/user/gyms');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-black text-white tracking-widest">GYMNOX</Link>
          <p className="text-zinc-400 mt-2">Masuk ke akun Anda</p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <Input type="email" placeholder="contoh@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <Input type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" variant="primary" className="w-full py-3 mt-2" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Login'}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Belum punya akun? <Link to="/register" className="text-yellow-500 hover:underline">Daftar sekarang</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
