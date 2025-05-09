import { Navigate, Outlet} from 'react-router-dom';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';
import HrProfile from '../pages/hr/HrProfile';
import BasicInfoHr from '../pages/hr/BasicInfoHr';
import HrProfileExperience from '../pages/hr/HrProfileExperience';
import HrProfileEducation from '../pages/hr/HrProfileEducation';
import HrProfileSkills from '../pages/hr/HrProfileSkills';
import NotificationsHr from '../pages/hr/NotificationsHr';  
import Settings from '../pages/hr/Settings';
import Help from '../pages/hr/Help';
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
        <HrProfile />
      ),
      children:[
        {
          index: true,
          element: <Navigate to="/app/hr/profile/basicInfo" />,
        },
        {
          path: 'basicInfo',
          element: <BasicInfoHr />,
        },
        {
          path: 'experience',
          element: <HrProfileExperience />,
        },
        {
          path: 'education',
          element: <HrProfileEducation />,
        },
        {
          path: 'skills',
          element: <HrProfileSkills />,
        },
      ],
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
    {
      path: 'notifications',
      element: <NotificationsHr />,
    },  
    {
      path: 'settings',
      element: <Settings />,
    },
    {
      path: 'help',
      element: <Help />,
    },
    // Здесь можно добавить другие подмаршруты для HR
  ],
};

// Экспортируем сам объект для использования в PrivateRoutes
export const hrRoutes = hrRoute;
 