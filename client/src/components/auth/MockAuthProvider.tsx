// Компонент для инициализации mock авторизации
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { restoreAuth } from '../../features/auth/mockAuthSlice';

interface MockAuthProviderProps {
  children: React.ReactNode;
}

export const MockAuthProvider = ({ children }: MockAuthProviderProps) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Восстанавливаем состояние авторизации из localStorage при загрузке приложения
    dispatch(restoreAuth());
  }, [dispatch]);

  return <>{children}</>;
};
