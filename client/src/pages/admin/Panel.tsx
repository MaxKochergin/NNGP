import { useState } from 'react';
import {
  AccountCircle as AccountCircleIcon,
  Add as AddIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
  SupervisorAccount as SupervisorAccountIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SystemInfo from './system/SystemInfo';
// Компоненты для вкладок
import UsersList from './users/UsersList';

// Тип для вкладок административной панели
type TabValue = 'dashboard' | 'users' | 'system';

// Типы диалогов
type DialogType = 'hr' | 'admin' | null;

// Интерфейс для формы пользователя
interface UserFormData {
  name: string;
  email: string;
  position?: string;
  department?: string;
  password: string;
  confirmPassword: string;
}

// Интерфейс для уведомления
interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

const Panel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState<TabValue>('dashboard');
  const [dialogOpen, setDialogOpen] = useState<DialogType>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    position: '',
    department: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<UserFormData>>({});
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Обработчик изменения вкладки
  const handleTabChange = (event: React.SyntheticEvent, newValue: TabValue) => {
    setActiveTab(newValue);
  };

  // Обработчик открытия диалога
  const handleOpenDialog = (type: DialogType) => {
    setDialogOpen(type);
    // Сбросить данные формы
    setFormData({
      name: '',
      email: '',
      position: '',
      department: '',
      password: '',
      confirmPassword: '',
    });
    setFormErrors({});
  };

  // Обработчик закрытия диалога
  const handleCloseDialog = () => {
    setDialogOpen(null);
  };

  // Обработчик закрытия уведомления
  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Обработчик изменения полей формы
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Очистить ошибку поля при изменении
    if (formErrors[name as keyof UserFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Обработчик изменения выпадающего списка
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const errors: Partial<UserFormData> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Укажите ФИО';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Укажите email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Некорректный формат email';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Введите пароль';
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
      isValid = false;
    }

    if (dialogOpen === 'hr' && !formData.department) {
      errors.department = 'Выберите отдел';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Обработчик отправки формы
  const handleSubmit = () => {
    if (validateForm()) {
      // В реальном приложении здесь был бы API-запрос
      console.log('Отправка данных:', formData);
      console.log('Тип пользователя:', dialogOpen);

      // Успешное создание пользователя
      handleCloseDialog();

      // Показать уведомление об успехе
      setNotification({
        open: true,
        message:
          dialogOpen === 'hr'
            ? 'HR-специалист успешно добавлен в систему'
            : 'Администратор успешно добавлен в систему',
        severity: 'success',
      });
    }
  };

  // Статистические данные для дашборда
  const stats = [
    { title: 'Сотрудники', value: 85, icon: PersonIcon, color: theme.palette.primary.main },
    { title: 'Кандидаты', value: 34, icon: AccountCircleIcon, color: theme.palette.secondary.main },
    {
      title: 'HR-специалисты',
      value: 5,
      icon: SupervisorAccountIcon,
      color: theme.palette.success.main,
    },
    { title: 'Учебные материалы', value: 78, icon: SchoolIcon, color: theme.palette.warning.main },
    {
      title: 'Администраторы',
      value: 2,
      icon: AdminPanelSettingsIcon,
      color: theme.palette.error.main,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 0, sm: 1 } }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h1"
          gutterBottom
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
          Панель администратора
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Разделы администрирования"
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons={isMobile ? 'auto' : false}
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                minWidth: { xs: 100, sm: 120 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                fontWeight: 500,
                textTransform: 'none',
                px: { xs: 1, sm: 2 },
                py: { xs: 1, sm: 1.5 },
                '&.Mui-selected': {
                  fontWeight: 600,
                },
                '& .MuiTab-iconWrapper': {
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  mr: { xs: 0.5, sm: 1 },
                },
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab
              label={isMobile ? 'Дашборд' : 'Дашборд'}
              value="dashboard"
              icon={<DashboardIcon />}
              iconPosition="start"
            />
            <Tab
              label={isMobile ? 'Пользователи' : 'Пользователи'}
              value="users"
              icon={<GroupIcon />}
              iconPosition="start"
            />
            <Tab
              label={isMobile ? 'Система' : 'Система'}
              value="system"
              icon={<SettingsIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Содержимое вкладки "Дашборд" */}
        {activeTab === 'dashboard' && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Статистика системы
            </Typography>

            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            display: 'flex',
                            bgcolor: `${stat.color}20`,
                            color: stat.color,
                            mr: 2,
                          }}
                        >
                          <stat.icon fontSize="large" />
                        </Box>
                        <Typography variant="h4">{stat.value}</Typography>
                      </Box>
                      <Typography variant="h6" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" sx={{ mt: 4, mb: 3 }}>
              Быстрые действия
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={6}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardActionArea
                    sx={{ height: '100%', p: 2 }}
                    onClick={() => handleOpenDialog('hr')}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 2,
                      }}
                    >
                      <SupervisorAccountIcon
                        sx={{ fontSize: 40, color: theme.palette.success.main, mb: 2 }}
                      />
                      <Typography variant="h6">Добавить HR-специалиста</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Создание нового HR-специалиста с правами доступа
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardActionArea
                    sx={{ height: '100%', p: 2 }}
                    onClick={() => handleOpenDialog('admin')}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        p: 2,
                      }}
                    >
                      <AdminPanelSettingsIcon
                        sx={{ fontSize: 40, color: theme.palette.error.main, mb: 2 }}
                      />
                      <Typography variant="h6">Добавить администратора</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Создание нового администратора системы
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Содержимое вкладки "Пользователи" */}
        {activeTab === 'users' && <UsersList />}

        {/* Содержимое вкладки "Система" */}
        {activeTab === 'system' && <SystemInfo />}
      </Paper>

      {/* Диалог добавления HR-специалиста */}
      <Dialog open={dialogOpen === 'hr'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SupervisorAccountIcon sx={{ mr: 1, color: theme.palette.success.main }} />
            Добавление HR-специалиста
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="ФИО"
                fullWidth
                value={formData.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleFormChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="position"
                label="Должность"
                fullWidth
                value={formData.position}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.department} required>
                <InputLabel>Отдел</InputLabel>
                <Select
                  name="department"
                  value={formData.department}
                  label="Отдел"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="HR-отдел">HR-отдел</MenuItem>
                  <MenuItem value="Отдел подбора персонала">Отдел подбора персонала</MenuItem>
                  <MenuItem value="Отдел обучения">Отдел обучения</MenuItem>
                </Select>
                {formErrors.department && <FormHelperText>{formErrors.department}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Пароль"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleFormChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="confirmPassword"
                label="Подтверждение пароля"
                type="password"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleFormChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
          >
            Создать HR-специалиста
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог добавления администратора */}
      <Dialog open={dialogOpen === 'admin'} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AdminPanelSettingsIcon sx={{ mr: 1, color: theme.palette.error.main }} />
            Добавление администратора системы
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            Внимание! Администратор будет иметь полный доступ ко всем функциям системы.
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="ФИО"
                fullWidth
                value={formData.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleFormChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="position"
                label="Должность"
                fullWidth
                value={formData.position}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Пароль"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleFormChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="confirmPassword"
                label="Подтверждение пароля"
                type="password"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleFormChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button variant="contained" color="error" startIcon={<SaveIcon />} onClick={handleSubmit}>
            Создать администратора
          </Button>
        </DialogActions>
      </Dialog>

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

export default Panel;
