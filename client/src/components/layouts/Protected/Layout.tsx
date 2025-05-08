// client/src/components/layouts/Protected/Layout.tsx
import { ReactNode, useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface ProtectedLayoutProps {
  children: ReactNode;
}

const drawerWidth = 260;

export const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const theme = useTheme();
  const isMobileView = useMediaQuery('(max-width:600px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header onToggleSidebar={handleDrawerToggle} isMobileView={isMobileView} />

      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        drawerWidth={drawerWidth}
        isMobileView={isMobileView}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: isMobileView ? '100%' : `calc(100% - ${drawerWidth}px)`,
          maxWidth: '100%',
        }}
      >
        <Toolbar /> {/* Пустое пространство высотой с Header */}
        {children}
      </Box>
    </Box>
  );
};

export default ProtectedLayout;
