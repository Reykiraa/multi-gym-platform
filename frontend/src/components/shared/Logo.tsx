import React from 'react';
import logoImg from '../../assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: { img: 'h-7 w-7', text: 'text-lg' },
  md: { img: 'h-9 w-9', text: 'text-xl' },
  lg: { img: 'h-12 w-12', text: 'text-3xl' },
};

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  const { img, text } = sizeMap[size];
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoImg}
        alt="RoamFit Logo"
        className={`${img} object-contain flex-shrink-0`}
      />
      <span className={`font-extrabold tracking-widest text-white uppercase ${text}`}>
        ROAM<span className="text-yellow-500">FIT</span>
      </span>
    </div>
  );
};

export default Logo;
