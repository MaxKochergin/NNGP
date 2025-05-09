import { Navigate, Outlet } from 'react-router-dom';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';
import AvailableTests from '../pages/candidate/AvailableTests';
import BasicInfo from '../pages/candidate/BasicInfo';
import CandidateProfile from '../pages/candidate/CandidateProfile';
import CandidateProfileEducation from '../pages/candidate/CandidateProfileEducation';
import CandidateProfileExperience from '../pages/candidate/CandidateProfileExperience';
import CandidateProfileSkills from '../pages/candidate/CandidateProfileSkills';
import CompletedTests from '../pages/candidate/CompletedTest';
import Help from '../pages/candidate/Help';
import Notifications from '../pages/candidate/Notifications';
import Settings from '../pages/candidate/Settings';

// Определяем маршрут для кандидата
const candidateRoute = {
  path: 'candidate',
  element: (
    <RoleBasedRoute allowedRoles={['candidate']}>
      <Outlet />
    </RoleBasedRoute>
  ),
  children: [
    // Перенаправление с /app/candidate на /app/candidate/profile
    {
      index: true,
      element: <Navigate to="/app/candidate/profile" />,
    },
    {
      path: 'profile',
      element: <CandidateProfile />,
      children: [
        {
          index: true,
          element: <Navigate to="/app/candidate/profile/basicInfo" />,
        },
        {
          path: 'basicInfo',
          element: <BasicInfo />,
        },
        {
          path: 'experience',
          element: <CandidateProfileExperience />,
        },
        {
          path: 'education',
          element: <CandidateProfileEducation />,
        },
        {
          path: 'skills',
          element: <CandidateProfileSkills />,
        },
      ],
    },
    // Маршруты для тестов кандидата
    {
      path: 'tests',
      children: [
        {
          path: 'available',
          element: <AvailableTests />,
        },
        {
          path: 'history',
          element: <CompletedTests />,
        },
      ],
    },
    // Маршруты для учебных материалов кандидата
    {
      path: 'learning',
      children: [
        {
          path: 'materials',
          element: <div>Учебные материалы для кандидатов (в разработке)</div>,
        },
        {
          path: 'courses',
          element: <div>Курсы для кандидатов (в разработке)</div>,
        },
      ],
    },
    {
      path: 'settings',
      element: <Settings />,
    },
    {
      path: 'notifications',
      element: <Notifications />,
    },
    {
      path: 'help',
      element: <Help />,
    },
  ],
};

// Экспортируем сам объект для использования в PrivateRoutes
export const candidateRoutes = candidateRoute;
