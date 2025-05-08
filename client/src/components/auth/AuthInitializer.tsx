import { useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { useGetProfileQuery } from '../../features/auth/authApiSlice';

/**
 * Компонент для инициализации состояния аутентификации
 * Автоматически запрашивает данные профиля, если в localStorage есть токен
 */
export const AuthInitializer: React.FC = () => {
  const { token, isAuthenticated } = useAppSelector(state => state.auth);

  // Используем хук RTK Query для получения профиля, если есть токен
  const { isLoading } = useGetProfileQuery(undefined, {
    // Пропускаем запрос, если нет токена
    skip: !token,
  });

  useEffect(() => {
    console.log('AuthInitializer: isAuthenticated =', isAuthenticated);
    console.log('AuthInitializer: token =', !!token);
  }, [isAuthenticated, token]);

  // Этот компонент ничего не рендерит, только выполняет запрос
  return null;
};

export default AuthInitializer;
