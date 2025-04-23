import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

interface PublicRedirectProps {
  children: React.ReactNode;
}

// Функция для определения базового маршрута по роли пользователя
const getDefaultRouteByRole = (roles: string[] | undefined): string => {
  if (!roles || roles.length === 0) return '/';

  if (roles.includes('admin')) return '/admin/panel';
  if (roles.includes('hr')) return '/hr/profile';
  if (roles.includes('employee')) return '/employee/profile';
  if (roles.includes('candidate')) return '/candidate/profile';

  return '/';
};

export const PublicRedirect = ({ children }: PublicRedirectProps) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  // Если пользователь аутентифицирован, перенаправляем на соответствующую страницу профиля
  if (isAuthenticated) {
    const redirectPath = getDefaultRouteByRole(user?.roles);
    return <Navigate to={redirectPath} replace />;
  }

  // Если пользователь не аутентифицирован, показываем содержимое публичной страницы
  return <>{children}</>;
};
