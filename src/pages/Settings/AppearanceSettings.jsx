import { useTheme } from '../../contexts/ThemeContext';
import { Monitor, Moon, Sun, Check } from 'lucide-react';

const THEMES = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

const ACCENTS = [
  { id: 'violet', label: 'Violet', color: 'oklch(0.58 0.22 285)' },
  { id: 'purple', label: 'Purple', color: 'oklch(0.55 0.22 305)' },
  { id: 'pink', label: 'Pink', color: 'oklch(0.60 0.22 340)' },
  { id: 'red', label: 'Red', color: 'oklch(0.60 0.20 20)' },
  { id: 'orange', label: 'Orange', color: 'oklch(0.65 0.18 45)' },
  { id: 'emerald', label: 'Emerald', color: 'oklch(0.65 0.15 150)' },
  { id: 'green', label: 'Green', color: 'oklch(0.65 0.15 130)' },
  { id: 'cyan', label: 'Cyan', color: 'oklch(0.65 0.12 195)' },
  { id: 'blue', label: 'Blue', color: 'oklch(0.60 0.18 250)' },
];

export default function AppearanceSettings() {
  const { theme, setTheme, accent, setAccent } = useTheme();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold text-(--text-primary)">Appearance</h2>
        <p className="text-sm text-(--text-secondary) mt-1">
          Customize how EduWrap looks on your device.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <section className="bg-(--bg-glass) backdrop-blur-md rounded-2xl border border-(--border-default) p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-(--text-primary) mb-4">Theme Preference</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {THEMES.map((t) => {
              const Icon = t.icon;
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={(e) => setTheme(t.id, e)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                    isActive
                      ? 'border-[color:oklch(0.58_0.22_var(--accent-hue))] bg-[color:oklch(0.58_0.22_var(--accent-hue)_/_0.05)] shadow-(--shadow-glow)'
                      : 'border-(--border-default) hover:border-(--text-muted) hover:bg-(--bg-elevated)'
                  }`}
                >
                  <Icon size={24} className={`mb-2 ${isActive ? 'text-[color:oklch(0.58_0.22_var(--accent-hue))]' : 'text-(--text-secondary)'}`} />
                  <span className={`text-sm font-medium ${isActive ? 'text-[color:oklch(0.58_0.22_var(--accent-hue))]' : 'text-(--text-primary)'}`}>
                    {t.label}
                  </span>
                  
                  {isActive && (
                    <div className="absolute top-2 right-2 text-[color:oklch(0.58_0.22_var(--accent-hue))]">
                      <Check size={16} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Accent Color Selection */}
        <section className="bg-(--bg-glass) backdrop-blur-md rounded-2xl border border-(--border-default) p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-(--text-primary) mb-4">Accent Color</h3>
          <p className="text-xs text-(--text-muted) mb-4">
            Choose a primary color for buttons, active states, and focus rings.
          </p>
          <div className="flex flex-wrap gap-4">
            {ACCENTS.map((a) => {
              const isActive = accent === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setAccent(a.id)}
                  className={`w-12 h-12 rounded-full relative transition-transform duration-200 hover:scale-110 flex items-center justify-center shadow-md ${isActive ? 'ring-4 ring-offset-2 ring-offset-(--bg-base) ring-[color:oklch(0.58_0.22_var(--accent-hue))]' : ''}`}
                  style={{ backgroundColor: a.color }}
                  aria-label={`Select ${a.label} accent color`}
                  title={a.label}
                >
                  {isActive && <Check size={20} className="text-white drop-shadow-md" />}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
