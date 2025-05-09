import { Navigate, Outlet } from 'react-router-dom';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';
import AvailableTests from '../pages/candidate/AvailableTests';
import BasicInfoEmployee from '../pages/employee/BasicInfoEmployee';
import CompletedTestEmployee from '../pages/employee/CompletedTestEmployee';
import EmployerProfile from '../pages/employee/EmployerProfile';
import EmployerProfileEducation from '../pages/employee/EmployerProfileEducation';
import EmployerProfileExperience from '../pages/employee/EmployerProfileExperience';
import EmployerProfileSkills from '../pages/employee/EmployerProfileSkills';
import LearningMaterials from '../pages/employee/LearningMaterials';
import Settings from '../pages/employee/Settings';
import Help from '../pages/employee/Help';
import NotificationsEmployee from '../pages/employee/NotificationsEmployee';
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
      element: <EmployerProfile />,
      children: [
        {
          index: true,
          element: <Navigate to="/app/employee/profile/basicInfo" />,
        },
        {
          path: 'basicInfo',
          element: <BasicInfoEmployee />,
        },
        {
          path: 'experience',
          element: <EmployerProfileExperience />,
        },
        {
          path: 'education',
          element: <EmployerProfileEducation />,
        },
        {
          path: 'skills',
          element: <EmployerProfileSkills />,
        },
      ],
    },
    // Маршруты для тестов сотрудника
    {
      path: 'tests',
      children: [
        {
          path: 'available',
          element: <AvailableTests />,
        },
        {
          path: 'history',
          element: <CompletedTestEmployee />,
        },
      ],
    },
    // Маршруты для учебных материалов сотрудника
    {
      path: 'learning',
      children: [
        {
          path: 'materials',
          element: <LearningMaterials />,
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
    {
      path: 'settings',
      element: <Settings />,
    },
    {
      path: 'help',
      element: <Help />,
    },
    {
      path: 'notifications',
      element: <NotificationsEmployee />,
    },
    // Здесь можно добавить другие подмаршруты для сотрудника
  ],
};

// Экспортируем сам объект для использования в PrivateRoutes
export const employeeRoutes = employeeRoute;
