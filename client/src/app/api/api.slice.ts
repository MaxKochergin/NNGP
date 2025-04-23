// client/src/app/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Базовая конфигурация API
export const apiSlice = createApi({
  reducerPath: 'api', // уникальное имя для reducer path
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Базовый URL для API (может быть изменен в зависимости от окружения)

    // Подготовка headers для авторизованных запросов
    prepareHeaders: (headers, { getState }) => {
      // Получаем токен из состояния Redux
      const token = (getState() as RootState).auth.token;

      // Если токен существует, добавляем его в заголовки
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
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

// Экспорт пустых генерированных хуков для дальнейшего расширения
// export const {} = apiSlice;
