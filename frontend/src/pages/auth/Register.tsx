import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock register delay
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
          <p className="text-zinc-400 mt-2">Daftar akun baru</p>
        </div>

        <Card className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nama Lengkap</label>
              <Input type="text" placeholder="Budi Santoso" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <Input type="email" placeholder="contoh@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <Input type="password" placeholder="••••••••" required />
            </div>
            
            <div className="flex items-start gap-2 mt-2">
              <input type="checkbox" id="terms" className="mt-1 rounded bg-zinc-800 border-zinc-700 text-yellow-500 focus:ring-yellow-500" required />
              <label htmlFor="terms" className="text-sm text-zinc-400">
                Saya setuju dengan <a href="#" className="text-yellow-500 hover:underline">Syarat & Ketentuan</a> serta Kebijakan Privasi.
              </label>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3 mt-4" disabled={isLoading}>
              {isLoading ? 'Memproses...' : 'Buat Akun'}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Sudah punya akun? <Link to="/login" className="text-yellow-500 hover:underline">Login di sini</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Register;
