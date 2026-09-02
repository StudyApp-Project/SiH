import { useState } from 'react';
import { motion } from 'framer-motion';

export function Tabs({ tabs, defaultTab, onChange, className = '' }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (onChange) onChange(id);
  };

  return (
    <div className={`flex items-center gap-1 p-1 bg-(--bg-glass) border border-(--border-default) rounded-xl overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap z-10 ${
              isActive ? 'text-[color:oklch(0.58_0.22_var(--accent-hue))]' : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface)'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 rounded-lg bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.1)] border border-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.2)] -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            {tab.icon && <tab.icon size={16} />}
            {tab.label}
            {tab.badge && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue))] text-white' : 'bg-(--bg-elevated) text-(--text-muted)'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
