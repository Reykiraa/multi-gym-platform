// src/pages/error/ForbiddenPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';

/**
 * 403 Forbidden page — rendered when an authenticated user tries to access
 * a route outside their allowed roles.
 */
const ForbiddenPage: React.FC = () => (
  <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <ShieldOff className="w-16 h-16 text-rose-500 mx-auto mb-6" />
      <h1 className="text-4xl font-black text-white mb-3">403</h1>
      <p className="text-xl font-semibold text-zinc-300 mb-2">Akses Ditolak</p>
      <p className="text-zinc-500 mb-8">
        Anda tidak memiliki izin untuk mengakses halaman ini.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
      >
        Kembali ke Beranda
      </Link>
    </div>
  </div>
);

export default ForbiddenPage;
