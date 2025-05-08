// client/src/components/layouts/hr/HrLayout.tsx
import { ReactNode, useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import HrHeader from './HrHeader';
import HrSidebar from './HrSidebar';

interface HrLayoutProps {
  children?: ReactNode;
}

const drawerWidth = 260;

export const HrLayout = ({ children }: HrLayoutProps) => {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Верхняя панель */}
      <HrHeader onToggleSidebar={handleDrawerToggle} isMobileView={isMobileView} />

      {/* Боковая панель */}
      <HrSidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        drawerWidth={drawerWidth}
        isMobileView={isMobileView}
      />

      {/* Основное содержимое */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: isMobileView ? '100%' : `calc(100% - ${drawerWidth}px)`,
          maxWidth: '100%',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar /> {/* Пустое пространство высотой с Header */}
        {children || <Outlet />}
      </Box>
    </Box>
  );
};

export default HrLayout;
 