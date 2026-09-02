import { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('ew_theme') || 'system';
  });

  const [accent, setAccentState] = useState(() => {
    return localStorage.getItem('ew_accent') || 'violet';
  });

  // Handle accent change
  useEffect(() => {
    localStorage.setItem('ew_accent', accent);
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  const applyThemeToDOM = (t) => {
    const root = document.documentElement;
    if (t === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', t);
    }
  };

  // Handle theme change (fallback for initialization and external state changes)
  useEffect(() => {
    localStorage.setItem('ew_theme', theme);
    applyThemeToDOM(theme);
  }, [theme]);

  // Watch for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      if (theme === 'system') {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme, event = null) => {
    // If no view transition API or no event passed, just update state normally
    if (!document.startViewTransition || !event) {
      setThemeState(newTheme);
      return;
    }

    // Get click position for the ripple center
    const x = event.clientX ?? innerWidth / 2;
    const y = event.clientY ?? innerHeight / 2;
    
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setThemeState(newTheme);
      });
      applyThemeToDOM(newTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ]
        },
        {
          duration: 500,
          easing: 'ease-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  const setAccent = (newAccent) => {
    setAccentState(newAccent);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
