import { Code, Person, School, Work } from '@mui/icons-material';
import { Box, Divider, Paper, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

function CandidateProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
        navigate('/app/candidate/profile/basicInfo', { replace: true });
        break;
      case 1:
        navigate('/app/candidate/profile/experience', { replace: true });
        break;
      case 2:
        navigate('/app/candidate/profile/education', { replace: true });
        break;
      case 3:
        navigate('/app/candidate/profile/skills', { replace: true });
        break;
    }
  };

  return (
    <Paper
      sx={{
        p: { xs: 1, sm: 2 },
        pl: 0,
        mb: 3,
        borderRadius: { xs: 0, sm: 1, md: 2 },
        boxShadow: { xs: 0, sm: 1, md: 2 },
      }}
    >
      <Typography
        variant={isMobile ? 'h5' : 'h4'}
        gutterBottom
        sx={{ fontWeight: 'medium', mb: 2 }}
      >
        Мой профиль
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="Профиль кандидата"
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons={isMobile ? 'auto' : undefined}
        allowScrollButtonsMobile
        sx={{
          mb: 3,
          ml: 0,
          pl: 1,
          '& .MuiTabs-flexContainer': {
            justifyContent: isMobile ? 'flex-start' : 'center',
          },
          '& .MuiTab-root': {
            minWidth: { xs: 'auto', sm: 120 },
            px: { xs: 1, sm: 2 },
          },
        }}
      >
        <Tab
          icon={<Person />}
          label={isMobile ? undefined : 'Основная информация'}
          iconPosition={isTablet && !isMobile ? 'top' : 'start'}
          aria-label="Основная информация"
        />
        <Tab
          icon={<Work />}
          label={isMobile ? undefined : 'Опыт работы'}
          iconPosition={isTablet && !isMobile ? 'top' : 'start'}
          aria-label="Опыт работы"
        />
        <Tab
          icon={<School />}
          label={isMobile ? undefined : 'Образование'}
          iconPosition={isTablet && !isMobile ? 'top' : 'start'}
          aria-label="Образование"
        />
        <Tab
          icon={<Code />}
          label={isMobile ? undefined : 'Навыки'}
          iconPosition={isTablet && !isMobile ? 'top' : 'start'}
          aria-label="Навыки"
        />
      </Tabs>

      <Box sx={{ py: { xs: 1, sm: 2 }, pl: 1 }}>
      <Outlet />
      </Box>
    </Paper>
  );
}

export default CandidateProfile;
