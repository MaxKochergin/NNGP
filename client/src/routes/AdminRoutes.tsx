import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';
import Notifications from '../pages/admin/NotificationsAdmin';
// Импорт новых компонентов админа
import Panel from '../pages/admin/Panel';
import Settings from '../pages/admin/Settings';
import SystemInfo from '../pages/admin/system/SystemInfo';
import UsersList from '../pages/admin/users/UsersList';

// Определяем маршрут для админа
const adminRoute = {
  path: 'admin',
  element: (
    <RoleBasedRoute allowedRoles={['admin']}>
      <Outlet />
    </RoleBasedRoute>
  ),
  children: [
    // Перенаправление с /app/admin на /app/admin/panel
    {
      index: true,
      element: <Navigate to="/app/admin/panel" />,
    },
    {
      path: 'panel',
      element: <Panel />,
    },

    // Маршруты для управления контентом (Админ)
    {
      path: 'settings',
      element: <Settings />,
    },
    {
      path: 'notifications',
      element: <Notifications />,
    },
    // Маршруты для управления пользователями
    {
      path: 'users',
      element: <UsersList />,
    },
    // Маршрут для системной информации
    {
      path: 'system',
      element: <SystemInfo />,
    },

    // Здесь можно добавить другие подмаршруты для админа
  ],
};

// Экспортируем сам объект для использования в PrivateRoutes
export const adminRoutes = adminRoute;
