import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useAppSelector } from '../../app/hooks';

/**
 * Компонент для отображения отладочной информации по аутентификации
 * Полезен для выявления проблем после перезагрузки страницы
 */
export const AuthDebugger: React.FC = () => {
  const { token, isAuthenticated, user } = useAppSelector(state => state.auth);
  const [localToken, setLocalToken] = useState<string | null>(null);
  const [testResponse, setTestResponse] = useState<string>('');

  useEffect(() => {
    // Получаем токен из localStorage
    const storedToken = localStorage.getItem('token');
    setLocalToken(storedToken);

    // Устанавливаем интервал проверки токена в localStorage
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      if (currentToken !== localToken) {
        setLocalToken(currentToken);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [localToken]);

  // Тестируем запрос к API с текущим токеном
  const testAuthRequest = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTestResponse(`✅ Status: ${response.status} OK\n${JSON.stringify(data, null, 2)}`);
      } else {
        setTestResponse(`❌ Status: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setTestResponse(`🚫 Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Стили для отладочной панели
  const debuggerStyle = {
    position: 'fixed' as const,
    bottom: '10px',
    right: '10px',
    width: '300px',
    padding: '10px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    fontSize: '12px',
    zIndex: 9999,
    fontFamily: 'monospace',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    margin: '5px 0',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '10px',
  };

  return (
    <div style={debuggerStyle}>
      <h4 style={{ margin: '0 0 10px', color: '#4caf50' }}>Auth Debugger</h4>
      <div>
        <strong>isAuthenticated:</strong> {isAuthenticated ? '✅' : '❌'}
      </div>
      <div>
        <strong>Redux token:</strong> {token ? '✅' : '❌'}
        {token && (
          <div style={{ wordBreak: 'break-all', fontSize: '10px', color: '#aaa' }}>
            {token.substring(0, 15)}...
          </div>
        )}
      </div>
      <div>
        <strong>localStorage token:</strong> {localToken ? '✅' : '❌'}
        {localToken && (
          <div style={{ wordBreak: 'break-all', fontSize: '10px', color: '#aaa' }}>
            {localToken.substring(0, 15)}...
          </div>
        )}
      </div>
      <div>
        <strong>User data:</strong> {user ? '✅' : '❌'}
        {user && (
          <div style={{ wordBreak: 'break-all', fontSize: '10px', color: '#aaa' }}>
            {user.fullName || `${user.firstName} ${user.lastName}` || user.email}
          </div>
        )}
      </div>

      <Button onClick={testAuthRequest} style={buttonStyle as any}>
        Test Auth API
      </Button>

      {testResponse && (
        <div
          style={{
            marginTop: '5px',
            padding: '5px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            fontSize: '10px',
            maxHeight: '100px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}
        >
          {testResponse}
        </div>
      )}

      <div style={{ marginTop: '10px', fontSize: '10px', color: '#aaa' }}>
        Последнее обновление: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default AuthDebugger;
