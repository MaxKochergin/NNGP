import { Code, Person, School, Work } from '@mui/icons-material';
import { Box, Divider, Paper, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

function HrProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  // Добавляем breakpoint для очень маленьких экранов (375px и меньше)
  const isVerySmall = useMediaQuery('(max-width:375px)');

  // Определяем текущую активную вкладку на основе пути
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/experience')) return 1;
    if (path.includes('/education')) return 2;
    if (path.includes('/skills')) return 3;
    return 0; // По умолчанию - профиль
  };

  const activeTab = getActiveTab();

  // Переключение вкладок
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/app/hr/profile/basicInfo', { replace: true });
        break;
      case 1:
        navigate('/app/hr/profile/experience', { replace: true });
        break;
      case 2:
        navigate('/app/hr/profile/education', { replace: true });
        break;
      case 3:
        navigate('/app/hr/profile/skills', { replace: true });
        break;
    }
  };

  // Конфигурация табов для разных размеров экрана
  const tabsConfig = [
    {
      icon: <Person />,
      label: 'Основная информация',
      shortLabel: 'Профиль',
      mobileLabel: 'Инфо',
      verySmallLabel: 'Инфо',
    },
    {
      icon: <Work />,
      label: 'Опыт работы',
      shortLabel: 'Опыт',
      mobileLabel: 'Опыт',
      verySmallLabel: 'Опыт',
    },
    {
      icon: <School />,
      label: 'Образование',
      shortLabel: 'Образование',
      mobileLabel: 'Учеба',
      verySmallLabel: 'Учеба',
    },
    {
      icon: <Code />,
      label: 'Навыки',
      shortLabel: 'Навыки',
      mobileLabel: 'Навыки',
      verySmallLabel: 'Навыки',
    },
  ];

  // Функция для получения подходящего лейбла
  const getTabLabel = (config: (typeof tabsConfig)[0]) => {
    if (isVerySmall) return config.verySmallLabel;
    if (isMobile) return config.mobileLabel;
    if (isTablet) return config.shortLabel;
    return config.label;
  };

  return (
    <Paper
      sx={{
        p: { xs: 0, sm: 2 },
        mb: { xs: 2, sm: 3 },
        borderRadius: { xs: 0, sm: 1, md: 2 },
        boxShadow: { xs: 0, sm: 1, md: 2 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          px: { xs: isVerySmall ? 1 : 2, sm: 0 },
          pt: { xs: isVerySmall ? 1.5 : 2, sm: 0 },
        }}
      >
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          gutterBottom
          sx={{
            fontWeight: 'medium',
            mb: { xs: isVerySmall ? 1.5 : 2, sm: 2 },
            fontSize: {
              xs: isVerySmall ? '1.1rem' : '1.25rem',
              sm: '1.5rem',
              md: '2rem',
            },
          }}
        >
          Мой профиль
        </Typography>
        <Divider
          sx={{
            mb: { xs: isVerySmall ? 1.5 : 2, sm: 2 },
            mx: { xs: isVerySmall ? -1 : -2, sm: 0 },
          }}
        />
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="Профиль HR-специалиста"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          mb: { xs: isVerySmall ? 2 : 3, sm: 3 },
          mx: { xs: 0, sm: 0 },
          '& .MuiTabs-flexContainer': {
            px: { xs: isVerySmall ? 0.5 : 1, sm: 0 },
          },
          '& .MuiTabs-scrollButtons': {
            width: { xs: isVerySmall ? 32 : 40, sm: 48 },
            '&.Mui-disabled': {
              opacity: 0.3,
            },
          },
          '& .MuiTab-root': {
            minWidth: {
              xs: isVerySmall ? 65 : 80,
              sm: 120,
              md: 140,
            },
            maxWidth: {
              xs: isVerySmall ? 90 : 120,
              sm: 200,
            },
            px: {
              xs: isVerySmall ? 0.5 : 1,
              sm: 2,
            },
            py: {
              xs: isVerySmall ? 1 : 1.5,
              sm: 2,
            },
            fontSize: {
              xs: isVerySmall ? '0.65rem' : '0.75rem',
              sm: '0.875rem',
            },
            fontWeight: 500,
            textTransform: 'none',
            '&.Mui-selected': {
              fontWeight: 600,
            },
            '& .MuiTab-iconWrapper': {
              fontSize: {
                xs: isVerySmall ? '1rem' : '1.2rem',
                sm: '1.5rem',
              },
              mb: {
                xs: isVerySmall ? 0.25 : 0.5,
                sm: 1,
              },
            },
          },
          '& .MuiTabs-indicator': {
            height: isVerySmall ? 2 : 3,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        {tabsConfig.map((config, index) => (
          <Tab
            key={index}
            icon={config.icon}
            label={getTabLabel(config)}
            iconPosition={isMobile ? 'top' : 'start'}
            aria-label={config.label}
            sx={{
              flexDirection: isMobile ? 'column' : 'row',
              gap: { xs: 0, sm: 1 },
            }}
          />
        ))}
      </Tabs>

      <Box
        sx={{
          py: { xs: isVerySmall ? 0.5 : 1, sm: 2 },
          px: { xs: isVerySmall ? 1 : 2, sm: 0 },
          minHeight: {
            xs: isVerySmall ? 'calc(100vh - 280px)' : 'calc(100vh - 300px)',
            sm: 'auto',
          },
        }}
      >
        <Outlet />
      </Box>
    </Paper>
  );
}

export default HrProfile;
