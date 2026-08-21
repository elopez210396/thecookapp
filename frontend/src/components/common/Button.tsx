import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'success';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:text-gray-400',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  success: 'bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300',
};

export default function Button({ variant = 'primary', className = '', disabled, children, ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
