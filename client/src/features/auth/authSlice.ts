// client/src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '../../types/auth';
import { authApiSlice } from './authApiSlice';

// Функция для проверки валидности токена (простая проверка на формат)
const isValidToken = (token: string | null): boolean => {
  if (!token) return false;

  // Проверяем, что токен имеет формат JWT (три части, разделенные точками)
  const parts = token.split('.');
  return parts.length === 3;
};

// Получаем токен из localStorage, если он есть и валиден
const storedToken = localStorage.getItem('token');
const token = isValidToken(storedToken) ? storedToken : null;

// Если токен невалиден, удаляем его из localStorage
if (!isValidToken(storedToken) && storedToken !== null) {
  console.warn('Найден невалидный токен в localStorage, удаляем его');
  localStorage.removeItem('token');
}

// Функция для определения базового маршрута по роли
const getDefaultPathByRole = (roles?: string[]): string => {
  if (!roles || roles.length === 0) return '/';

  if (roles.includes('admin')) return '/app/admin/panel';
  if (roles.includes('hr')) return '/app/hr/profile';
  if (roles.includes('employee')) return '/app/employee/profile';
  if (roles.includes('candidate')) return '/app/candidate/profile';

  return '/';
};

const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
  defaultPath: '/',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setDefaultPath: state => {
      if (!state.user || !state.user.roles) return;

      state.defaultPath = getDefaultPathByRole(state.user.roles);
    },
    // Добавляем новое действие для восстановления токена
    restoreToken: (state, action: PayloadAction<string>) => {
      if (isValidToken(action.payload)) {
        state.token = action.payload;
        state.isAuthenticated = true;
        console.log('Токен успешно восстановлен');
      } else {
        console.warn('Попытка восстановить невалидный токен');
      }
    },
  },
  // Добавляем extraReducers для обработки результатов API запросов
  extraReducers: builder => {
    // Обработка успешного логина
    builder.addMatcher(authApiSlice.endpoints.login.matchFulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      localStorage.setItem('token', action.payload.access_token);
    });

    // Обработка успешной регистрации
    builder.addMatcher(authApiSlice.endpoints.register.matchFulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      localStorage.setItem('token', action.payload.access_token);
    });

    // Обработка получения профиля
    builder.addMatcher(authApiSlice.endpoints.getProfile.matchFulfilled, (state, action) => {
      state.user = action.payload;
      // Если профиль получен успешно, но токена в state нет, восстанавливаем из localStorage
      if (!state.token) {
        const storedToken = localStorage.getItem('token');
        if (isValidToken(storedToken)) {
          state.token = storedToken;
          state.isAuthenticated = true;
        }
      }
    });
  },
});

export const { logout, setDefaultPath, restoreToken } = authSlice.actions;

export default authSlice.reducer;
