import { Fragment, MouseEvent, SyntheticEvent, useEffect, useState } from 'react';
import {
  AccountCircle as AccountCircleIcon,
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
  Update as UpdateIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
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
  category: 'security' | 'system' | 'users' | 'updates';
}

// Временные тестовые данные
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Попытка несанкционированного доступа',
    message:
      'Зафиксирована попытка несанкционированного доступа с IP 185.24.65.12. Проверьте журнал безопасности системы',
    type: 'error',
    timestamp: '2025-04-15T10:30:00',
    isRead: false,
    link: '/app/admin/system',
    category: 'security',
  },
  {
    id: '2',
    title: 'Обновление системы доступно',
    message:
      'Доступно новое обновление системы версии 1.6.0. Рекомендуется провести обновление в ближайшее время',
    type: 'info',
    timestamp: '2025-04-14T14:15:00',
    isRead: true,
    link: '/app/admin/system',
    category: 'updates',
  },
  {
    id: '3',
    title: 'Высокая нагрузка на сервер',
    message:
      'Зафиксирована высокая нагрузка на сервер (CPU: 92%). Рекомендуется проверить активные процессы и оптимизировать работу системы',
    type: 'warning',
    timestamp: '2025-04-13T09:00:00',
    isRead: false,
    link: '/app/admin/system',
    category: 'system',
  },
  {
    id: '4',
    title: 'Резервное копирование завершено',
    message:
      'Еженедельное резервное копирование базы данных успешно завершено. Размер резервной копии: 2.8 GB',
    type: 'success',
    timestamp: '2025-04-12T18:45:00',
    isRead: true,
    link: '/app/admin/system',
    category: 'system',
  },
  {
    id: '5',
    title: 'Новый администратор добавлен в систему',
    message:
      'Пользователь "Королев Сергей Алексеевич" (korolev@example.com) получил права администратора системы. Необходимо провести инструктаж.',
    type: 'warning',
    timestamp: '2025-04-11T11:30:00',
    isRead: false,
    link: '/app/admin/users',
    category: 'users',
  },
  {
    id: '6',
    title: 'Критическая ошибка подключения к базе данных',
    message:
      'Зафиксирована критическая ошибка при подключении к базе данных. Проверьте настройки соединения и доступность сервера БД.',
    type: 'error',
    timestamp: '2025-04-10T16:20:00',
    isRead: false,
    link: '/app/admin/system',
    category: 'system',
  },
  {
    id: '7',
    title: 'Учетная запись заблокирована',
    message:
      'Учетная запись пользователя "Кузнецов Андрей Сергеевич" (kuznetsov@example.com) заблокирована после 5 неудачных попыток входа',
    type: 'warning',
    timestamp: '2025-04-09T13:25:00',
    isRead: false,
    link: '/app/admin/users',
    category: 'security',
  },
  {
    id: '8',
    title: 'Оптимизация базы данных завершена',
    message:
      'Автоматическая оптимизация базы данных успешно завершена. Освобождено 450 MB дискового пространства',
    type: 'success',
    timestamp: '2025-04-08T09:15:00',
    isRead: true,
    link: '/app/admin/system',
    category: 'system',
  },
  {
    id: '9',
    title: 'Изменение прав доступа пользователя',
    message:
      'Администратор "Васильев Павел Михайлович" изменил права доступа для 5 пользователей. Требуется проверка изменений',
    type: 'info',
    timestamp: '2025-04-07T10:10:00',
    isRead: false,
    link: '/app/admin/users',
    category: 'users',
  },
  {
    id: '10',
    title: 'Достигнут лимит хранилища файлов',
    message:
      'Хранилище файлов достигло 85% своей емкости. Рекомендуется выполнить очистку или увеличить объем дискового пространства',
    type: 'warning',
    timestamp: '2025-04-06T15:40:00',
    isRead: false,
    link: '/app/admin/system',
    category: 'system',
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
    case 'security':
      return <ErrorIcon color="error" />;
    case 'users':
      return <AccountCircleIcon />;
    case 'updates':
      return <UpdateIcon />;
    case 'system':
    default:
      return <StorageIcon />;
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
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Получение отфильтрованных уведомлений в зависимости от выбранной вкладки
  const getFilteredNotifications = (): Notification[] => {
    switch (currentTab) {
      case 1: // Непрочитанные
        return notifications.filter(notification => !notification.isRead);
      case 2: // Безопасность
        return notifications.filter(notification => notification.category === 'security');
      case 3: // Пользователи
        return notifications.filter(notification => notification.category === 'users');
      case 4: // Система
        return notifications.filter(notification => notification.category === 'system');
      default: // Все
        return notifications;
    }
  };

  // Обработчик открытия меню для уведомления
  const handleMenuOpen = (event: MouseEvent<HTMLElement>, notificationId: string) => {
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
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: { xs: 0, sm: 1 },
          boxShadow: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              badgeContent={notifications.filter(notification => !notification.isRead).length}
              color="error"
              sx={{ mr: 2 }}
            >
              <NotificationsIcon color="primary" fontSize="large" />
            </Badge>
            <Typography variant="h5" component="h1">
              Системные уведомления администратора
            </Typography>
          </Box>
          <Button
            color="primary"
            size="small"
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(notification => !notification.isRead)}
            sx={{ mt: { xs: 2, sm: 0 } }}
          >
            Отметить все как прочитанные
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 2,
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Вкладки уведомлений"
          >
            <Tab
              label={
                <Badge
                  badgeContent={notifications.length}
                  color="primary"
                  sx={{ '& .MuiBadge-badge': { right: -15 } }}
                >
                  Все
                </Badge>
              }
            />
            <Tab
              label={
                <Badge
                  badgeContent={notifications.filter(notification => !notification.isRead).length}
                  color="error"
                  sx={{ '& .MuiBadge-badge': { right: -15 } }}
                >
                  Непрочитанные
                </Badge>
              }
            />
            <Tab label="Безопасность" />
            <Tab label="Пользователи" />
            <Tab label="Система" />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {getFilteredNotifications().length > 0 ? (
              <List>
                {getFilteredNotifications().map(notification => {
                  const notificationStyles = getNotificationStyles(notification.type);

                  return (
                    <Fragment key={notification.id}>
                      <ListItem
                        alignItems="flex-start"
                        sx={{
                          bgcolor: notification.isRead ? 'inherit' : 'action.hover',
                          position: 'relative',
                          py: 1.5,
                        }}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="действия"
                            onClick={e => handleMenuOpen(e, notification.id)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        }
                      >
                        <ListItemButton
                          onClick={() => handleMarkAsRead(notification.id)}
                          sx={{ p: 0, borderRadius: 1 }}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: notificationStyles.bgColor }}>
                              {notificationStyles.icon}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: { xs: 'column', md: 'row' },
                                  alignItems: { xs: 'flex-start', md: 'center' },
                                  justifyContent: 'space-between',
                                  pr: 5,
                                }}
                              >
                                <Typography
                                  variant="subtitle1"
                                  sx={{
                                    fontWeight: notification.isRead ? 'normal' : 'bold',
                                    mr: 2,
                                  }}
                                >
                                  {notification.title}
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mt: { xs: 1, md: 0 },
                                  }}
                                >
                                  <Chip
                                    icon={getCategoryIcon(notification.category)}
                                    label={
                                      notification.category === 'security'
                                        ? 'Безопасность'
                                        : notification.category === 'users'
                                          ? 'Пользователи'
                                          : notification.category === 'updates'
                                            ? 'Обновления'
                                            : 'Система'
                                    }
                                    size="small"
                                    sx={{ mr: 1 }}
                                  />
                                  <Typography variant="caption" color="text.secondary">
                                    {formatDate(notification.timestamp)}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            secondary={notification.message}
                            primaryTypographyProps={{
                              component: 'div',
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </Fragment>
                  );
                })}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <NotificationsIcon sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Уведомлений не найдено
                </Typography>
                <Typography color="text.secondary">
                  В данной категории нет уведомлений для администратора
                </Typography>
              </Box>
            )}
          </>
        )}
      </Paper>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            if (selectedNotificationId) {
              handleMarkAsRead(selectedNotificationId);
            }
          }}
        >
          <ListItemIcon>
            <CheckIcon fontSize="small" />
          </ListItemIcon>
          Отметить как прочитанное
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedNotificationId) {
              handleDelete(selectedNotificationId);
            }
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          Удалить уведомление
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default Notifications;
