// client/src/features/auth/components/RegisterForm.tsx
import { TextField, Button, Alert, Box, InputAdornment } from '@mui/material';
import { RegisterFormInputs } from '../../../features/auth/hooks/useRegisterForm';
import { UseFormRegister, FieldErrors, SubmitHandler, useWatch, Control } from 'react-hook-form';

interface RegisterFormProps {
  register: UseFormRegister<RegisterFormInputs>;
  handleSubmit: (onSubmit: SubmitHandler<RegisterFormInputs>) => (e: React.FormEvent) => void;
  onSubmit: SubmitHandler<RegisterFormInputs>;
  errors: FieldErrors<RegisterFormInputs>;
  isLoading: boolean;
  error: any;
  control: Control<RegisterFormInputs>; // Добавляем control для useWatch
}

// Компонент-счетчик символов
const CharacterCounter = ({ value, max }: { value: string; max: number }) => (
  <InputAdornment position="end">
    <span style={{ 
      fontSize: '0.75rem', 
      color: value.length > max ? '#f44336' : '#757575' 
    }}>
      {value.length}/{max}
    </span>
  </InputAdornment>
);

export const RegisterForm = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isLoading,
  error,
  control, // Получаем control
}: RegisterFormProps) => {
  // Отслеживаем значения полей для счетчиков
  const firstName = useWatch({ control, name: 'firstName', defaultValue: '' });
  const lastName = useWatch({ control, name: 'lastName', defaultValue: '' });
  
  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {(error as any)?.data?.message || 'Произошла ошибка при регистрации'}
        </Alert>
      )}

      <Box 
        component="form" 
        onSubmit={handleSubmit(onSubmit)} 
        noValidate
        sx={{ width: '100%' }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2, 
          mb: 2 
        }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              required
              fullWidth
              id="firstName"
              label="Имя"
              autoComplete="given-name"
              {...register('firstName')}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              InputProps={{
                endAdornment: <CharacterCounter value={firstName} max={10} />
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Фамилия"
              autoComplete="family-name"
              {...register('lastName')}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              InputProps={{
                endAdornment: <CharacterCounter value={lastName} max={15} />
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email"
            autoComplete="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            required
            fullWidth
            id="password"
            label="Пароль"
            type="password"
            autoComplete="new-password"
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message || 'Минимум 6 символов, включая заглавную букву, строчную букву и цифру'}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            required
            fullWidth
            id="confirmPassword"
            label="Подтвердите пароль"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword')}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </Box>
    </Box>
  );
};