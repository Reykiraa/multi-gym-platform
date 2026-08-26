import React, { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant of the button to determine its styling.
   */
  variant?: 'primary' | 'outline' | 'danger';
  /**
   * If true, displays a loading spinner and disables the button.
   */
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none rounded-xl py-3 px-4';
  
  const variants = {
    primary: 'bg-yellow-500 text-black font-bold hover:bg-yellow-400 focus:ring-yellow-500',
    outline: 'border border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 focus:ring-yellow-500',
    danger: 'bg-rose-500 text-white font-bold hover:bg-rose-600 focus:ring-rose-500',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
