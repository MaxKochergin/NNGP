import { apiSlice } from '../../app/api/api.slice';
import { CreateHRDto, HR, HRFilters, UpdateHRDto } from '../../types/hr';

export const hrApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Получение всех HR с фильтрацией
    getHRs: builder.query<HR[], HRFilters | void>({
      query: filters => {
        // Формируем строку запроса, если есть фильтры
        if (filters) {
          const queryParams = new URLSearchParams();
          for (const [key, value] of Object.entries(filters)) {
            if (value) queryParams.append(key, String(value));
          }
          return `/hr?${queryParams.toString()}`;
        }
        return '/hr';
      },
      providesTags: ['HR'],
    }),

    // Получение HR по ID
    getHRById: builder.query<HR, string>({
      query: id => `/hr/${id}`,
      providesTags: (result, error, id) => [{ type: 'HR', id }],
    }),

    // Получение HR по ID пользователя
    getHRByUserId: builder.query<HR, string>({
      query: userId => `/hr/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'HR', id: result?.id }],
    }),

    // Создание HR
    createHR: builder.mutation<HR, CreateHRDto>({
      query: hrData => ({
        url: '/hr',
        method: 'POST',
        body: hrData,
      }),
      invalidatesTags: ['HR', 'User'],
    }),

    // Обновление HR
    updateHR: builder.mutation<HR, { id: string; data: UpdateHRDto }>({
      query: ({ id, data }) => ({
        url: `/hr/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'HR', id }],
    }),

    // Удаление HR
    deleteHR: builder.mutation<void, string>({
      query: id => ({
        url: `/hr/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HR', 'User'],
    }),

    // Получение статистики для аналитики по HR
    getHRStatistics: builder.query<
      { totalHR: number; byIndustry: { industry: string; count: number }[] },
      void
    >({
      query: () => '/hr/statistics',
      providesTags: ['HR'],
    }),
  }),
});

export const {
  useGetHRsQuery,
  useGetHRByIdQuery,
  useGetHRByUserIdQuery,
  useCreateHRMutation,
  useUpdateHRMutation,
  useDeleteHRMutation,
  useGetHRStatisticsQuery,
} = hrApiSlice;
