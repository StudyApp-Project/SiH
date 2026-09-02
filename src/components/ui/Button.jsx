import { forwardRef } from 'react';

const variants = {
  primary: 'text-white hover:opacity-90',
  secondary: 'border border-(--border-strong) hover:bg-(--bg-glass)',
  ghost: 'hover:bg-(--bg-glass)',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-(--border-default) hover:border-(--border-strong)',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3 text-sm rounded-xl gap-2',
};

export const Button = forwardRef(
  ({ children, variant = 'primary', size = 'md', loading, disabled, className, ...props }, ref) => {
    const isPrimary = variant === 'primary';
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${loading ? 'opacity-70 pointer-events-none' : ''} ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className || ''}`}
        style={isPrimary ? { background: 'oklch(0.58 0.22 var(--accent-hue))' } : {}}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
        <span>{children}</span>
      </button>
    );
  }
);
Button.displayName = 'Button';

export const IconButton = forwardRef(
  ({ children, variant = 'ghost', size = 'md', className, ...props }, ref) => {
    const sizeClasses = { sm: 'p-1.5', md: 'p-2', lg: 'p-2.5' };
    return (
      <button
        ref={ref}
        className={`rounded-lg transition-all duration-200 ${variants[variant]} ${sizeClasses[size]} ${className || ''}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';
