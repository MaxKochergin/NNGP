import { apiSlice } from '../../app/api/api.slice';
import {
  AnswerOption,
  AssignTestToSpecializationDto,
  CreateAnswerOptionDto,
  CreateQuestionDto,
  CreateTestDto,
  Question,
  SpecializationTest,
  Test,
  UpdateAnswerOptionDto,
  UpdateQuestionDto,
  UpdateTestDto,
} from '../../types/test';

export const testsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Тесты
    getTests: builder.query<Test[], void>({
      query: () => '/tests',
      providesTags: ['Test'],
    }),

    getTestById: builder.query<Test, string>({
      query: id => `/tests/${id}`,
      providesTags: (result, error, id) => [{ type: 'Test', id }],
    }),

    createTest: builder.mutation<Test, CreateTestDto>({
      query: testData => ({
        url: '/tests',
        method: 'POST',
        body: testData,
      }),
      invalidatesTags: ['Test'],
    }),

    updateTest: builder.mutation<Test, { id: string; data: UpdateTestDto }>({
      query: ({ id, data }) => ({
        url: `/tests/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Test', id }],
    }),

    deleteTest: builder.mutation<void, string>({
      query: id => ({
        url: `/tests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Test'],
    }),

    // Получение тестов по специализации
    getTestsBySpecialization: builder.query<Test[], string>({
      query: specializationId => `/specializations/${specializationId}/tests`,
      providesTags: ['Test', 'Specialization'],
    }),

    // Получение тестов, созданных пользователем
    getUserCreatedTests: builder.query<Test[], string>({
      query: userId => `/users/${userId}/created-tests`,
      providesTags: ['Test'],
    }),

    // Вопросы
    getQuestions: builder.query<Question[], string>({
      query: testId => `/tests/${testId}/questions`,
      providesTags: (result, error, testId) => [
        { type: 'Test', id: testId },
        ...(result?.map(q => ({ type: 'Question' as const, id: q.id })) || []),
      ],
    }),

    getQuestionById: builder.query<Question, string>({
      query: id => `/questions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Question', id }],
    }),

    createQuestion: builder.mutation<Question, CreateQuestionDto>({
      query: questionData => ({
        url: '/questions',
        method: 'POST',
        body: questionData,
      }),
      invalidatesTags: (result, error, { testId }) => [{ type: 'Test', id: testId }, 'Question'],
    }),

    updateQuestion: builder.mutation<Question, { id: string; data: UpdateQuestionDto }>({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Question', id }],
    }),

    deleteQuestion: builder.mutation<void, string>({
      query: id => ({
        url: `/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question', 'Test'],
    }),

    // Варианты ответов
    getAnswerOptions: builder.query<AnswerOption[], string>({
      query: questionId => `/questions/${questionId}/options`,
      providesTags: (result, error, questionId) => [{ type: 'Question', id: questionId }],
    }),

    createAnswerOption: builder.mutation<AnswerOption, CreateAnswerOptionDto>({
      query: optionData => ({
        url: '/questions/options',
        method: 'POST',
        body: optionData,
      }),
      invalidatesTags: (result, error, { questionId }) => [{ type: 'Question', id: questionId }],
    }),

    updateAnswerOption: builder.mutation<AnswerOption, { id: string; data: UpdateAnswerOptionDto }>(
      {
        query: ({ id, data }) => ({
          url: `/questions/options/${id}`,
          method: 'PATCH',
          body: data,
        }),
        invalidatesTags: ['Question'],
      }
    ),

    deleteAnswerOption: builder.mutation<void, string>({
      query: id => ({
        url: `/questions/options/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),

    // Связь тестов и специализаций
    assignTestToSpecialization: builder.mutation<SpecializationTest, AssignTestToSpecializationDto>(
      {
        query: data => ({
          url: '/specializations/tests',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Test', 'Specialization'],
      }
    ),

    removeTestFromSpecialization: builder.mutation<void, string>({
      query: id => ({
        url: `/specializations/tests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Test', 'Specialization'],
    }),
  }),
});

export const {
  // Тесты
  useGetTestsQuery,
  useGetTestByIdQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
  useDeleteTestMutation,
  useGetTestsBySpecializationQuery,
  useGetUserCreatedTestsQuery,
  // Вопросы
  useGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  // Варианты ответов
  useGetAnswerOptionsQuery,
  useCreateAnswerOptionMutation,
  useUpdateAnswerOptionMutation,
  useDeleteAnswerOptionMutation,
  // Связь тестов и специализаций
  useAssignTestToSpecializationMutation,
  useRemoveTestFromSpecializationMutation,
} = testsApiSlice;
