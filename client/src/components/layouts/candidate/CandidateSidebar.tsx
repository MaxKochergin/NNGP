import {
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
import candidateNavigationItems from './candidateNavigationConfig';

interface CandidateSidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
  isMobileView: boolean;
}

export const CandidateSidebar = ({
  open,
  onClose,
  drawerWidth,
  isMobileView,
}: CandidateSidebarProps) => {
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

  const drawerContent = (
    <>
      <Toolbar /> {/* Пустое пространство высотой с Header */}
      <Box sx={{ overflow: 'auto', py: 2 }}>
        <List>
          {candidateNavigationItems.map(item => (
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
            {/* Информация о прогрессе кандидата */}
            Статус: Кандидат
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

export default CandidateSidebar;
