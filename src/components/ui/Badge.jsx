const variants = {
  default: 'bg-(--bg-glass) text-(--text-secondary) border border-(--border-default)',
  accent: 'bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.15)] text-[color:oklch(0.58_0.22_var(--accent-hue))] border border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.3)]',
  success: 'bg-green-500/15 text-green-500 border border-green-500/30',
  warning: 'bg-yellow-500/15 text-yellow-600 border border-yellow-500/30',
  error: 'bg-red-500/15 text-red-500 border border-red-500/30',
};

const sizes = {
  sm: 'px-1.5 py-0.5 text-[9px]',
  md: 'px-2.5 py-0.5 text-[10px]',
  lg: 'px-3 py-1 text-xs',
};

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  return (
    <span
      className={`inline-flex items-center justify-center font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}

export function CountBadge({ count, max = 99, variant = 'accent', className = '' }) {
  const displayCount = count > max ? `${max}+` : count;
  return (
    <Badge variant={variant} size="sm" className={`min-w-[18px] !px-1 ${className}`}>
      {displayCount}
    </Badge>
  );
}
