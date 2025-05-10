import { Navigate, Outlet } from 'react-router-dom';
import RoleBasedRoute from '../components/auth/RoleBasedRoute';
// Импорт компонента для назначений
import AssignmentDashboard from '../pages/hr/assignments/AssignmentDashboard';
import BasicInfoHr from '../pages/hr/BasicInfoHr';
import CandidateDetails from '../pages/hr/candidates/CandidateDetails';
import CandidateForm from '../pages/hr/candidates/CandidateForm';
// Импорт компонентов HR
// Замените этот комментарий на реальный импорт, когда создадите компоненты
// import HRProfile from '../pages/hr/Profile';
// import Candidates from '../pages/hr/Candidates';

// Импорт компонентов для кандидатов
import CandidatesList from '../pages/hr/candidates/CandidatesList';
import EmployeeDetails from '../pages/hr/employees/EmployeeDetails';
import EmployeeForm from '../pages/hr/employees/EmployeeForm';
import EmployeesList from '../pages/hr/employees/EmployeesList';
import Help from '../pages/hr/Help';
import HrProfile from '../pages/hr/HrProfile';
import HrProfileEducation from '../pages/hr/HrProfileEducation';
import HrProfileExperience from '../pages/hr/HrProfileExperience';
import HrProfileSkills from '../pages/hr/HrProfileSkills';
import LearningMaterialCard from '../pages/hr/learning/LearningMaterialCard';
import LearningMaterialDetails from '../pages/hr/learning/LearningMaterialDetails';
import LearningMaterialForm from '../pages/hr/learning/LearningMaterialForm';
import LearningMaterialsFilters from '../pages/hr/learning/LearningMaterialsFilters';
// Импорт компонентов для учебных материалов
import LearningMaterialsList from '../pages/hr/learning/LearningMaterialsList';
import NotificationsHr from '../pages/hr/NotificationsHr';
import Settings from '../pages/hr/Settings';
import TestAnalytics from '../pages/hr/tests/TestAnalytics';
import TestDetails from '../pages/hr/tests/TestDetails';
import TestForm from '../pages/hr/tests/TestForm';
import TestResults from '../pages/hr/tests/TestResults';
// Импорт компонентов для тестов
import TestsList from '../pages/hr/tests/TestsList';

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
      children: [
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
      element: <CandidatesList />,
    },
    {
      path: 'candidates/new',
      element: <CandidateForm />,
    },
    {
      path: 'candidates/:id',
      element: <CandidateDetails />,
    },
    {
      path: 'candidates/:id/edit',
      element: <CandidateForm />,
    },
    {
      path: 'employees',
      element: <EmployeesList />,
    },
    {
      path: 'employees/new',
      element: <EmployeeForm />,
    },
    {
      path: 'employees/:id',
      element: <EmployeeDetails />,
    },
    {
      path: 'employees/:id/edit',
      element: <EmployeeForm />,
    },
    // Маршруты для управления тестами (HR)
    {
      path: 'tests',
      children: [
        {
          index: true,
          element: <TestsList />,
        },
        {
          path: 'new',
          element: <TestForm />,
        },
        {
          path: ':id',
          element: <TestDetails />,
        },
        {
          path: 'edit/:id',
          element: <TestForm />,
        },
        {
          path: 'results',
          element: <TestResults />,
        },
      ],
    },
    // Маршруты для управления обучением (HR)
    {
      path: 'analytics',
      element: <TestAnalytics />,
    },
    {
      path: 'learning',
      children: [
        {
          index: true,
          element: <LearningMaterialsList />,
        },
        {
          path: 'new',
          element: <LearningMaterialForm />,
        },
        {
          path: ':id',
          element: <LearningMaterialDetails />,
        },
        {
          path: 'edit/:id',
          element: <LearningMaterialForm />,
        },
        {
          path: 'assignments',
          element: <AssignmentDashboard />,
        },
      ],
    },
    // Маршрут для назначений (главный)
    {
      path: 'assignments',
      element: <AssignmentDashboard />,
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
