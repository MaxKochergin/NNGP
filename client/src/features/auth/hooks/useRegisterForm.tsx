// client/src/features/auth/hooks/useRegisterForm.ts
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useRegisterMutation } from '../authApiSlice';

// Схема валидации для формы регистрации
const registerSchema = yup.object({
  firstName: yup
    .string()
    .required('Имя обязательно')
    .max(10, 'Имя не должно превышать 10 символов'),
  lastName: yup
    .string()
    .required('Фамилия обязательна')
    .max(15, 'Фамилия не должна превышать 10 символов'),
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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли должны совпадать')
    .required('Подтверждение пароля обязательно')
    .max(30, 'Подтверждение пароля не должно превышать 30 символов'),
});

// Тип для данных формы
export type RegisterFormInputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  // Инициализация React Hook Form с валидацией Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Обработчик отправки формы
  const onSubmit = async (data: RegisterFormInputs) => {
    // Удаляем confirmPassword перед отправкой
    const { confirmPassword, ...registerData } = data;

    try {
      await registerUser(registerData).unwrap();
      navigate('/auth/login'); // Перенаправление после успешной регистрации
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    error,
    control,
  };
};
