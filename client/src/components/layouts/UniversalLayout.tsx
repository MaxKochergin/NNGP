import { ReactNode, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { Header } from './Protected/Header';
import { Sidebar } from './Protected/Sidebar';

interface UniversalLayoutProps {
  children: ReactNode;
}

/**
 * Универсальный лейаут для всех типов пользователей
 * Динамически определяет доступные элементы навигации на основе ролей пользователя
 */
export function UniversalLayout({ children }: UniversalLayoutProps) {
  const theme = useTheme();
  const isMobileView = useMediaQuery(theme.breakpoints.down('sm'));
  const user = useAppSelector(state => state.auth.user);

  // Настройки сайдбара
  const drawerWidth = 260;
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
          p: 3,
          width: isMobileView ? '100%' : `calc(100% - ${drawerWidth}px)`,
          maxWidth: '100%',
        }}
      >
        <Box sx={{ height: theme.spacing(8) }} /> {/* Отступ под хедер */}
        {children}
      </Box>
    </Box>
  );
}

export default UniversalLayout;
