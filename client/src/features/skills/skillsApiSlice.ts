import { apiSlice } from '../../app/api/api.slice';
import { CreateSkillDto, Skill, UpdateSkillDto } from '../../types/skill';

export const skillsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Получение всех навыков
    getSkills: builder.query<Skill[], void>({
      query: () => '/skills',
      providesTags: ['Skill'],
    }),

    // Получение навыка по ID
    getSkillById: builder.query<Skill, string>({
      query: id => `/skills/${id}`,
      providesTags: (result, error, id) => [{ type: 'Skill', id }],
    }),

    // Создание навыка (только для админов)
    createSkill: builder.mutation<Skill, CreateSkillDto>({
      query: skillData => ({
        url: '/skills',
        method: 'POST',
        body: skillData,
      }),
      invalidatesTags: ['Skill'],
    }),

    // Обновление навыка (только для админов)
    updateSkill: builder.mutation<Skill, { id: string; data: UpdateSkillDto }>({
      query: ({ id, data }) => ({
        url: `/skills/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Skill', id }],
    }),

    // Удаление навыка (только для админов)
    deleteSkill: builder.mutation<void, string>({
      query: id => ({
        url: `/skills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skill'],
    }),

    // Получение навыков по категории
    getSkillsByCategory: builder.query<Skill[], string>({
      query: category => `/skills/category/${category}`,
      providesTags: ['Skill'],
    }),
  }),
});

export const {
  useGetSkillsQuery,
  useGetSkillByIdQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetSkillsByCategoryQuery,
} = skillsApiSlice;
