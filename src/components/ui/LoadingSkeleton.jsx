export function LoadingSkeleton({ className, variant = 'default' }) {
  const variantClasses = {
    default: 'h-4 rounded-lg',
    avatar: 'w-10 h-10 rounded-full',
    text: 'h-3 rounded',
  };

  return (
    <div className={`animate-pulse bg-(--bg-glass) ${variantClasses[variant]} ${className || ''}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl border border-(--border-default)" style={{ background: 'var(--bg-surface)' }}>
      <LoadingSkeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton variant="text" className="w-3/4" />
        <LoadingSkeleton variant="text" className="w-1/2" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <LoadingSkeleton variant="avatar" className="w-8 h-8" />
          <div className="flex-1 space-y-1.5">
            <LoadingSkeleton variant="text" className="w-2/3" />
            <LoadingSkeleton variant="text" className="w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
