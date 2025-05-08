// client/src/features/auth/hooks/useLoginForm.ts
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useLoginMutation } from '../authApiSlice';

// Схема валидации для формы входа
const loginSchema = yup.object({
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Email обязателен')
    .max(30, 'Email не должен превышать 30 символов'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(30, 'Пароль не должен превышать 30 символов')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Пароль должен содержать как минимум одну заглавную букву, одну строчную букву и одну цифру'
    ),
});

// Тип для данных формы
export type LoginFormInputs = {
  email: string;
  password: string;
};

// Функция для определения базового маршрута по роли пользователя
const getDefaultRouteByRole = (roles: string[] | undefined): string => {
  if (!roles || roles.length === 0) return '/';

  if (roles.includes('admin')) return '/app/admin';
  if (roles.includes('hr')) return '/app/hr';
  if (roles.includes('employee')) return '/app/employee';
  if (roles.includes('candidate')) return '/app/candidate';

  return '/';
};

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  // Инициализация React Hook Form с валидацией Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Обработчик отправки формы
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const result = await login(data).unwrap();
      // Получаем роли пользователя из результата авторизации
      const userRoles = result.user?.roles || [];
      // Определяем маршрут перенаправления в зависимости от роли
      const redirectRoute = getDefaultRouteByRole(userRoles);
      navigate(redirectRoute); // Перенаправление после успешного входа
    } catch (err) {
      // Обработка ошибок выполняется RTK Query
      console.error('Ошибка входа:', err);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    error,
  };
};
