import { useEffect, useState } from 'react';
import {
  AccessTime as AccessTimeIcon,
  DarkMode as DarkModeIcon,
  Edit as EditIcon,
  Language as LanguageIcon,
  LockOutlined as LockIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setTheme, toggleTheme } from '../../features/theme/themeSlice';

// Интерфейс для настроек пользователя
interface UserSettings {
  email: string;
  language: string;
  darkMode: boolean;
  emailNotifications: boolean;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Интерфейс для вкладок
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Компонент панели вкладки
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

const Settings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Получаем диспетчер Redux
  const dispatch = useAppDispatch();

  // Получаем пользователя и тему из Redux-стора
  const user = useAppSelector(state => state.auth.user);
  const themeMode = useAppSelector(state => state.theme.mode);

  // Состояние для вкладок
  const [tabValue, setTabValue] = useState(0);

  // Состояние для настроек пользователя
  const [settings, setSettings] = useState<UserSettings>({
    email: user?.email || '',
    language: 'ru',
    darkMode: themeMode === 'dark',
    emailNotifications: true,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Состояние для отображения паролей
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Состояние для загрузки
  const [loading, setLoading] = useState(false);

  // Состояния для уведомлений
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Состояние для ошибок валидации
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    email: '',
  });

  // Обработчик изменения вкладки
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Обработчик изменения настройки переключателя (switch)
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    // Если меняется настройка темы, обновляем Redux-стор
    if (name === 'darkMode') {
      dispatch(setTheme(checked ? 'dark' : 'light'));
    }

    setSettings({
      ...settings,
      [name]: checked,
    });
  };

  // Синхронизируем состояние с Redux при изменении темы
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      darkMode: themeMode === 'dark',
    }));
  }, [themeMode]);

  // Обработчик изменения языка
  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSettings({
      ...settings,
      language: event.target.value as string,
    });
  };

  // Обработчик изменения полей ввода
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSettings({
      ...settings,
      [name]: value,
    });

    // Сброс ошибок при изменении поля
    if (Object.keys(errors).includes(name)) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Обработчик переключения видимости пароля
  const handleTogglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  // Валидация формы изменения пароля
  const validatePasswordForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!settings.currentPassword) {
      newErrors.currentPassword = 'Введите текущий пароль';
      isValid = false;
    }

    if (!settings.newPassword) {
      newErrors.newPassword = 'Введите новый пароль';
      isValid = false;
    } else if (settings.newPassword.length < 8) {
      newErrors.newPassword = 'Пароль должен содержать не менее 8 символов';
      isValid = false;
    }

    if (!settings.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите новый пароль';
      isValid = false;
    } else if (settings.newPassword !== settings.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Обработчик отправки формы изменения пароля
  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);

    // Имитация запроса к API
    setTimeout(() => {
      setLoading(false);
      setNotification({
        open: true,
        message: 'Пароль успешно изменен',
        severity: 'success',
      });

      // Сброс полей пароля
      setSettings({
        ...settings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1500);
  };

  // Обработчик отправки формы основных настроек
  const handleGeneralSettingsSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    // Имитация запроса к API
    setTimeout(() => {
      setLoading(false);
      setNotification({
        open: true,
        message: 'Настройки успешно сохранены',
        severity: 'success',
      });
    }, 1000);
  };

  // Обработчик закрытия уведомления
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <SettingsIcon
            sx={{
              fontSize: { xs: 24, sm: 32 },
              color: 'primary.main',
              mr: { xs: 0, sm: 2 },
              mb: { xs: 1, sm: 0 },
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            }}
          >
            Настройки
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Вкладки настроек */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            allowScrollButtonsMobile
            aria-label="настройки аккаунта"
            sx={{
              '& .MuiTabs-scrollButtons': {
                '&.Mui-disabled': {
                  opacity: 0.3,
                },
              },
            }}
          >
            <Tab
              icon={<PersonIcon />}
              iconPosition="start"
              label={isMobile ? 'Основные' : 'Основные'}
              {...a11yProps(0)}
              sx={{
                minWidth: isMobile ? 120 : 'auto',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            />
            <Tab
              icon={<LockIcon />}
              iconPosition="start"
              label={isMobile ? 'Безопасность' : 'Безопасность'}
              {...a11yProps(1)}
              sx={{
                minWidth: isMobile ? 120 : 'auto',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            />
            <Tab
              icon={<NotificationsIcon />}
              iconPosition="start"
              label={isMobile ? 'Уведомления' : 'Уведомления'}
              {...a11yProps(2)}
              sx={{
                minWidth: isMobile ? 120 : 'auto',
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            />
          </Tabs>
        </Box>

        {/* Панель основных настроек */}
        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleGeneralSettingsSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Основные настройки
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  fullWidth
                  disabled
                  helperText="Email нельзя изменить"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="language-select-label">Язык интерфейса</InputLabel>
                  <Select
                    labelId="language-select-label"
                    id="language-select"
                    value={settings.language}
                    label="Язык интерфейса"
                    onChange={handleLanguageChange}
                    startAdornment={
                      <InputAdornment position="start">
                        <LanguageIcon color="primary" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="ru">Русский</MenuItem>
                    <MenuItem value="en">English</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Card sx={{ bgcolor: 'background.default', mb: 2 }}>
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.darkMode}
                          onChange={handleSwitchChange}
                          name="darkMode"
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DarkModeIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography>Темная тема</Typography>
                        </Box>
                      }
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      Переключение между светлой и темной темой интерфейса
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    Сохранить изменения
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Панель настроек безопасности */}
        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handlePasswordSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Изменение пароля
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Текущий пароль"
                  name="currentPassword"
                  type={showPassword.current ? 'text' : 'password'}
                  value={settings.currentPassword}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!errors.currentPassword}
                  helperText={errors.currentPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility('current')}
                          edge="end"
                        >
                          {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Новый пароль"
                  name="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  value={settings.newPassword}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!errors.newPassword}
                  helperText={errors.newPassword || 'Минимум 8 символов'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility('new')}
                          edge="end"
                        >
                          {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Подтверждение пароля"
                  name="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  value={settings.confirmPassword}
                  onChange={handleInputChange}
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility('confirm')}
                          edge="end"
                        >
                          {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  >
                    Изменить пароль
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        {/* Панель настроек уведомлений */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Настройки уведомлений
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ bgcolor: 'background.default', mb: 2 }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.emailNotifications}
                        onChange={handleSwitchChange}
                        name="emailNotifications"
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NotificationsIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography>Email-уведомления</Typography>
                      </Box>
                    }
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1 }}
                  >
                    Получать администраторские уведомления о безопасности системы, действиях
                    пользователей и критических событиях на email
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                Типы уведомлений
              </Typography>
              <Divider sx={{ my: 1 }} />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Входы администраторов в систему"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Изменения прав пользователей"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Регистрация новых пользователей"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Системные предупреждения и ошибки"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Резервное копирование и обновление системы"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Критическая нагрузка на сервер"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={() => {
                    setNotification({
                      open: true,
                      message: 'Настройки уведомлений администратора успешно сохранены',
                      severity: 'success',
                    });
                  }}
                >
                  Сохранить настройки
                </Button>
              </Box>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

      {/* Снэкбар для уведомлений */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings;
