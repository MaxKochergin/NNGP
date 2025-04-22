// client/src/components/common/ThemeToggle.tsx
import { useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { IconButton, useMediaQuery } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { getTheme } from '../../theme/theme';

interface ThemeToggleProps {
  children: React.ReactNode;
}

export const ThemeToggle = ({ children }: ThemeToggleProps) => {
  // Определяем предпочтительную тему системы
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');
  
  // Создаем тему на основе текущего режима
  const theme = useMemo(() => getTheme(mode), [mode]);
  
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Кнопка переключения темы, можно разместить в хедере */}
      <IconButton onClick={toggleMode} color="inherit">
        {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      
      {children}
    </ThemeProvider>
  );
};