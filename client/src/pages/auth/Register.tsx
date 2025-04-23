// client/src/pages/auth/Register.tsx
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layouts/Public/PublicLayout';
import { Box, Typography, Paper } from '@mui/material';
import { useRegisterForm } from '../../features/auth/hooks/useRegisterForm';
import { RegisterForm } from './components/RegisterForm';

// Цветовые переменные
const colors = {
  formBackground: '#f8f9fa',      // Светло-серый фон формы
  paperBackground: '#ffffff',     // Белый фон бумаги
  inputBackground: '#ffffff',     // Белый фон полей ввода
  buttonPrimary: '#1976d2',       // Синий цвет кнопки
  textPrimary: '#212121',         // Почти черный для основного текста
  textSecondary: '#757575',       // Серый для вторичного текста
};

export const Register = () => {
  const registerFormProps = useRegisterForm();

  return (
    <PublicLayout>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 600,
            borderRadius: 2,
            backgroundColor: 'inherit',
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ color: colors.textPrimary }}
          >
            Регистрация
          </Typography>

          <Box 
            sx={{ 
              backgroundColor: 'inherit',
              p: 3,
              borderRadius: 1,
              mb: 2
            }}
          >
            <RegisterForm {...registerFormProps} />
          </Box>

          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Уже есть аккаунт?{' '}
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

export default Register;