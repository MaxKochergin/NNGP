// client/src/app/api/usersApiSlice.ts
import { apiSlice } from '../../app/api/api.slice';
import { UpdateUserDto, User, UserFilters, UserWithRoles } from '../../types/user';

// Slice для работы с пользователями
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Получение всех пользователей с возможной фильтрацией
    getUsers: builder.query<User[], UserFilters | void>({
      query: filters => {
        // Формируем строку запроса, если есть фильтры
        if (filters) {
          const queryParams = new URLSearchParams();
          for (const [key, value] of Object.entries(filters)) {
            if (value) queryParams.append(key, String(value));
          }
          return `/users?${queryParams.toString()}`;
        }
        return '/users';
      },
      providesTags: ['User'],
    }),

    // Получение пользователя по ID
    getUserById: builder.query<User, string>({
      query: id => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Получение текущего пользователя с ролями
    getCurrentUser: builder.query<UserWithRoles, void>({
      query: () => '/users/current',
      providesTags: ['User'],
    }),

    // Обновление пользователя
    updateUser: builder.mutation<User, { id: string; data: UpdateUserDto }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    // Удаление пользователя
    deleteUser: builder.mutation<void, string>({
      query: id => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Верификация email пользователя
    verifyEmail: builder.mutation<void, string>({
      query: token => ({
        url: `/users/verify-email`,
        method: 'POST',
        body: { token },
      }),
      invalidatesTags: ['User'],
    }),

    // Запрос на сброс пароля
    requestPasswordReset: builder.mutation<void, string>({
      query: email => ({
        url: `/users/request-password-reset`,
        method: 'POST',
        body: { email },
      }),
    }),

    // Сброс пароля
    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: data => ({
        url: `/users/reset-password`,
        method: 'POST',
        body: data,
      }),
    }),

    // Изменение пароля
    changePassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
      query: data => ({
        url: `/users/change-password`,
        method: 'POST',
        body: data,
      }),
    }),

    // Получение статистики пользователей (для админ-панели)
    getUsersStatistics: builder.query<
      { total: number; verified: number; withProfiles: number },
      void
    >({
      query: () => '/users/statistics',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetCurrentUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useVerifyEmailMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetUsersStatisticsQuery,
} = usersApiSlice;
