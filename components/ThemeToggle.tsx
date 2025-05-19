import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const cycleTheme = () => {
    switch (theme) {
      case 'dark':
        setTheme('system');
        break;
      case 'system':
        setTheme('light');
        break;
      default:
        setTheme('dark');
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={cycleTheme}>
      {theme === 'light' && <Sun className="size-4" />}
      {theme === 'dark' && <Moon className="size-4" />}
      {theme === 'system' && <Monitor className="size-4" />}
    </Button>
  );
}
