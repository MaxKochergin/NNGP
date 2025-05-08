import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Определяем тип темы
export type ThemeMode = 'light' | 'dark';

// Структура состояния темы
interface ThemeState {
  mode: ThemeMode;
}

// Получаем сохраненную тему из localStorage или используем системные предпочтения
const getSavedTheme = (): ThemeMode => {
  const savedTheme = localStorage.getItem('themeMode');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  // Если тема не сохранена, проверяем системные предпочтения
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light'; // По умолчанию светлая тема
};

// Начальное состояние
const initialState: ThemeState = {
  mode: getSavedTheme(),
};

// Создаем slice
export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Переключение темы между светлой и темной
    toggleTheme: state => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.mode);
    },
    // Установка конкретной темы
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      localStorage.setItem('themeMode', state.mode);
    },
  },
});

// Экспортируем экшены и редьюсер
export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
