import { Outlet, RouteObject } from 'react-router-dom';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';

// Определяем массив общих маршрутов (их несколько, поэтому не один объект)
const commonRoutesArray = [
  // Маршрут для настроек пользователя (доступен для всех ролей)
  {
    path: 'settings',
    element: (
      <RoleBasedRoute>
        <div>Настройки пользователя (в разработке)</div>
      </RoleBasedRoute>
    ),
  },
  // Маршрут для уведомлений (доступен для всех ролей)
  {
    path: 'notifications',
    element: (
      <RoleBasedRoute>
        <div>Уведомления пользователя (в разработке)</div>
      </RoleBasedRoute>
    ),
  },
  // Маршрут для справки (доступен для всех ролей)
  {
    path: 'help',
    element: (
      <RoleBasedRoute>
        <div>Справка и поддержка (в разработке)</div>
      </RoleBasedRoute>
    ),
  },
];

// Экспортируем массив маршрутов для использования в PrivateRoutes
export const commonRoutes = commonRoutesArray;
