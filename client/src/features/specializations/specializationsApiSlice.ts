import { apiSlice } from '../../app/api/api.slice';
import {
  CreateSpecializationDto,
  Specialization,
  UpdateSpecializationDto,
} from '../../types/specialization';

export const specializationsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Получение всех специализаций
    getSpecializations: builder.query<Specialization[], void>({
      query: () => '/specializations',
      providesTags: ['Specialization'],
    }),

    // Получение специализации по ID
    getSpecializationById: builder.query<Specialization, string>({
      query: id => `/specializations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Specialization', id }],
    }),

    // Создание специализации (только для админов)
    createSpecialization: builder.mutation<Specialization, CreateSpecializationDto>({
      query: specializationData => ({
        url: '/specializations',
        method: 'POST',
        body: specializationData,
      }),
      invalidatesTags: ['Specialization'],
    }),

    // Обновление специализации (только для админов)
    updateSpecialization: builder.mutation<
      Specialization,
      { id: string; data: UpdateSpecializationDto }
    >({
      query: ({ id, data }) => ({
        url: `/specializations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Specialization', id }],
    }),

    // Удаление специализации (только для админов)
    deleteSpecialization: builder.mutation<void, string>({
      query: id => ({
        url: `/specializations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Specialization'],
    }),
  }),
});

export const {
  useGetSpecializationsQuery,
  useGetSpecializationByIdQuery,
  useCreateSpecializationMutation,
  useUpdateSpecializationMutation,
  useDeleteSpecializationMutation,
} = specializationsApiSlice;
