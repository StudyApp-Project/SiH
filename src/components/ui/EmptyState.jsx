import { Inbox } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({ 
  icon: Icon = Inbox, 
  title = 'No items found', 
  description = 'There is nothing to display here right now.', 
  actionLabel, 
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-(--bg-glass) border border-(--border-default) rounded-2xl ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-(--bg-surface) border border-(--border-strong) flex items-center justify-center mb-4 text-(--text-muted)">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-semibold text-(--text-primary) mb-1" style={{ fontFamily: 'var(--font-display)' }}>
        {title}
      </h3>
      <p className="text-sm text-(--text-secondary) max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
