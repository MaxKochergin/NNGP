import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { MockAuthProvider } from './components/auth/MockAuthProvider';
import { AppRouter } from './routes/AppRouter';

function App() {
  return (
    <MockAuthProvider>
      <RouterProvider router={AppRouter} />
    </MockAuthProvider>
  );
}

export default App;
