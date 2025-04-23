import { apiSlice } from '../../app/api/api.slice';
import {
  CreateLearningMaterialDto,
  LearningMaterial,
  UpdateLearningMaterialDto,
} from '../../types/learningMaterial';

export const learningMaterialsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Получение всех учебных материалов
    getLearningMaterials: builder.query<LearningMaterial[], void>({
      query: () => '/learning-materials',
      providesTags: ['LearningMaterial'],
    }),

    // Получение учебного материала по ID
    getLearningMaterialById: builder.query<LearningMaterial, string>({
      query: id => `/learning-materials/${id}`,
      providesTags: (result, error, id) => [{ type: 'LearningMaterial', id }],
    }),

    // Создание учебного материала
    createLearningMaterial: builder.mutation<LearningMaterial, CreateLearningMaterialDto>({
      query: materialData => ({
        url: '/learning-materials',
        method: 'POST',
        body: materialData,
      }),
      invalidatesTags: ['LearningMaterial'],
    }),

    // Обновление учебного материала
    updateLearningMaterial: builder.mutation<
      LearningMaterial,
      { id: string; data: UpdateLearningMaterialDto }
    >({
      query: ({ id, data }) => ({
        url: `/learning-materials/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'LearningMaterial', id }],
    }),

    // Удаление учебного материала
    deleteLearningMaterial: builder.mutation<void, string>({
      query: id => ({
        url: `/learning-materials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['LearningMaterial'],
    }),

    // Получение учебных материалов по специализации
    getLearningMaterialsBySpecialization: builder.query<LearningMaterial[], string>({
      query: specializationId => `/specializations/${specializationId}/learning-materials`,
      providesTags: ['LearningMaterial', 'Specialization'],
    }),

    // Получение учебных материалов, созданных пользователем
    getUserCreatedLearningMaterials: builder.query<LearningMaterial[], string>({
      query: userId => `/users/${userId}/learning-materials`,
      providesTags: ['LearningMaterial'],
    }),

    // Публикация учебного материала
    publishLearningMaterial: builder.mutation<LearningMaterial, string>({
      query: id => ({
        url: `/learning-materials/${id}/publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'LearningMaterial', id }],
    }),

    // Отмена публикации учебного материала
    unpublishLearningMaterial: builder.mutation<LearningMaterial, string>({
      query: id => ({
        url: `/learning-materials/${id}/unpublish`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'LearningMaterial', id }],
    }),
  }),
});

export const {
  useGetLearningMaterialsQuery,
  useGetLearningMaterialByIdQuery,
  useCreateLearningMaterialMutation,
  useUpdateLearningMaterialMutation,
  useDeleteLearningMaterialMutation,
  useGetLearningMaterialsBySpecializationQuery,
  useGetUserCreatedLearningMaterialsQuery,
  usePublishLearningMaterialMutation,
  useUnpublishLearningMaterialMutation,
} = learningMaterialsApiSlice;
