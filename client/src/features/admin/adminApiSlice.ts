import { apiSlice } from '../../app/api/api.slice';
import {
  ActivityLog,
  ActivityLogFilters,
  Admin,
  AdminFilters,
  CreateAdminDto,
  SystemSettings,
  SystemStats,
  UpdateAdminDto,
} from '../../types/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Получение всех администраторов с фильтрацией
    getAdmins: builder.query<Admin[], AdminFilters | void>({
      query: filters => {
        // Формируем строку запроса, если есть фильтры
        if (filters) {
          const queryParams = new URLSearchParams();
          for (const [key, value] of Object.entries(filters)) {
            if (value) queryParams.append(key, String(value));
          }
          return `/admin/users?${queryParams.toString()}`;
        }
        return '/admin/users';
      },
      providesTags: ['Admin'],
    }),

    // Получение администратора по ID
    getAdminById: builder.query<Admin, string>({
      query: id => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Admin', id }],
    }),

    // Проверка, является ли пользователь администратором
    isUserAdmin: builder.query<{ isAdmin: boolean; permissions: string[] }, string>({
      query: userId => `/admin/check/${userId}`,
      providesTags: (result, error, userId) => [{ type: 'Admin', id: userId }],
    }),

    // Создание нового администратора
    createAdmin: builder.mutation<Admin, CreateAdminDto>({
      query: adminData => ({
        url: '/admin/users',
        method: 'POST',
        body: adminData,
      }),
      invalidatesTags: ['Admin', 'User'],
    }),

    // Обновление прав администратора
    updateAdmin: builder.mutation<Admin, { id: string; data: UpdateAdminDto }>({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Admin', id }],
    }),

    // Удаление администратора (только понижение в правах, не удаление пользователя)
    removeAdmin: builder.mutation<void, string>({
      query: id => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin', 'User'],
    }),

    // Получение системной статистики для дашборда
    getSystemStats: builder.query<SystemStats, void>({
      query: () => '/admin/statistics',
      providesTags: ['Admin'],
    }),

    // Получение логов активности
    getActivityLogs: builder.query<ActivityLog[], ActivityLogFilters | void>({
      query: filters => {
        if (filters) {
          const queryParams = new URLSearchParams();
          for (const [key, value] of Object.entries(filters)) {
            if (value) queryParams.append(key, String(value));
          }
          return `/admin/logs?${queryParams.toString()}`;
        }
        return '/admin/logs';
      },
      providesTags: ['Admin'],
    }),

    // Очистка старых логов активности
    clearOldLogs: builder.mutation<{ deleted: number }, { olderThan: string }>({
      query: ({ olderThan }) => ({
        url: '/admin/logs/clear',
        method: 'POST',
        body: { olderThan },
      }),
      invalidatesTags: ['Admin'],
    }),

    // Экспорт логов активности в CSV
    exportLogs: builder.mutation<string, ActivityLogFilters | void>({
      query: filters => {
        const queryParams = new URLSearchParams();
        if (filters) {
          for (const [key, value] of Object.entries(filters)) {
            if (value) queryParams.append(key, String(value));
          }
        }
        return {
          url: `/admin/logs/export?${queryParams.toString()}`,
          method: 'GET',
          responseHandler: response => response.text(),
        };
      },
    }),

    // Системное обслуживание - очистка кэша
    clearSystemCache: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/admin/system/clear-cache',
        method: 'POST',
      }),
    }),

    // Системное обслуживание - проверка целостности БД
    checkDatabaseIntegrity: builder.mutation<
      { status: 'ok' | 'warning' | 'error'; issues: string[] },
      void
    >({
      query: () => ({
        url: '/admin/system/check-db',
        method: 'POST',
      }),
    }),

    // Системное обслуживание - резервное копирование
    createBackup: builder.mutation<{ backupId: string; fileName: string; size: number }, void>({
      query: () => ({
        url: '/admin/system/backup',
        method: 'POST',
      }),
    }),

    // Получение списка резервных копий
    getBackups: builder.query<
      { id: string; fileName: string; size: number; createdAt: string }[],
      void
    >({
      query: () => '/admin/system/backups',
      providesTags: ['Admin'],
    }),

    // Восстановление из резервной копии
    restoreFromBackup: builder.mutation<{ success: boolean; message: string }, string>({
      query: backupId => ({
        url: '/admin/system/restore',
        method: 'POST',
        body: { backupId },
      }),
    }),

    // Получение системных настроек
    getSystemSettings: builder.query<SystemSettings, void>({
      query: () => '/admin/settings',
      providesTags: ['Admin'],
    }),

    // Обновление системных настроек
    updateSystemSettings: builder.mutation<SystemSettings, Partial<SystemSettings>>({
      query: settingsData => ({
        url: '/admin/settings',
        method: 'PATCH',
        body: settingsData,
      }),
      invalidatesTags: ['Admin'],
    }),

    // Сброс системных настроек до значений по умолчанию
    resetSystemSettings: builder.mutation<SystemSettings, void>({
      query: () => ({
        url: '/admin/settings/reset',
        method: 'POST',
      }),
      invalidatesTags: ['Admin'],
    }),

    // Управление техническим обслуживанием
    toggleMaintenanceMode: builder.mutation<
      { enabled: boolean; message: string },
      { enabled: boolean; message?: string }
    >({
      query: data => ({
        url: '/admin/system/maintenance',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetAdminsQuery,
  useGetAdminByIdQuery,
  useIsUserAdminQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useRemoveAdminMutation,
  useGetSystemStatsQuery,
  useGetActivityLogsQuery,
  useClearOldLogsMutation,
  useExportLogsMutation,
  useClearSystemCacheMutation,
  useCheckDatabaseIntegrityMutation,
  useCreateBackupMutation,
  useGetBackupsQuery,
  useRestoreFromBackupMutation,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useResetSystemSettingsMutation,
  useToggleMaintenanceModeMutation,
} = adminApiSlice;
