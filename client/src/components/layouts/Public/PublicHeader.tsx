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
  ListItemButton,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/images/logoNNGP.svg';
import Image from '../../common/Image';
import NavigationButton from '../../common/SmartButton/NavigationButton';

export const Header = () => {
  // Состояние для отслеживания открытия/закрытия мобильного меню
  const navigate = useNavigate();
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
  // Функция для навигации с закрытием меню
  const handleNavigate = (path: string) => {
    handleCloseMenu(); // Сначала закрываем меню
    navigate(path); // Затем выполняем навигацию
  };

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar>
        {/* Левая группа элементов */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Image src={logo} alt="logo" width={42} height={42} />
          {/* Кнопка "О нас" видна только на десктопе */}
          {!isMobile && <NavigationButton href="https://xn--c1ataj.xn--p1ai/company/">О нас</NavigationButton>}
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
            <NavigationButton to="/auth/login">Войти</NavigationButton>
            <NavigationButton color="error" to="/auth/register" >
              Зарегистрироваться
            </NavigationButton>
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
            <ListItemButton
              component="a"
              href="https://xn--c1ataj.xn--p1ai/company/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCloseMenu}
            >
              <ListItemText primary="О нас" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigate('/auth/login')}>
              <ListItemText primary="Войти" />
            </ListItemButton>

            <ListItemButton
              onClick={() => handleNavigate('/auth/register')}
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
