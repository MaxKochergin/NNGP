// client/src/routes/PrivateRoutes.tsx
import { RouteObject } from 'react-router-dom';
import { AuthGuard } from '../components/auth/AuthGuard';
// import AdminPanel from '../pages/admin/Panel';
// import RolesManagement from '../pages/admin/RolesManagement';
// import SystemSettings from '../pages/admin/SystemSettings';
// import AnalyticsDetails from '../pages/analytics/Details';
// import AnalyticsReports from '../pages/analytics/Reports';
// import CandidateProfile from '../pages/candidate/Profile';
// import EmployeeProfile from '../pages/employee/Profile';
// import CandidateDetails from '../pages/hr/CandidateDetails';
// import Candidates from '../pages/hr/Candidates';
// import EmployeeDetails from '../pages/hr/EmployeeDetails';
// import Employees from '../pages/hr/Employees';
// import HRProfile from '../pages/hr/Profile';
// import LearningMaterials from '../pages/learning/Materials';
// import Settings from '../pages/settings/Settings';
// import AvailableTests from '../pages/tests/AvailableTests';
// import TestDetails from '../pages/tests/TestDetails';
// import TestHistory from '../pages/tests/TestHistory';

export const privateRoutes: RouteObject[] = [
  // Профили по ролям
  {
    path: '/candidate',
    children: [
      {
        path: 'profile',
        element: (
          <AuthGuard requiredRoles={['candidate']}>
            <CandidateProfile />
          </AuthGuard>
        ),
      },
    ],
  },
//   {
//     path: '/employee',
//     children: [
//       {
//         path: 'profile',
//         element: (
//           <AuthGuard requiredRoles={['employee']}>
//             <EmployeeProfile />
//           </AuthGuard>
//         ),
//       },
//     ],
//   },
//   {
//     path: '/hr',
//     children: [
//       {
//         path: 'profile',
//         element: (
//           <AuthGuard requiredRoles={['hr', 'admin']}>
//             <HRProfile />
//           </AuthGuard>
//         ),
//       },
//       {
//         path: 'candidates',
//         element: (
//           <AuthGuard requiredRoles={['hr', 'admin']}>
//             <Candidates />
//           </AuthGuard>
//         ),
//       },
//       {
//         path: 'candidates/:candidateId',
//         element: (
//           <AuthGuard requiredRoles={['hr', 'admin']}>
//             <CandidateDetails />
//           </AuthGuard>
//         ),
//       },
//       {
//         path: 'employees',
//         element: (
//           <AuthGuard requiredRoles={['hr', 'admin']}>
//             <Employees />
//           </AuthGuard>
//         ),
//       },
//       {
//         path: 'employees/:employeeId',
//         element: (
//           <AuthGuard requiredRoles={['hr', 'admin']}>
//             <EmployeeDetails />
//           </AuthGuard>
//         ),
//       },
//     ],
//   },

//   // Общие настройки
//   {
//     path: '/settings',
//     element: (
//       <AuthGuard>
//         <Settings />
//       </AuthGuard>
//     ),
//   },

//   // Тесты
//   {
//     path: '/tests',
//     children: [
//       {
//         path: 'available',
//         element: (
//           <AuthGuard requiredRoles={['candidate', 'employee']}>
//             <AvailableTests />
//           </AuthGuard>
//         ),
//       },
//       {
//         path: 'history',
//         element: (
//           <AuthGuard>
//             <TestHistory />
//           </AuthGuard>
//         ),
//       },
//       {
//         path: ':testId',
//         element: (
//           <AuthGuard>
//             <TestDetails />
//           </AuthGuard>
//         ),
//       },
//     ],
//   },

//   // Учебные материалы
//   {
//     path: '/learning',
//     children: [
//       {
//         path: 'materials',
//         element: (
//           <AuthGuard requiredRoles={['candidate', 'employee']}>
//             <LearningMaterials />
//           </AuthGuard>
//         ),
//       },
//     ],
//   },

//   // Аналитика
//   {
//     path: '/analytics',
//     children: [
//       {
//         path: 'reports',
//         element: (
//           <AuthGuard requiredRoles={['hr', 'admin']}>
//             <AnalyticsReports />
//           </AuthGuard>
//         ),
//       },
//       {
//         path: 'details/:reportId',
//         element: (
//           <AuthGuard requiredRoles={['hr', 'admin']}>
//             <AnalyticsDetails />
//           </AuthGuard>
//         ),
//       },
//     ],
//   },

//   // Администрирование
//   {
//     path: '/admin',
//     children: [
//       {
//         path: 'panel',
//         element: (
//           <AuthGuard requiredRoles={['admin']}>
//             <AdminPanel />
//           </AuthGuard>
//         ),
//       },
//       {
//         path: 'roles',
//         element: (
//           <AuthGuard requiredRoles={['admin']}>
//             <RolesManagement />
//           </AuthGuard>
//         ),
//       },
//       {
//         path: 'settings',
//         element: (
//           <AuthGuard requiredRoles={['admin']}>
//             <SystemSettings />
//           </AuthGuard>
//         ),
//       },
//     ],
//   },
];
