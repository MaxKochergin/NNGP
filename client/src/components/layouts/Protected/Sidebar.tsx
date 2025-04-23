// client/src/components/layouts/Protected/Sidebar.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { getNavigationItems } from './navigationConfig';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

export const Sidebar = ({ open, onClose, drawerWidth }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Получаем данные пользователя из Redux store
  const user = useAppSelector((state) => state.auth.user);
  const userRoles = user?.roles || ['candidate']; // Используем роль по умолчанию, если роли не указаны
  
  // Фильтруем элементы навигации по ролям пользователя
  const navigationItems = getNavigationItems(userRoles);
  
  // Проверяем, является ли текущий путь подпутем для элемента навигации
  const isPathActive = (itemPath: string) => {
    // Точное совпадение
    if (location.pathname === itemPath) return true;
    
    // Проверка на подпуть (например, /hr/candidates/123 должен активировать /hr/candidates)
    // Но не должен активировать другие пути, начинающиеся с того же префикса
    // (например, /hr/candidates не должен активировать /hr/employees)
    const pathParts = location.pathname.split('/');
    const itemParts = itemPath.split('/');
    
    if (itemParts.length <= 1) return false;
    
    // Проверяем, совпадают ли первые части пути с путем элемента навигации
    for (let i = 0; i < itemParts.length; i++) {
      if (i >= pathParts.length || pathParts[i] !== itemParts[i]) {
        return false;
      }
    }
    
    return true;
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };
  
  const drawerContent = (
    <>
      <Toolbar /> {/* Пустое пространство высотой с Header */}
      <Box sx={{ overflow: 'auto', py: 2 }}>
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isPathActive(item.path)}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ px: 3, pt: 2 }}>
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.default',
              boxShadow: 1,
            }}
          >
            {/* Здесь можно разместить дополнительную информацию, статус или подсказку */}
            ННГП - Платформа онлайн тестирования
          </Box>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      {/* Мобильная версия (выдвижная) */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
      
      {/* Десктопная версия (постоянная) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;