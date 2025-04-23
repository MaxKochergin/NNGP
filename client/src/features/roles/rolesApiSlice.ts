import { apiSlice } from '../../app/api/api.slice';
import { AssignRoleDto, CreateRoleDto, Role, UpdateRoleDto, UserRole } from '../../types/role';

export const rolesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Получение всех ролей
    getRoles: builder.query<Role[], void>({
      query: () => '/roles',
      providesTags: ['Role'],
    }),

    // Получение роли по ID
    getRoleById: builder.query<Role, string>({
      query: id => `/roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),

    // Создание роли (только для админов)
    createRole: builder.mutation<Role, CreateRoleDto>({
      query: roleData => ({
        url: '/roles',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: ['Role'],
    }),

    // Обновление роли (только для админов)
    updateRole: builder.mutation<Role, { id: string; data: UpdateRoleDto }>({
      query: ({ id, data }) => ({
        url: `/roles/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }],
    }),

    // Удаление роли (только для админов)
    deleteRole: builder.mutation<void, string>({
      query: id => ({
        url: `/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),

    // Получение ролей пользователя
    getUserRoles: builder.query<UserRole[], string>({
      query: userId => `/users/${userId}/roles`,
      providesTags: (result, error, userId) => [
        { type: 'User', id: userId },
        ...(result?.map(role => ({ type: 'Role' as const, id: role.id })) || []),
      ],
    }),

    // Назначение роли пользователю (только для админов)
    assignRole: builder.mutation<UserRole, AssignRoleDto>({
      query: assignRoleData => ({
        url: '/users/roles',
        method: 'POST',
        body: assignRoleData,
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, 'Role'],
    }),

    // Удаление роли у пользователя (только для админов)
    removeRole: builder.mutation<void, string>({
      query: userRoleId => ({
        url: `/users/roles/${userRoleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Role'],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetUserRolesQuery,
  useAssignRoleMutation,
  useRemoveRoleMutation,
} = rolesApiSlice;
