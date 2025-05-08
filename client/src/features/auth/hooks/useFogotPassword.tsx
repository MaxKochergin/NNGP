// client/src/features/auth/hooks/useForgotPasswordForm.ts
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForgotPasswordMutation } from '../authApiSlice';

// Схема валидации для формы восстановления пароля
const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Email обязателен')
    .max(30, 'Email не должен превышать 30 символов'),
});

// Тип для данных формы
export type ForgotPasswordFormInputs = {
  email: string;
};

export const useForgotPasswordForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  // Инициализация React Hook Form с валидацией Yup
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ForgotPasswordFormInputs>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Обработчик отправки формы
  const onSubmit = async (data: ForgotPasswordFormInputs) => {
    try {
      await forgotPassword(data).unwrap();
      setIsSuccess(true);
    } catch (err) {
      console.error('Ошибка запроса восстановления пароля:', err);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    error,
    isSuccess,
    control,
  };
};