import { forwardRef } from 'react';
import { Search } from 'lucide-react';

export const Input = forwardRef(
  ({ className = '', icon: Icon, error, ...props }, ref) => {
    return (
      <div className="relative w-full flex flex-col gap-1">
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-3 text-(--text-muted) flex items-center justify-center pointer-events-none">
              <Icon size={16} />
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-(--bg-glass) border ${
              error ? 'border-red-500' : 'border-(--border-default) focus:border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.6)]'
            } rounded-xl px-4 py-2.5 text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none transition-colors ${
              Icon ? 'pl-10' : ''
            } ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500 pl-1">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export const SearchInput = forwardRef((props, ref) => {
  return <Input ref={ref} icon={Search} type="search" {...props} />;
});
SearchInput.displayName = 'SearchInput';

export const Textarea = forwardRef(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="relative w-full flex flex-col gap-1">
        <textarea
          ref={ref}
          className={`w-full bg-(--bg-glass) border ${
            error ? 'border-red-500' : 'border-(--border-default) focus:border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.6)]'
          } rounded-xl px-4 py-3 text-sm text-(--text-primary) placeholder:text-(--text-muted) outline-none transition-colors resize-y min-h-[80px] ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 pl-1">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
