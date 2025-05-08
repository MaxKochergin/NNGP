// client/src/features/auth/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from '../../types/auth';
import { authApiSlice } from './authApiSlice';

// Получаем токен из localStorage, если он есть
const token = localStorage.getItem('token');

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
  },
  // Добавляем extraReducers для обработки результатов API запросов
  extraReducers: builder => {
    // Обработка успешного логина
    builder.addMatcher(authApiSlice.endpoints.login.matchFulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      localStorage.setItem('token', action.payload.accessToken);
    });

    // Обработка успешной регистрации
    builder.addMatcher(authApiSlice.endpoints.register.matchFulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      localStorage.setItem('token', action.payload.accessToken);
    });

    // Обработка получения профиля
    builder.addMatcher(authApiSlice.endpoints.getProfile.matchFulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { logout, setDefaultPath } = authSlice.actions;

export default authSlice.reducer;
