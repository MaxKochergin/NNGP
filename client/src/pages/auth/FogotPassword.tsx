// client/src/pages/auth/ForgotPassword.tsx
import { Box, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layouts/Public/PublicLayout';
import { useForgotPasswordForm } from '../../features/auth/hooks/useFogotPassword';
import { ForgotPasswordForm } from './components/FogotPasswordForm';

// Цветовые переменные
const colors = {
  pageBackground: '#ffffff', // Белый цвет фона всей страницы
  formBackground: '#ffffff', // Белый фон формы
  paperBackground: '#ffffff', // Белый фон бумаги
  buttonPrimary: '#1976d2', // Синий цвет кнопки (оставляем для кнопок и ссылок)
  textPrimary: '#212121', // Почти черный для основного текста
  textSecondary: '#757575', // Серый для вторичного текста
};

export const ForgotPassword = () => {
  const forgotPasswordFormProps = useForgotPasswordForm();

  return (
    <PublicLayout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.pageBackground,
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 500,
            borderRadius: 2,
            backgroundColor: colors.paperBackground,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: colors.textPrimary }}>
            Восстановление пароля
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: colors.textSecondary }}>
            Введите ваш email, и мы отправим вам инструкции по восстановлению пароля
          </Typography>

          <Box
            sx={{
              backgroundColor: colors.formBackground,
              p: 3,
              borderRadius: 1,
              mb: 2,
            }}
          >
            <ForgotPasswordForm {...forgotPasswordFormProps} />
          </Box>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Вспомнили пароль?{' '}
              <Link
                to="/auth/login"
                style={{ color: colors.buttonPrimary, textDecoration: 'none' }}
              >
                Войти
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </PublicLayout>
  );
};

export default ForgotPassword;
