// client/src/features/auth/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from '../../types/auth';
import { authApiSlice } from './authApiSlice';

// Получаем токен из localStorage, если он есть
const token = localStorage.getItem('token');

const initialState: AuthState = {
  user: null,
  token: token,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
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

export const { logout } = authSlice.actions;

export default authSlice.reducer;
