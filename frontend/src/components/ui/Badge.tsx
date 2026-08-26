import React, { type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * The visual style of the badge
   */
  variant?: 'warning' | 'success' | 'danger' | 'info';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'warning', className = '', ...props }) => {
  const variants = {
    warning: 'bg-yellow-500/10 text-yellow-500',
    success: 'bg-emerald-500/10 text-emerald-500',
    danger: 'bg-rose-500/10 text-rose-500',
    info: 'bg-blue-500/10 text-blue-500'
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-bold inline-flex items-center justify-center ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
