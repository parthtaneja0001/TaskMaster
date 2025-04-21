import React from 'react';
import { Moon, Sun } from 'lucide-react';
import useThemeStore from '../../store/themeStore';
import IconButton from '../ui/IconButton';

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useThemeStore();

  // Update body class when theme changes
  React.useEffect(() => {
    const root = window.document.documentElement;
    
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  return (
    <IconButton
      variant="ghost"
      size="md"
      shape="circle"
      icon={mode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      tooltip={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
    />
  );
};

export default ThemeToggle;