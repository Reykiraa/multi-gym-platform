// src/components/forms/PinInput.tsx
import React, { useRef, useCallback } from 'react';

interface PinInputProps {
  value: string;
  onChange: (pin: string) => void;
  disabled?: boolean;
  error?: string;
}

const PIN_LENGTH = 4;

const PinInput: React.FC<PinInputProps> = ({ value, onChange, disabled = false, error }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Always produce exactly PIN_LENGTH entries
  const digits = Array.from({ length: PIN_LENGTH }, (_, i) => value[i] ?? '');

  const focusInput = useCallback((index: number) => {
    if (index >= 0 && index < PIN_LENGTH) {
      inputRefs.current[index]?.focus();
    }
  }, []);

  const handleChange = useCallback(
    (index: number, inputValue: string) => {
      const digit = inputValue.replace(/\D/g, '').slice(-1);
      if (!digit && inputValue !== '') return;

      const newDigits = [...digits];
      newDigits[index] = digit;
      onChange(newDigits.join(''));

      if (digit && index < PIN_LENGTH - 1) focusInput(index + 1);
    },
    [digits, onChange, focusInput],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (digits[index] === '' && index > 0) {
          const newDigits = [...digits];
          newDigits[index - 1] = '';
          onChange(newDigits.join(''));
          focusInput(index - 1);
        } else {
          const newDigits = [...digits];
          newDigits[index] = '';
          onChange(newDigits.join(''));
        }
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') focusInput(index - 1);
      if (e.key === 'ArrowRight') focusInput(index + 1);
    },
    [digits, onChange, focusInput],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH);
      if (pasted.length > 0) {
        onChange(pasted.slice(0, PIN_LENGTH));
        focusInput(Math.min(pasted.length, PIN_LENGTH - 1));
      }
    },
    [onChange, focusInput],
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2 sm:gap-4">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit === ' ' ? '' : digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={`
              w-12 h-16 sm:w-20 sm:h-24 text-center text-2xl sm:text-4xl font-black font-mono
              bg-zinc-800 border-2 rounded-xl text-white caret-yellow-500
              outline-none transition-all duration-200
              focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 focus:bg-zinc-750
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-rose-500' : 'border-zinc-700'}
            `}
            aria-label={`PIN digit ${index + 1}`}
            autoComplete="off"
          />
        ))}
      </div>
      {error && <span className="text-sm text-rose-500 font-medium">{error}</span>}
    </div>
  );
};

export default PinInput;
