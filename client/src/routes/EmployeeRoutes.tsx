import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';

// Импорт компонентов сотрудника
// Замените этот комментарий на реальный импорт, когда создадите компоненты
// import EmployeeProfile from '../pages/employee/EmployeeProfile';

// Определяем маршрут для сотрудника
const employeeRoute = {
  path: 'employee',
  element: (
    <RoleBasedRoute allowedRoles={['employee']}>
      <Outlet />
    </RoleBasedRoute>
  ),
  children: [
    // Перенаправление с /app/employee на /app/employee/profile
    {
      index: true,
      element: <Navigate to="/app/employee/profile" />,
    },
    {
      path: 'profile',
      element: (
        // Временная заглушка, замените на реальный компонент
        <div>Профиль сотрудника (в разработке)</div>
      ),
    },
    // Маршруты для тестов сотрудника
    {
      path: 'tests',
      children: [
        {
          path: 'available',
          element: <div>Доступные тесты для сотрудников (в разработке)</div>,
        },
        {
          path: 'history',
          element: <div>История тестов сотрудника (в разработке)</div>,
        },
        {
          path: 'assessment',
          element: <div>Оценка компетенций сотрудника (в разработке)</div>,
        },
      ],
    },
    // Маршруты для учебных материалов сотрудника
    {
      path: 'learning',
      children: [
        {
          path: 'materials',
          element: <div>Учебные материалы для сотрудников (в разработке)</div>,
        },
        {
          path: 'courses',
          element: <div>Курсы повышения квалификации (в разработке)</div>,
        },
        {
          path: 'webinars',
          element: <div>Вебинары для сотрудников (в разработке)</div>,
        },
      ],
    },
    // Здесь можно добавить другие подмаршруты для сотрудника
  ],
};

// Экспортируем сам объект для использования в PrivateRoutes
export const employeeRoutes = employeeRoute;
 