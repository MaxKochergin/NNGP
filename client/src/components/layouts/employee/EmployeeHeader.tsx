import { useState } from 'react';
import {
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import logo from '../../../assets/images/logoNNGP.svg';
import { logout } from '../../../features/auth/authSlice';
import Image from '../../common/Image';

interface EmployeeHeaderProps {
  onToggleSidebar: () => void;
  isMobileView: boolean;
}

export const EmployeeHeader = ({ onToggleSidebar, isMobileView }: EmployeeHeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Получаем данные пользователя из Redux store
  const user = useAppSelector(state => state.auth.user);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate('/auth/login');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate('/app/employee/profile');
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate('/app/settings');
  };

  // Функция для получения инициалов пользователя
  const getUserInitials = () => {
    if (!user) return '?';

    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }

    if (user.firstName) {
      return user.firstName[0];
    }

    if (user.email) {
      return user.email[0].toUpperCase();
    }

    return '?';
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        boxShadow: 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        {isMobileView && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onToggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src={logo}
            alt="ННГП"
            width={isMobileView ? 32 : 42}
            height={isMobileView ? 32 : 42}
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: { xs: 'none', sm: 'block' },
              ml: 1,
              fontWeight: 600,
            }}
          >
            ННГП | Сотрудник
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
            {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
          </Typography>

          <IconButton
            onClick={handleMenuOpen}
            size="small"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              {getUserInitials()}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              mt: 1.5,
              width: 200,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          }}
        >
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Профиль
          </MenuItem>
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Настройки
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Выйти
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default EmployeeHeader;
