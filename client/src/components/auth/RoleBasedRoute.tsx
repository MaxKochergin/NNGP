import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

/**
 * Компонент для проверки ролей пользователя
 * @param children - вложенный компонент для отображения
 * @param allowedRoles - разрешенные роли
 * @param redirectTo - путь для перенаправления, если у пользователя нет доступа
 */
export function RoleBasedRoute({
  children,
  allowedRoles = [],
  redirectTo = '/auth/login',
}: RoleBasedRouteProps) {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Если нет ограничений по ролям, отображаем вложенный компонент
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Проверяем, есть ли у пользователя необходимая роль
  const hasRequiredRole = user?.roles?.some(role => allowedRoles.includes(role)) || false;

  // Если у пользователя есть необходимая роль, отображаем вложенный компонент
  // Иначе перенаправляем на указанный путь
  return hasRequiredRole ? <>{children}</> : <Navigate to={redirectTo} replace />;
}

export default RoleBasedRoute;
