import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './PublicRoutes';
import { privateRoutes } from './PrivateRoutes';


export const AppRouter = createBrowserRouter([
  ...publicRoutes,
  ...privateRoutes,
  {
    path: '*',
    element: <div>Not Found</div>,
  },
]);
