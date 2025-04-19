// components/layouts/public/Header.tsx
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import logo from '../../../assets/images/logoNNGP.svg';
import Button from '../../common/Button';
import Image from '../../common/Image';

export const Header = () => {
  // Состояние для отслеживания открытия/закрытия мобильного меню
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Функция для открытия мобильного меню
  const handleOpenMenu = () => {
    setMobileMenuOpen(true);
  };

  // Функция для закрытия мобильного меню
  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        {/* Левая группа элементов */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Image src={logo} alt="logo" width={42} height={42} />
          {/* Кнопка "О нас" видна только на десктопе */}
          {!isMobile && <Button>О нас</Button>}
        </Box>

        {/* Пространство в центре */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Правая группа элементов - разное содержимое для мобильных и десктопа */}
        {isMobile ? (
          // Бургер-меню только для мобильных
          <IconButton
            color="inherit"
            aria-label="меню"
            onClick={handleOpenMenu} // Активация кнопки бургера
          >
            <MenuIcon />
          </IconButton>
        ) : (
          // Кнопки только для десктопа
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button>Войти</Button>
            <Button color="error">Зарегистрироваться</Button>
          </Box>
        )}

        {/* Мобильное меню */}
        <Drawer
          anchor="right"
          open={mobileMenuOpen}
          onClose={handleCloseMenu} // Закрытие при клике вне меню
          sx={{
            '& .MuiDrawer-paper': {
              width: '70%',
              maxWidth: 300,
              boxSizing: 'border-box',
              padding: 2,
            },
          }}
        >
          {/* Шапка мобильного меню */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Image src={logo} alt="logo" width={32} height={32} />
            <IconButton onClick={handleCloseMenu}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Пункты мобильного меню */}
          <List>
            <ListItemButton onClick={handleCloseMenu}>
              <ListItemText primary="О нас" />
            </ListItemButton>

            <ListItemButton onClick={handleCloseMenu}>
              <ListItemText primary="Войти" />
            </ListItemButton>

            <ListItemButton
              onClick={handleCloseMenu}
              sx={{
                bgcolor: 'error.main',
                color: 'white',
                borderRadius: 1,
                mt: 1,
                '&:hover': {
                  bgcolor: 'error.dark',
                },
              }}
            >
              <ListItemText primary="Зарегистрироваться" />
            </ListItemButton>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
