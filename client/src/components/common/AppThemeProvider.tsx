import { useEffect, useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setTheme } from '../../features/theme/themeSlice';
import { getTheme } from '../../theme/theme';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const dispatch = useAppDispatch();

  // Получаем режим темы из Redux store
  const { mode } = useAppSelector(state => state.theme);

  // Создаем тему на основе текущего режима
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Отслеживаем изменение системной темы
  useEffect(() => {
    // Создаем медиа-запрос для отслеживания системной темы
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Функция-обработчик изменения системной темы
    const handleChange = (e: MediaQueryListEvent) => {
      // Проверяем, сохранял ли пользователь свои настройки темы
      const savedTheme = localStorage.getItem('themeMode');

      // Если пользователь не выбирал тему явно, следуем системной теме
      if (!savedTheme) {
        dispatch(setTheme(e.matches ? 'dark' : 'light'));
      }
    };

    // Добавляем слушатель событий
    mediaQuery.addEventListener('change', handleChange);

    // Убираем слушатель при размонтировании компонента
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default AppThemeProvider;
