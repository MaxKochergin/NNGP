// client/src/app/api/usersApiSlice.ts
import { apiSlice } from '../../app/api/api.slice';

// Slice для работы с пользователями
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Получение всех пользователей
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    
    // Получение пользователя по ID
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    // Обновление пользователя
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    
    // Удаление пользователя
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApiSlice;