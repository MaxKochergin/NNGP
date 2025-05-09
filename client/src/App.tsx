import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import AuthDebugger from './components/auth/AuthDebugger';
import AuthInitializer from './components/auth/AuthInitializer';
import { restoreToken } from './features/auth/authSlice';
import { AppRouter } from './routes/AppRouter';

function App() {
  const dispatch = useAppDispatch();

  // Принудительно восстанавливаем токен при загрузке приложения
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('App: Восстанавливаем токен из localStorage');
      dispatch(restoreToken(token));
    }
  }, [dispatch]);

  // Проверяем, нужно ли показывать отладчик (только в режиме разработки)
  const isDebugMode = import.meta.env.DEV || import.meta.env.VITE_SHOW_AUTH_DEBUGGER === 'true';

  return (
    <>
      <AuthInitializer />
      <RouterProvider router={AppRouter} />
      {/* {isDebugMode && <AuthDebugger />} */}
    </>
  );
}

export default App;
