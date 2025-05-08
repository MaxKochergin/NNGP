// client/src/routes/PublicRoutes.tsx
import { RouteObject } from 'react-router-dom';
// import { PublicRedirect } from '../components/auth/PublicRedirect';
import ForgotPassword from '../pages/auth/FogotPassword';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Landing from '../pages/landing/Landing';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/auth/register',
    element: <Register />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPassword />,
  },
];
