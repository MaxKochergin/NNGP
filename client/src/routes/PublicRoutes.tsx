// client/src/routes/PublicRoutes.tsx
import { RouteObject } from 'react-router-dom';
import { PublicRedirect } from '../components/auth/PublicRedirect';
import ForgotPassword from '../pages/auth/FogotPassword';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Landing from '../pages/landing/Landing';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: (
      <PublicRedirect>
        <Landing />
      </PublicRedirect>
    ),
  },
  {
    path: '/auth/login',
    element: (
      <PublicRedirect>
        <Login />
      </PublicRedirect>
    ),
  },
  {
    path: '/auth/register',
    element: (
      <PublicRedirect>
        <Register />
      </PublicRedirect>
    ),
  },
  {
    path: '/auth/forgot-password',
    element: (
      <PublicRedirect>
        <ForgotPassword />
      </PublicRedirect>
    ),
  },
];
