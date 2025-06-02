// client/src/components/auth/AuthGuard.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { ProtectedLayout } from '../layouts/Protected/Layout';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

// Функция для определения базового маршрута по роли пользователя
const getDefaultRouteByRole = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/app/admin/panel';
    case 'hr':
      return '/app/hr/profile';
    case 'employer':
      return '/app/employer/profile';
    case 'candidate':
      return '/app/candidate/profile';
    default:
      return '/';
  }
};

export const AuthGuard = ({ children, requiredRoles = [] }: AuthGuardProps) => {
  // Используем mock auth вместо обычного auth
  const { isAuthenticated, user } = useAppSelector(state => state.mockAuth);
  const location = useLocation();

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Если есть требуемые роли и у пользователя нет нужной роли, перенаправляем на маршрут по роли
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    const defaultRoute = getDefaultRouteByRole(user.role);
    return <Navigate to={defaultRoute} replace />;
  }

  // Оборачиваем содержимое в защищенный макет
  return <ProtectedLayout>{children}</ProtectedLayout>;
};

export default AuthGuard;
