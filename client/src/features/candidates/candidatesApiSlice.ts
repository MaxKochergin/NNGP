import { apiSlice } from '../../app/api/api.slice';
import {
  Candidate,
  CandidateFilters,
  CreateCandidateDto,
  MatchCandidateResult,
  UpdateCandidateDto,
} from '../../types/candidate';

export const candidatesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Получение всех кандидатов с фильтрацией
    getCandidates: builder.query<Candidate[], CandidateFilters | void>({
      query: filters => {
        // Формируем строку запроса, если есть фильтры
        if (filters) {
          const queryParams = new URLSearchParams();
          for (const [key, value] of Object.entries(filters)) {
            if (value) {
              if (Array.isArray(value)) {
                value.forEach(v => queryParams.append(`${key}[]`, v));
              } else {
                queryParams.append(key, String(value));
              }
            }
          }
          return `/candidates?${queryParams.toString()}`;
        }
        return '/candidates';
      },
      providesTags: ['Candidate'],
    }),

    // Получение кандидата по ID
    getCandidateById: builder.query<Candidate, string>({
      query: id => `/candidates/${id}`,
      providesTags: (result, error, id) => [{ type: 'Candidate', id }],
    }),

    // Получение кандидата по ID пользователя
    getCandidateByUserId: builder.query<Candidate, string>({
      query: userId => `/candidates/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Candidate', id: result?.id }],
    }),

    // Создание кандидата
    createCandidate: builder.mutation<Candidate, CreateCandidateDto>({
      query: candidateData => ({
        url: '/candidates',
        method: 'POST',
        body: candidateData,
      }),
      invalidatesTags: ['Candidate', 'User'],
    }),

    // Обновление кандидата
    updateCandidate: builder.mutation<Candidate, { id: string; data: UpdateCandidateDto }>({
      query: ({ id, data }) => ({
        url: `/candidates/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Candidate', id }],
    }),

    // Удаление кандидата
    deleteCandidate: builder.mutation<void, string>({
      query: id => ({
        url: `/candidates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Candidate', 'User'],
    }),

    // Загрузка резюме
    uploadResume: builder.mutation<{ resumeUrl: string }, { candidateId: string; file: File }>({
      query: ({ candidateId, file }) => {
        const formData = new FormData();
        formData.append('resume', file);

        return {
          url: `/candidates/${candidateId}/resume`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { candidateId }) => [{ type: 'Candidate', id: candidateId }],
    }),

    // Удаление резюме
    deleteResume: builder.mutation<void, string>({
      query: candidateId => ({
        url: `/candidates/${candidateId}/resume`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, candidateId) => [{ type: 'Candidate', id: candidateId }],
    }),

    // Поиск подходящих кандидатов по компетенциям и специализации
    matchCandidates: builder.query<
      MatchCandidateResult[],
      { skills: string[]; specializationId: string }
    >({
      query: ({ skills, specializationId }) => {
        const queryParams = new URLSearchParams();
        skills.forEach(skill => queryParams.append('skills[]', skill));
        queryParams.append('specializationId', specializationId);

        return `/candidates/match?${queryParams.toString()}`;
      },
      providesTags: ['Candidate'],
    }),

    // Получение статистики кандидатов
    getCandidateStatistics: builder.query<
      {
        total: number;
        bySpecialization: { specialization: string; count: number }[];
        byStatus: { status: string; count: number }[];
        byLocation: { location: string; count: number }[];
      },
      void
    >({
      query: () => '/candidates/statistics',
      providesTags: ['Candidate'],
    }),
  }),
});

export const {
  useGetCandidatesQuery,
  useGetCandidateByIdQuery,
  useGetCandidateByUserIdQuery,
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
  useDeleteCandidateMutation,
  useUploadResumeMutation,
  useDeleteResumeMutation,
  useMatchCandidatesQuery,
  useGetCandidateStatisticsQuery,
} = candidatesApiSlice;
