import {
  Badge,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import adminNavigationItems from './adminNavigationConfig';

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
  isMobileView: boolean;
}

export const AdminSidebar = ({ open, onClose, drawerWidth, isMobileView }: AdminSidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  // Проверяем, является ли текущий путь подпутем для элемента навигации
  const isPathActive = (itemPath: string) => {
    // Точное совпадение
    if (location.pathname === itemPath) return true;

    // Проверка на подпуть
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
    if (isMobileView) {
      onClose();
    }
  };

  // Пример отображения бейджа для элементов, требующих внимания
  const getItemBadge = (path: string) => {
    // В реальном приложении здесь будет логика получения бейджей из данных
    if (path === '/app/admin/logs') {
      return (
        <Badge
          color="error"
          badgeContent={3}
          sx={{
            '& .MuiBadge-badge': {
              right: -5,
              top: 12,
            },
          }}
        />
      );
    }
    return null;
  };

  const drawerContent = (
    <>
      <Toolbar /> {/* Пустое пространство высотой с Header */}
      <Box sx={{ overflow: 'auto', py: 2 }}>
        <List>
          {adminNavigationItems.map(item => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={isPathActive(item.path)}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.lighter',
                    color: 'primary.dark',
                    '&:hover': {
                      bgcolor: 'primary.lighter',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.title} />
                {getItemBadge(item.path)}
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
              bgcolor: theme.palette.error.light,
              color: theme.palette.error.contrastText,
              boxShadow: 1,
            }}
          >
            {/* Информация для администратора */}
            Системный статус: Администратор
          </Box>
        </Box>
      </Box>
    </>
  );

  return (
    <Drawer
      variant={isMobileView ? 'temporary' : 'permanent'}
      open={isMobileView ? open : true}
      onClose={isMobileView ? onClose : undefined}
      ModalProps={isMobileView ? { keepMounted: true } : undefined}
      sx={{
        display: { xs: isMobileView ? 'block' : 'none', sm: !isMobileView ? 'block' : 'none' },
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default AdminSidebar;
