import { useEffect, useState } from 'react';
import {
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';

// Типы для уведомлений
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  link?: string;
  category: 'test' | 'profile' | 'system';
}

// Временные тестовые данные
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Новая заявка на вакансию',
    message:
      'Получена новая заявка на вакансию "Ведущий инженер-конструктор". Проверьте резюме и назначьте собеседование',
    type: 'info',
    timestamp: '2025-04-01T10:30:00',
    isRead: false,
    link: '/app/hr/candidates',
    category: 'system',
  },
  {
    id: '2',
    title: 'Результаты тестирования кандидата',
    message:
      'Кандидат Иванов А.С. завершил тест "Проектирование железобетонных конструкций" с результатом 85%',
    type: 'success',
    timestamp: '2025-04-08T14:15:00',
    isRead: true,
    link: '/app/hr/tests/results',
    category: 'test',
  },
  {
    id: '3',
    title: 'Срок истечения испытательного срока',
    message:
      'Через 5 дней истекает испытательный срок у сотрудника Петрова И.К. (инженер-проектировщик). Необходимо подготовить оценку',
    type: 'warning',
    timestamp: '2025-04-05T09:00:00',
    isRead: false,
    link: '/app/hr/employees',
    category: 'profile',
  },
  {
    id: '4',
    title: 'Учебный план утвержден',
    message:
      'Учебный план по BIM-моделированию для отдела проектирования утвержден и готов к реализации',
    type: 'info',
    timestamp: '2025-04-10T18:45:00',
    isRead: true,
    link: '/app/hr/learning/management',
    category: 'system',
  },
  {
    id: '5',
    title: 'Срочное тестирование',
    message:
      'Руководство запросило срочное тестирование новых сотрудников отдела ПГС по нормативной документации. Необходимо организовать до конца недели.',
    type: 'warning',
    timestamp: '2025-04-12T11:30:00',
    isRead: false,
    link: '/app/hr/tests/management',
    category: 'test',
  },
  {
    id: '6',
    title: 'Аналитика по найму за квартал',
    message:
      'Необходимо подготовить квартальный отчет по эффективности найма технических специалистов для совещания руководителей',
    type: 'error',
    timestamp: '2025-04-15T16:20:00',
    isRead: false,
    link: '/app/hr/analytics',
    category: 'profile',
  },
  {
    id: '7',
    title: 'Новый кандидат прошел предварительный отбор',
    message:
      'Кандидат на должность "Инженер-проектировщик ОВиК" успешно прошел предварительный отбор. Требуется организовать техническое интервью',
    type: 'success',
    timestamp: '2025-04-13T13:25:00',
    isRead: false,
    link: '/app/hr/candidates',
    category: 'profile',
  },
  {
    id: '8',
    title: 'Обновление базы тестовых заданий',
    message:
      'В системе обновлена база тестовых заданий для оценки компетенций инженеров-строителей. Добавлено 35 новых вопросов',
    type: 'info',
    timestamp: '2025-04-14T09:15:00',
    isRead: true,
    link: '/app/hr/tests/management',
    category: 'test',
  },
  {
    id: '9',
    title: 'Запрос на обучение от руководителя отдела',
    message:
      'Руководитель отдела проектирования запросил организацию корпоративного обучения по теме "Расчет конструкций на сейсмические воздействия"',
    type: 'info',
    timestamp: '2025-04-11T10:10:00',
    isRead: false,
    link: '/app/hr/learning/management',
    category: 'system',
  },
  {
    id: '10',
    title: 'Необходимо провести оценку компетенций',
    message:
      'Для команды проекта "Жилой комплекс Заречье" требуется провести оценку компетенций сотрудников по новым нормативам',
    type: 'warning',
    timestamp: '2025-04-09T15:40:00',
    isRead: false,
    link: '/app/hr/tests/management',
    category: 'test',
  },
];

// Преобразование типа уведомления в соответствующие стили и иконки
const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return {
        color: 'success.main',
        bgColor: 'success.lighter',
        icon: <CheckIcon />,
      };
    case 'warning':
      return {
        color: 'warning.main',
        bgColor: 'warning.lighter',
        icon: <WarningIcon />,
      };
    case 'error':
      return {
        color: 'error.main',
        bgColor: 'error.lighter',
        icon: <ErrorIcon />,
      };
    case 'info':
    default:
      return {
        color: 'info.main',
        bgColor: 'info.lighter',
        icon: <InfoIcon />,
      };
  }
};

// Получить иконку по категории
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'test':
      return <AssignmentIcon />;
    case 'profile':
      return <EmailIcon />;
    default:
      return <NotificationsIcon />;
  }
};

// Форматирование даты
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Сегодня, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays === 1) {
    return `Вчера, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  } else if (diffDays < 7) {
    return `${diffDays} дн. назад, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
};

// Компонент для страницы уведомлений
const Notifications = () => {
  // Состояние для хранения списка уведомлений
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  // Состояние для текущей вкладки (все, непрочитанные и т.д.)
  const [currentTab, setCurrentTab] = useState<number>(0);
  // Состояние для ID выбранного уведомления для меню действий
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  // Состояние для положения меню действий
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  // Состояние загрузки
  const [loading, setLoading] = useState<boolean>(false);
  // Состояние ошибки
  const [error, setError] = useState<string | null>(null);

  // Получаем информацию о пользователе
  const user = useAppSelector(state => state.auth.user);

  // Обработчик изменения вкладки
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Получение отфильтрованных уведомлений в зависимости от выбранной вкладки
  const getFilteredNotifications = (): Notification[] => {
    switch (currentTab) {
      case 1: // Непрочитанные
        return notifications.filter(notification => !notification.isRead);
      case 2: // Тесты
        return notifications.filter(notification => notification.category === 'test');
      case 3: // Профиль
        return notifications.filter(notification => notification.category === 'profile');
      case 4: // Системные
        return notifications.filter(notification => notification.category === 'system');
      default: // Все
        return notifications;
    }
  };

  // Обработчик открытия меню для уведомления
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedNotificationId(notificationId);
  };

  // Обработчик закрытия меню
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedNotificationId(null);
  };

  // Обработчик отметки уведомления как прочитанного
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    );
    handleMenuClose();
  };

  // Обработчик удаления уведомления
  const handleDelete = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
    handleMenuClose();
  };

  // Обработчик для отметки всех уведомлений как прочитанных
  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  };

  // Имитация загрузки уведомлений при первом рендере
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        // Здесь будет реальный запрос к API
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Временно используем мок-данные
        setNotifications(mockNotifications);
        setError(null);
      } catch (err) {
        setError('Ошибка при загрузке уведомлений. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Количество непрочитанных уведомлений
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

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
          <Badge
            badgeContent={unreadCount}
            color="error"
            sx={{ mr: { xs: 0, sm: 2 }, mb: { xs: 1, sm: 0 } }}
          >
            <NotificationsIcon
              sx={{
                fontSize: { xs: 24, sm: 32 },
                color: 'primary.main',
              }}
            />
          </Badge>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            }}
          >
            Уведомления
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {unreadCount > 0 && (
            <Chip
              label={`${unreadCount} непрочитанных`}
              color="primary"
              size="small"
              sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}
              onClick={handleMarkAllAsRead}
              clickable
            />
          )}
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Вкладки для фильтрации уведомлений */}
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Все" />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Непрочитанные
                {unreadCount > 0 && (
                  <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }} />
                )}
              </Box>
            }
          />
          <Tab label="Тесты" />
          <Tab label="Профиль" />
          <Tab label="Системные" />
        </Tabs>

        {/* Обработка состояний загрузки и ошибки */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <>
            {/* Список уведомлений */}
            <List sx={{ width: '100%' }}>
              {getFilteredNotifications().length > 0 ? (
                getFilteredNotifications().map(notification => {
                  const { color, bgColor, icon } = getNotificationStyles(notification.type);
                  return (
                    <Box key={notification.id}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                          transition: 'background-color 0.3s',
                          '&:hover': {
                            bgcolor: 'action.selected',
                          },
                          borderRadius: 1,
                          mb: 1,
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="more"
                            onClick={e => handleMenuOpen(e, notification.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: bgColor,
                              color: color,
                            }}
                          >
                            {getCategoryIcon(notification.category)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                              <Typography
                                variant="subtitle1"
                                sx={{
                                  fontWeight: notification.isRead ? 'normal' : 'bold',
                                  mr: 1,
                                }}
                              >
                                {notification.title}
                              </Typography>
                              <Chip
                                size="small"
                                label={
                                  notification.category === 'test'
                                    ? 'Тест'
                                    : notification.category === 'profile'
                                      ? 'Профиль'
                                      : 'Система'
                                }
                                sx={{
                                  backgroundColor:
                                    notification.category === 'test'
                                      ? 'info.lighter'
                                      : notification.category === 'profile'
                                        ? 'success.lighter'
                                        : 'warning.lighter',
                                  color:
                                    notification.category === 'test'
                                      ? 'info.dark'
                                      : notification.category === 'profile'
                                        ? 'success.dark'
                                        : 'warning.dark',
                                  height: 20,
                                  fontSize: '0.7rem',
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <>
                              <Box component="span" sx={{ display: 'block', mb: 0.5, mt: 0.5 }}>
                                <Typography variant="body2" color="text.primary" component="span">
                                  {notification.message}
                                </Typography>
                              </Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                component="span"
                                sx={{ display: 'block' }}
                              >
                                {formatDate(notification.timestamp)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </Box>
                  );
                })
              ) : (
                // Отображение, если нет уведомлений
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    Нет уведомлений
                  </Typography>
                </Box>
              )}
            </List>
          </>
        )}

        {/* Меню действий для уведомления */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 2,
            sx: { width: 200 },
          }}
        >
          {selectedNotificationId && (
            <>
              <MenuItem onClick={() => handleMarkAsRead(selectedNotificationId)}>
                <CheckIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">Прочитано</Typography>
              </MenuItem>
              <MenuItem onClick={() => handleDelete(selectedNotificationId)}>
                <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">Удалить</Typography>
              </MenuItem>
            </>
          )}
        </Menu>
      </Paper>
    </Container>
  );
};

export default Notifications;
