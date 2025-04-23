// client/src/pages/auth/Login.tsx
import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/layouts/Public/PublicLayout';
import { Box, Typography, Paper } from '@mui/material';
import { useLoginForm } from '../../features/auth/hooks/useLoginForm';
import { LoginForm } from './components/LoginForm';

export const Login = () => {
  const loginFormProps = useLoginForm();

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
            maxWidth: 500,
            borderRadius: 2,
            backgroundColor: 'inherit',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Вход в систему
          </Typography>

          <LoginForm {...loginFormProps} />

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link to="/auth/forgot-password">Забыли пароль?</Link>
          </Box>
          <Box sx={{ mt: 1, textAlign: 'center' }}>
            <Typography variant="body2">
              Нет аккаунта?{' '}
              <Link to="/auth/register">Зарегистрироваться</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </PublicLayout>
  );
};

export default Login;