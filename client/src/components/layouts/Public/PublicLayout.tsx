import { Box } from '@mui/material';
import Footer from './PublicFooter';
import Header from './PublicHeader';

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{maxWidth: '1440px', margin: '0 auto' }}>
      <Header />
      <Box>{children}</Box>
      <Footer />
    </Box>
  );
};

export default PublicLayout;
