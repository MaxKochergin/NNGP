import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';

// Импорт компонентов админа
// Замените этот комментарий на реальный импорт, когда создадите компоненты
// import AdminPanel from '../pages/admin/Panel';
// import RolesManagement from '../pages/admin/RolesManagement';

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
      element: (
        // Временная заглушка, замените на реальный компонент
        <div>Панель администратора (в разработке)</div>
      ),
    },
    {
      path: 'roles',
      element: (
        // Временная заглушка, замените на реальный компонент
        <div>Управление ролями (в разработке)</div>
      ),
    },
    {
      path: 'settings',
      element: (
        // Временная заглушка, замените на реальный компонент
        <div>Настройки системы (в разработке)</div>
      ),
    },
    // Маршруты для управления контентом (Админ)
    {
      path: 'content',
      children: [
        {
          path: 'tests',
          element: <div>Управление тестами (Admin) (в разработке)</div>,
        },
        {
          path: 'learning',
          element: <div>Управление учебными материалами (Admin) (в разработке)</div>,
        },
        {
          path: 'notifications',
          element: <div>Управление уведомлениями (в разработке)</div>,
        },
      ],
    },
    // Маршруты для системного администрирования
    {
      path: 'system',
      children: [
        {
          path: 'users',
          element: <div>Управление пользователями (в разработке)</div>,
        },
        {
          path: 'logs',
          element: <div>Системные логи (в разработке)</div>,
        },
        {
          path: 'backup',
          element: <div>Резервное копирование (в разработке)</div>,
        },
      ],
    },
    // Здесь можно добавить другие подмаршруты для админа
  ],
};

// Экспортируем сам объект для использования в PrivateRoutes
export const adminRoutes = adminRoute;
 