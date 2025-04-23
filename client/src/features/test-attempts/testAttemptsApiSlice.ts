import { apiSlice } from '../../app/api/api.slice';
import {
  CompleteTestAttemptDto,
  CreateTestAttemptDto,
  SubmitAnswerDto,
  TestAttempt,
  UserAnswer,
} from '../../types/test';

export const testAttemptsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Получение всех попыток пользователя
    getUserTestAttempts: builder.query<TestAttempt[], string>({
      query: userId => `/users/${userId}/test-attempts`,
      providesTags: ['TestAttempt'],
    }),

    // Получение попытки по ID
    getTestAttemptById: builder.query<TestAttempt, string>({
      query: id => `/test-attempts/${id}`,
      providesTags: (result, error, id) => [{ type: 'TestAttempt', id }],
    }),

    // Получение активной попытки для теста
    getActiveTestAttempt: builder.query<TestAttempt, { userId: string; testId: string }>({
      query: ({ userId, testId }) => `/users/${userId}/tests/${testId}/active-attempt`,
      providesTags: result => [{ type: 'TestAttempt', id: result?.id }],
    }),

    // Создание новой попытки
    createTestAttempt: builder.mutation<TestAttempt, CreateTestAttemptDto>({
      query: attemptData => ({
        url: '/test-attempts',
        method: 'POST',
        body: attemptData,
      }),
      invalidatesTags: ['TestAttempt'],
    }),

    // Отправка ответа на вопрос
    submitAnswer: builder.mutation<UserAnswer, SubmitAnswerDto>({
      query: answerData => ({
        url: '/test-attempts/answers',
        method: 'POST',
        body: answerData,
      }),
      invalidatesTags: (result, error, { testAttemptId }) => [
        { type: 'TestAttempt', id: testAttemptId },
      ],
    }),

    // Завершение попытки
    completeTestAttempt: builder.mutation<TestAttempt, CompleteTestAttemptDto>({
      query: ({ testAttemptId }) => ({
        url: `/test-attempts/${testAttemptId}/complete`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { testAttemptId }) => [
        { type: 'TestAttempt', id: testAttemptId },
      ],
    }),

    // Получение результатов
    getTestResults: builder.query<{ correct: number; total: number; score: number }, string>({
      query: testAttemptId => `/test-attempts/${testAttemptId}/results`,
      providesTags: (result, error, testAttemptId) => [{ type: 'TestAttempt', id: testAttemptId }],
    }),

    // Получение ответов пользователя
    getUserAnswers: builder.query<UserAnswer[], string>({
      query: testAttemptId => `/test-attempts/${testAttemptId}/answers`,
      providesTags: (result, error, testAttemptId) => [{ type: 'TestAttempt', id: testAttemptId }],
    }),

    // Получение статистики по тестам для пользователя
    getUserTestStatistics: builder.query<
      { attempted: number; completed: number; passed: number },
      string
    >({
      query: userId => `/users/${userId}/test-statistics`,
      providesTags: ['TestAttempt'],
    }),
  }),
});

export const {
  useGetUserTestAttemptsQuery,
  useGetTestAttemptByIdQuery,
  useGetActiveTestAttemptQuery,
  useCreateTestAttemptMutation,
  useSubmitAnswerMutation,
  useCompleteTestAttemptMutation,
  useGetTestResultsQuery,
  useGetUserAnswersQuery,
  useGetUserTestStatisticsQuery,
} = testAttemptsApiSlice;
