import { forwardRef } from 'react';

const depthStyles = {
  flat: 'bg-transparent border-none',
  default: 'bg-(--bg-surface) border border-(--border-default) shadow-(--shadow-sm)',
  elevated: 'bg-(--bg-elevated) border border-(--border-strong) shadow-(--shadow-md)',
  glass: 'bg-(--bg-glass) border border-(--border-default) backdrop-blur-md shadow-(--shadow-sm)',
};

export const Card = forwardRef(
  ({ children, className = '', depth = 'default', interactive = false, ...props }, ref) => {
    const baseStyle = depthStyles[depth] || depthStyles.default;
    const interactStyle = interactive
      ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-lg) hover:border-(--border-strong) cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={`rounded-2xl ${baseStyle} ${interactStyle} overflow-hidden ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-5 py-4 border-b border-(--border-default) ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`px-5 py-4 border-t border-(--border-default) bg-(--bg-base)/30 ${className}`}>
    {children}
  </div>
);
