import { apiSlice } from '../../app/api/api.slice';
import {
  CreateEmployerDto,
  Employer,
  EmployerFilters,
  UpdateEmployerDto,
} from '../../types/employer';

export const employersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Получение всех работодателей с фильтрацией
    getEmployers: builder.query<Employer[], EmployerFilters | void>({
      query: filters => {
        // Формируем строку запроса, если есть фильтры
        if (filters) {
          const queryParams = new URLSearchParams();
          for (const [key, value] of Object.entries(filters)) {
            if (value) queryParams.append(key, String(value));
          }
          return `/employers?${queryParams.toString()}`;
        }
        return '/employers';
      },
      providesTags: ['Employer'],
    }),

    // Получение работодателя по ID
    getEmployerById: builder.query<Employer, string>({
      query: id => `/employers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Employer', id }],
    }),

    // Получение работодателя по ID пользователя
    getEmployerByUserId: builder.query<Employer, string>({
      query: userId => `/employers/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Employer', id: result?.id }],
    }),

    // Создание работодателя
    createEmployer: builder.mutation<Employer, CreateEmployerDto>({
      query: employerData => ({
        url: '/employers',
        method: 'POST',
        body: employerData,
      }),
      invalidatesTags: ['Employer', 'User'],
    }),

    // Обновление работодателя
    updateEmployer: builder.mutation<Employer, { id: string; data: UpdateEmployerDto }>({
      query: ({ id, data }) => ({
        url: `/employers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employer', id }],
    }),

    // Удаление работодателя
    deleteEmployer: builder.mutation<void, string>({
      query: id => ({
        url: `/employers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employer', 'User'],
    }),

    // Получение всех работодателей по отрасли
    getEmployersByIndustry: builder.query<Employer[], string>({
      query: industry => `/employers/industry/${industry}`,
      providesTags: ['Employer'],
    }),

    // Получение статистики по работодателям
    getEmployerStatistics: builder.query<
      {
        total: number;
        byIndustry: { industry: string; count: number }[];
        byLocation: { location: string; count: number }[];
        byCompanySize: { size: string; count: number }[];
      },
      void
    >({
      query: () => '/employers/statistics',
      providesTags: ['Employer'],
    }),
  }),
});

export const {
  useGetEmployersQuery,
  useGetEmployerByIdQuery,
  useGetEmployerByUserIdQuery,
  useCreateEmployerMutation,
  useUpdateEmployerMutation,
  useDeleteEmployerMutation,
  useGetEmployersByIndustryQuery,
  useGetEmployerStatisticsQuery,
} = employersApiSlice;
