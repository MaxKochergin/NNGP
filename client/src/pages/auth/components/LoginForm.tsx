// client/src/features/auth/components/LoginForm.tsx
import { Box, TextField, Button, Alert } from '@mui/material';
import { LoginFormInputs } from '../../../features/auth/hooks/useLoginForm';
import { UseFormRegister, FieldErrors, SubmitHandler } from 'react-hook-form';

interface LoginFormProps {
  register: UseFormRegister<LoginFormInputs>;
  handleSubmit: (onSubmit: SubmitHandler<LoginFormInputs>) => (e: React.FormEvent) => void;
  onSubmit: SubmitHandler<LoginFormInputs>;
  errors: FieldErrors<LoginFormInputs>;
  isLoading: boolean;
  error: string | null;
}

export const LoginForm = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isLoading,
  error,
}: LoginFormProps) => {
  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          autoComplete="email"
          autoFocus
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Пароль"
          type="password"
          autoComplete="current-password"
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </Button>
      </Box>
    </Box>
  );
};
