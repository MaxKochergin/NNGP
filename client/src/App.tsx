import { RouterProvider } from 'react-router-dom';
import AuthInitializer from './components/auth/AuthInitializer';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <>
      <AuthInitializer />
      <RouterProvider router={AppRouter} />
    </>
  );
}

export default App;
