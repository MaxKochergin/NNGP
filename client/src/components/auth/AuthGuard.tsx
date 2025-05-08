// client/src/components/auth/AuthGuard.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { ProtectedLayout } from '../layouts/Protected/Layout';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

// Функция для определения базового маршрута по роли пользователя
const getDefaultRouteByRole = (roles: string[] | undefined): string => {
  if (!roles || roles.length === 0) return '/';

  if (roles.includes('admin')) return '/app/admin/panel';
  if (roles.includes('hr')) return '/app/hr/profile';
  if (roles.includes('employee')) return '/app/employee/profile';
  if (roles.includes('candidate')) return '/app/candidate/profile';

  return '/';
};

export const AuthGuard = ({ children, requiredRoles = [] }: AuthGuardProps) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);
  const location = useLocation();

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Если есть требуемые роли и у пользователя нет ни одной из них, перенаправляем на маршрут по роли
  if (requiredRoles.length > 0 && !requiredRoles.some(role => user?.roles?.includes(role))) {
    const defaultRoute = getDefaultRouteByRole(user?.roles);
    return <Navigate to={defaultRoute} replace />;
  }

  // Оборачиваем содержимое в защищенный макет
  return <ProtectedLayout>{children}</ProtectedLayout>;
};

export default AuthGuard;
