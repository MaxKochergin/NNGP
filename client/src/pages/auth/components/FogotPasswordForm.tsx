// client/src/features/auth/components/ForgotPasswordForm.tsx
import { TextField, Button, Alert, Box } from '@mui/material';
import { ForgotPasswordFormInputs } from '../../../features/auth/hooks/useFogotPassword';
import { UseFormRegister, FieldErrors, SubmitHandler, Control } from 'react-hook-form';

interface ForgotPasswordFormProps {
  register: UseFormRegister<ForgotPasswordFormInputs>;
  handleSubmit: (onSubmit: SubmitHandler<ForgotPasswordFormInputs>) => (e: React.FormEvent) => void;
  onSubmit: SubmitHandler<ForgotPasswordFormInputs>;
  errors: FieldErrors<ForgotPasswordFormInputs>;
  isLoading: boolean;
  error: any;
  isSuccess: boolean;
  control: Control<ForgotPasswordFormInputs>;
}

export const ForgotPasswordForm = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  isLoading,
  error,
  isSuccess,
}: ForgotPasswordFormProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {(error as any)?.data?.message || 'Произошла ошибка при запросе восстановления пароля'}
        </Alert>
      )}
      
      {isSuccess ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          Инструкции по восстановлению пароля отправлены на указанный email
        </Alert>
      ) : (
        <Box 
          component="form" 
          onSubmit={handleSubmit(onSubmit)} 
          noValidate
          sx={{ width: '100%' }}
        >
          <Box sx={{ mb: 2 }}>
            <TextField
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
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isLoading}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading ? 'Отправка...' : 'Восстановить пароль'}
          </Button>
        </Box>
      )}
    </Box>
  );
};