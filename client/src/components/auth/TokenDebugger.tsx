import { useEffect, useState } from 'react';
import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';

/**
 * Компонент для тестирования и отладки JWT токенов
 */
export const TokenDebugger: React.FC = () => {
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');
  const [manualToken, setManualToken] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Обновляем token, если он меняется в localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken !== token) {
      setToken(storedToken || '');
    }
  }, [token]);

  // Тестируем токен с API
  const testToken = async () => {
    try {
      setError('');
      setResponse('Отправка запроса...');

      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(`Ошибка запроса: ${err instanceof Error ? err.message : String(err)}`);
      setResponse('');
    }
  };

  // Сохраняем токен в localStorage
  const saveToken = () => {
    localStorage.setItem('token', manualToken);
    setToken(manualToken);
    setManualToken('');
  };

  return (
    <Paper sx={{ p: 3, m: 3, maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        JWT Token Debugger
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Текущий токен:</Typography>
        <Typography
          variant="body2"
          sx={{
            p: 1,
            bgcolor: 'background.paper',
            border: '1px solid #ddd',
            borderRadius: 1,
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap',
            minHeight: '2em',
            maxHeight: '5em',
            overflow: 'auto',
          }}
        >
          {token || 'Нет токена'}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Ввод токена вручную"
          value={manualToken}
          onChange={e => setManualToken(e.target.value)}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 1 }}
        />
        <Button variant="contained" color="primary" onClick={saveToken}>
          Сохранить токен
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={testToken}
          disabled={!token}
          sx={{ mb: 2 }}
        >
          Проверить токен с API
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="subtitle1">Ответ сервера:</Typography>
        <Typography
          variant="body2"
          component="pre"
          sx={{
            p: 1,
            bgcolor: 'background.paper',
            border: '1px solid #ddd',
            borderRadius: 1,
            overflow: 'auto',
            maxHeight: '200px',
            minHeight: '100px',
          }}
        >
          {response || 'Нет ответа'}
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            localStorage.removeItem('token');
            setToken('');
            setResponse('');
          }}
        >
          Удалить токен
        </Button>
      </Box>
    </Paper>
  );
};

export default TokenDebugger;
