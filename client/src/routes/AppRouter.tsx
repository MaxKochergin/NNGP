import { createBrowserRouter } from 'react-router-dom';
import { privateRoutes } from './PrivateRoutes';
import { publicRoutes } from './PublicRoutes';

// Создаем роутер для приложения
// Публичные маршруты должны идти перед приватными для правильного разрешения
export const AppRouter = createBrowserRouter([
  ...publicRoutes,
  ...privateRoutes,
  {
    path: '*',
    element: <div>Not Found</div>,
  },
]);
