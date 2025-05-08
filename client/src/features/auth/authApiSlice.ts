// client/src/app/api/authApiSlice.ts
import { apiSlice } from '../../app/api/api.slice';
import { AuthResponse, LoginDto, RegisterDto } from '../../types/auth';

// Расширение apiSlice для аутентификации
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // Endpoint для логина
    login: builder.mutation<AuthResponse, LoginDto>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Endpoint для регистрации
    register: builder.mutation<AuthResponse, RegisterDto>({
      query: userData => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Endpoint для получения профиля текущего пользователя
    getProfile: builder.query<any, void>({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),

    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: credentials => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Экспорт сгенерированных хуков
export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useForgotPasswordMutation,
} = authApiSlice;
