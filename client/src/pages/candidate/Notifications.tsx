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
    title: 'Назначен новый тест',
    message:
      'Вам назначен новый тест "Основы инженерных расчетов". Просьба пройти его до 15.04.2025',
    type: 'info',
    timestamp: '2025-04-01T10:30:00',
    isRead: false,
    link: '/app/candidate/tests/available',
    category: 'test',
  },
  {
    id: '2',
    title: 'Тест успешно пройден',
    message: 'Поздравляем! Вы успешно прошли тест "Железобетонные конструкции" с результатом 85%',
    type: 'success',
    timestamp: '2025-04-08T14:15:00',
    isRead: true,
    link: '/app/candidate/tests/history',
    category: 'test',
  },
  {
    id: '3',
    title: 'Заполните профиль',
    message: 'Для лучшего подбора тестов и возможностей рекомендуем заполнить все разделы профиля',
    type: 'warning',
    timestamp: '2025-04-05T09:00:00',
    isRead: false,
    link: '/app/candidate/profile',
    category: 'profile',
  },
  {
    id: '4',
    title: 'Системное обновление',
    message: 'В системе проведено обновление. Доступны новые типы тестов и улучшен интерфейс.',
    type: 'info',
    timestamp: '2025-04-10T18:45:00',
    isRead: true,
    link: '',
    category: 'system',
  },
  {
    id: '5',
    title: 'Срок прохождения теста истекает',
    message: 'Напоминаем, что срок прохождения теста "Системы вентиляции" истекает завтра',
    type: 'warning',
    timestamp: '2025-04-12T11:30:00',
    isRead: false,
    link: '/app/candidate/tests/available',
    category: 'test',
  },
  {
    id: '6',
    title: 'Ошибка при сохранении данных',
    message: 'При сохранении данных профиля произошла ошибка. Пожалуйста, попробуйте еще раз',
    type: 'error',
    timestamp: '2025-04-15T16:20:00',
    isRead: true,
    link: '/app/candidate/profile',
    category: 'profile',
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
                              <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{ display: 'block', mb: 0.5, mt: 0.5 }}
                              >
                                {notification.message}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
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
