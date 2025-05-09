// client/src/app/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Функция для проверки валидности токена
const isValidToken = (token: string | null): boolean => {
  if (!token) return false;

  // Проверяем, что токен имеет формат JWT (три части, разделенные точками)
  const parts = token.split('.');
  return parts.length === 3;
};

// Получаем базовый URL из переменных окружения или используем значение по умолчанию
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
console.log('API базовый URL:', baseUrl);

// Базовая конфигурация API
export const apiSlice = createApi({
  reducerPath: 'api', // уникальное имя для reducer path
  baseQuery: fetchBaseQuery({
    baseUrl, // Базовый URL для API

    // Подготовка headers для авторизованных запросов
    prepareHeaders: (headers, { getState }) => {
      // Получаем токен из состояния Redux
      let token = (getState() as RootState).auth.token;

      // Debug: Проверяем токен
      console.log('prepareHeaders - Token from Redux:', token);

      // Если в Redux нет токена, проверяем localStorage
      if (!token) {
        const storedToken = localStorage.getItem('token');
        console.log('prepareHeaders - Token from localStorage:', storedToken);

        // Проверяем валидность токена из localStorage
        if (isValidToken(storedToken)) {
          token = storedToken;
          console.log('prepareHeaders - Using token from localStorage instead');
        }
      }

      // Если токен существует, добавляем его в заголовки
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
        console.log('prepareHeaders - Setting Authorization header:', `Bearer ${token}`);
      } else {
        console.log('prepareHeaders - No token available');
      }

      return headers;
    },
  }),
  // Определяем тэги для инвалидации кэша
  tagTypes: [
    'User',
    'Profile',
    'Test',
    'Question',
    'TestAttempt',
    'Skill',
    'Specialization',
    'LearningMaterial',
    'Role',
    'HR',
    'Employer',
    'Candidate',
    'Admin',
  ],
  // Здесь будут определены endpoints
  endpoints: builder => ({}),
});

// Применяем middleware для хранения данных в localStorage (кэширование)
// Это поможет сохранять состояние между перезагрузками страницы
export const apiMiddleware = apiSlice.middleware;

// Экспорт пустых генерированных хуков для дальнейшего расширения
// export const {} = apiSlice;
