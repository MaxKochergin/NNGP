import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';

// Импорт компонентов HR
// Замените этот комментарий на реальный импорт, когда создадите компоненты
// import HRProfile from '../pages/hr/Profile';
// import Candidates from '../pages/hr/Candidates';

// Определяем маршрут для HR
const hrRoute = {
  path: 'hr',
  element: (
    <RoleBasedRoute allowedRoles={['hr', 'admin']}>
      <Outlet />
    </RoleBasedRoute>
  ),
  children: [
    // Перенаправление с /app/hr на /app/hr/profile
    {
      index: true,
      element: <Navigate to="/app/hr/profile" />,
    },
    {
      path: 'profile',
      element: (
        // Временная заглушка, замените на реальный компонент
        <div>Профиль HR-специалиста (в разработке)</div>
      ),
    },
    {
      path: 'candidates',
      element: (
        // Временная заглушка, замените на реальный компонент
        <div>Список кандидатов (в разработке)</div>
      ),
    },
    {
      path: 'employees',
      element: (
        // Временная заглушка, замените на реальный компонент
        <div>Список сотрудников (в разработке)</div>
      ),
    },
    // Маршруты для управления тестами (HR)
    {
      path: 'tests',
      children: [
        {
          path: 'management',
          element: <div>Управление тестами (в разработке)</div>,
        },
        {
          path: 'results',
          element: <div>Результаты тестирования (в разработке)</div>,
        },
        {
          path: 'analytics',
          element: <div>Аналитика по результатам тестов (в разработке)</div>,
        },
      ],
    },
    // Маршруты для управления обучением (HR)
    {
      path: 'learning',
      children: [
        {
          path: 'management',
          element: <div>Управление учебными материалами (в разработке)</div>,
        },
        {
          path: 'assignments',
          element: <div>Назначение курсов сотрудникам (в разработке)</div>,
        },
        {
          path: 'statistics',
          element: <div>Статистика обучения (в разработке)</div>,
        },
      ],
    },
    // Здесь можно добавить другие подмаршруты для HR
  ],
};

// Экспортируем сам объект для использования в PrivateRoutes
export const hrRoutes = hrRoute;
 