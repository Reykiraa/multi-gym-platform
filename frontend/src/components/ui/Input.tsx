import React, { type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional label for the input field.
   */
  label?: string;
  /**
   * Error message to display below the input.
   */
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || Math.random().toString(36).substring(7);
  
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`bg-zinc-800 text-white border border-zinc-700 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 rounded-lg px-4 py-3 outline-none transition-all placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed ${
          error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-rose-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
