import React from 'react';

interface PinDisplayProps {
  pinCode: string;
}

const PinDisplay: React.FC<PinDisplayProps> = ({ pinCode }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow py-20 px-4">
      <h2 className="text-xl text-zinc-400 mb-6 font-medium text-center">PIN Akses Anda</h2>
      <div className="bg-zinc-900 border border-yellow-500/30 p-8 rounded-3xl shadow-2xl mb-8 w-full max-w-sm flex justify-center items-center">
        <span className="text-6xl font-mono tracking-widest text-yellow-500 text-center animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
          {pinCode}
        </span>
      </div>
      <p className="text-sm text-zinc-500 text-center">Tunjukkan PIN ini ke resepsionis atau scan pada mesin pintu otomatis.</p>
    </div>
  );
};

export default PinDisplay;
