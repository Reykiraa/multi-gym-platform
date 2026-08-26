import React, { useState, useEffect } from 'react';

interface PinDisplayProps {
  pinCode: string;
  expiresAt: string;
}

const PinDisplay: React.FC<PinDisplayProps> = ({ pinCode, expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const targetTime = new Date(expiresAt).getTime();
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;
      
      if (difference <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        return false; // stop interval
      }
      
      setTimeLeft(Math.floor(difference / 1000));
      return true; // continue interval
    };

    // Initial check
    if (!calculateTimeLeft()) return;

    const timerId = setInterval(() => {
      const shouldContinue = calculateTimeLeft();
      if (!shouldContinue) clearInterval(timerId);
    }, 1000);

    return () => clearInterval(timerId);
  }, [expiresAt]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow py-20 px-4 w-full">
      <h2 className="text-xl text-zinc-400 mb-6 font-medium text-center">
        {isExpired ? 'PIN Kedaluwarsa' : 'PIN Akses Anda'}
      </h2>
      <div className={`border p-8 rounded-3xl shadow-2xl mb-8 w-full max-w-sm flex justify-center items-center transition-colors duration-500 ${isExpired ? 'bg-zinc-900 border-rose-500/30' : 'bg-zinc-900 border-yellow-500/30'}`}>
        <span className={`text-6xl font-mono tracking-widest text-center transition-colors duration-500 ${isExpired ? 'text-rose-500 opacity-50' : 'text-yellow-500 animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]'}`}>
          {pinCode}
        </span>
      </div>
      
      {isExpired ? (
        <p className="text-lg font-bold text-rose-500 text-center uppercase tracking-wider">PIN KEDALUWARSA</p>
      ) : (
        <p className="text-lg font-mono text-yellow-500 text-center mb-2">
          Berlaku selama: {formatTime(timeLeft)} menit
        </p>
      )}
      
      {!isExpired && (
        <p className="text-sm text-zinc-500 text-center mt-4">
          Tunjukkan PIN ini ke resepsionis atau scan pada mesin pintu otomatis.
        </p>
      )}
    </div>
  );
};

export default PinDisplay;
