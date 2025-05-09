import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { authApiSlice, useGetProfileQuery } from '../../features/auth/authApiSlice';

/**
 * Компонент для инициализации состояния аутентификации
 * Автоматически запрашивает данные профиля, если в localStorage есть токен
 */
export const AuthInitializer: React.FC = () => {
  const { token, isAuthenticated, user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Проверяем, есть ли токен, но нет данных пользователя
    // Это типичная ситуация после перезагрузки страницы
    const localToken = localStorage.getItem('token');

    if (localToken && !user) {
      console.log('AuthInitializer: Запрашиваем профиль после перезагрузки страницы');

      // Принудительно запрашиваем профиль
      dispatch(authApiSlice.endpoints.getProfile.initiate(undefined, { forceRefetch: true }));
    }
  }, [token, user, dispatch]);

  // Используем хук RTK Query для получения профиля, если есть токен
  const { isLoading, error, refetch } = useGetProfileQuery(undefined, {
    // Пропускаем запрос, если нет токена
    skip: !token,
  });

  useEffect(() => {
    // Проверяем токен в localStorage и сравниваем с токеном в Redux
    const localToken = localStorage.getItem('token');
    console.log('AuthInitializer: isAuthenticated =', isAuthenticated);
    console.log('AuthInitializer: token в Redux =', !!token);
    console.log('AuthInitializer: token в localStorage =', !!localToken);
    console.log('AuthInitializer: токены совпадают =', token === localToken);
    console.log('AuthInitializer: user данные =', user ? 'есть' : 'отсутствуют');

    if (error) {
      console.error('Ошибка при получении профиля:', error);
    }
  }, [isAuthenticated, token, error, user]);

  // Этот компонент ничего не рендерит, только выполняет запрос
  return null;
};

export default AuthInitializer;
