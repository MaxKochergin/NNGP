// client/src/features/auth/hooks/useLoginForm.ts
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { AppDispatch, RootState } from '../../../app/store';
import { mockLogin, selectMockError, selectMockIsLoading } from '../mockAuthSlice';

// Упрощенная схема валидации для mock авторизации
const loginSchema = yup.object({
  email: yup.string().email('Введите корректный email').required('Email обязателен'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(3, 'Пароль должен содержать минимум 3 символа'),
});

// Тип для данных формы
export type LoginFormInputs = {
  email: string;
  password: string;
};

// Функция для определения базового маршрута по роли пользователя
const getDefaultRouteByRole = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/app/admin/panel';
    case 'hr':
      return '/app/hr/profile';
    case 'employer':
      return '/app/employer/profile';
    case 'candidate':
      return '/app/candidate/profile';
    default:
      return '/';
  }
};

export const useLoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Получаем состояние из mock auth slice
  const isLoading = useSelector(selectMockIsLoading);
  const error = useSelector(selectMockError);

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
      console.log('🔐 Попытка входа с данными:', { email: data.email });

      const result = await dispatch(mockLogin(data)).unwrap();

      console.log('✅ Успешный вход, результат:', result);
      console.log('🔑 Токен получен:', !!result.token);
      console.log('👤 Данные пользователя:', result.user);

      if (result.user) {
        // Определяем маршрут перенаправления в зависимости от роли
        const redirectRoute = getDefaultRouteByRole(result.user.role);
        console.log('🔄 Перенаправление на:', redirectRoute);

        navigate(redirectRoute); // Перенаправление после успешного входа
      }
    } catch (err) {
      console.error('❌ Ошибка входа:', err);
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
