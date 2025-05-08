import { Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { ProtectedLayout } from '../../components/layouts/Protected/Layout';

function Candidate() {
  const user = useAppSelector(state => state.auth.user);
  ;

  return (
    <ProtectedLayout>
      <Typography variant="h4">
        Здравствуйте, {user?.firstName} {user?.lastName}
      </Typography>
      <Outlet />
    </ProtectedLayout>
  );
}

export default Candidate;
