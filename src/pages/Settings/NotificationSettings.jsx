import { useState } from 'react';

const NOTIFICATION_OPTIONS = [
  { id: 'email_updates', label: 'Email Updates', description: 'Receive emails about new features and updates.' },
  { id: 'study_reminders', label: 'Study Reminders', description: 'Get notified when a scheduled study session is about to start.' },
  { id: 'group_messages', label: 'Group Messages', description: 'Receive notifications for new messages in your study rooms.' },
  { id: 'marketing', label: 'Marketing Emails', description: 'Receive promotional emails and offers.' },
];

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState({
    email_updates: true,
    study_reminders: true,
    group_messages: false,
    marketing: false,
  });

  const togglePreference = (id) => {
    setPreferences(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-(--text-primary)">Notifications</h2>
        <p className="text-sm text-(--text-secondary) mt-1">
          Control how and when we send you notifications.
        </p>
      </div>

      <div className="bg-(--bg-glass) backdrop-blur-md rounded-2xl border border-(--border-default) overflow-hidden shadow-sm divide-y divide-(--border-default)">
        {NOTIFICATION_OPTIONS.map((option) => {
          const isEnabled = preferences[option.id];
          return (
            <div key={option.id} className="p-6 flex items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-(--text-primary)">{option.label}</h3>
                <p className="text-xs text-(--text-muted) mt-1">{option.description}</p>
              </div>
              
              <button
                role="switch"
                aria-checked={isEnabled}
                onClick={() => togglePreference(option.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[color:oklch(0.58_0.22_var(--accent-hue))] focus:ring-offset-2 focus:ring-offset-(--bg-base) ${
                  isEnabled ? 'bg-[color:oklch(0.58_0.22_var(--accent-hue))]' : 'bg-(--border-default)'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    isEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
