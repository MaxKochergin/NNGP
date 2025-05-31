import { useState } from 'react';
import {
  Build as BuildIcon,
  CloudUpload as CloudUploadIcon,
  Code as CodeIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  SystemUpdateAlt as SystemUpdateAltIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';

// Интерфейс для системной информации
interface SystemInfoData {
  version: string;
  lastUpdate: string;
  environment: string;
  status: 'running' | 'maintenance' | 'error';
  database: {
    type: string;
    version: string;
    size: string;
    status: 'ok' | 'error' | 'warning';
    connections: number;
  };
  storage: {
    total: string;
    used: string;
    percentage: number;
  };
  server: {
    type: string;
    os: string;
    ram: {
      total: string;
      used: string;
      percentage: number;
    };
    cpu: {
      model: string;
      usage: number;
    };
  };
  backups: {
    last: string;
    status: 'success' | 'error' | 'warning';
    size: string;
  };
  updates: {
    available: boolean;
    version: string;
    releaseDate: string;
  };
  errors: {
    count: number;
    lastError: string;
    lastErrorTime: string;
  };
}

// Моковые данные о системе
const mockSystemInfo: SystemInfoData = {
  version: '1.5.2',
  lastUpdate: '2025-04-01',
  environment: 'Production',
  status: 'running',
  database: {
    type: 'PostgreSQL',
    version: '14.5',
    size: '2.8 GB',
    status: 'ok',
    connections: 42,
  },
  storage: {
    total: '500 GB',
    used: '156 GB',
    percentage: 31.2,
  },
  server: {
    type: 'AWS EC2',
    os: 'Ubuntu 24.04 LTS',
    ram: {
      total: '16 GB',
      used: '9.2 GB',
      percentage: 57.5,
    },
    cpu: {
      model: 'Intel Xeon E5-2676 v3',
      usage: 32,
    },
  },
  backups: {
    last: '2025-04-15 03:00',
    status: 'success',
    size: '1.2 GB',
  },
  updates: {
    available: true,
    version: '1.6.0',
    releaseDate: '2025-04-20',
  },
  errors: {
    count: 3,
    lastError: 'Database connection timeout',
    lastErrorTime: '2025-04-14 15:32',
  },
};

// Статус системы на понятном языке
const getStatusName = (status: string) => {
  switch (status) {
    case 'running':
      return 'Работает';
    case 'maintenance':
      return 'Обслуживание';
    case 'error':
      return 'Ошибка';
    default:
      return status;
  }
};

// Цвет для статуса
const getStatusColor = (status: string) => {
  switch (status) {
    case 'running':
    case 'success':
    case 'ok':
      return 'success';
    case 'maintenance':
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'info';
  }
};

const SystemInfo = () => {
  const theme = useTheme();
  const [systemInfo, setSystemInfo] = useState<SystemInfoData>(mockSystemInfo);
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Функция для обновления системной информации
  const handleRefresh = () => {
    setLoading(true);
    // Имитация запроса к API
    setTimeout(() => {
      // В реальном приложении здесь бы обновлялись данные с сервера
      setLoading(false);
    }, 1500);
  };

  // Функция для запуска резервного копирования
  const handleBackup = () => {
    setBackupLoading(true);
    // Имитация запроса к API
    setTimeout(() => {
      setSystemInfo({
        ...systemInfo,
        backups: {
          ...systemInfo.backups,
          last: new Date().toLocaleString('ru-RU'),
          status: 'success',
        },
      });
      setBackupLoading(false);
    }, 3000);
  };

  // Функция для обновления системы
  const handleUpdate = () => {
    setUpdateLoading(true);
    // Имитация запроса к API
    setTimeout(() => {
      setSystemInfo({
        ...systemInfo,
        version: systemInfo.updates.version,
        lastUpdate: new Date().toLocaleDateString('ru-RU'),
        updates: {
          ...systemInfo.updates,
          available: false,
        },
      });
      setUpdateLoading(false);
    }, 5000);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Информация о системе</Typography>
        <Button
          variant="outlined"
          onClick={handleRefresh}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Обновление...' : 'Обновить информацию'}
        </Button>
      </Box>

      {systemInfo.status === 'running' && systemInfo.errors.count === 0 ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          Система работает нормально. Нет активных ошибок.
        </Alert>
      ) : systemInfo.status === 'maintenance' ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Система находится в режиме обслуживания. Некоторые функции могут быть недоступны.
        </Alert>
      ) : (
        <Alert severity="error" sx={{ mb: 3 }}>
          Обнаружены ошибки в работе системы ({systemInfo.errors.count}). Последняя ошибка:{' '}
          {systemInfo.errors.lastError} ({systemInfo.errors.lastErrorTime})
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Основная информация */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Основная информация
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Версия системы
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {systemInfo.version}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Последнее обновление
                  </Typography>
                  <Typography variant="body1">{systemInfo.lastUpdate}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Окружение
                  </Typography>
                  <Typography variant="body1">{systemInfo.environment}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Статус
                  </Typography>
                  <Chip
                    label={getStatusName(systemInfo.status)}
                    color={getStatusColor(systemInfo.status)}
                    size="small"
                  />
                </Box>

                {systemInfo.updates.available && (
                  <Box sx={{ mt: 2 }}>
                    <Alert
                      severity="info"
                      action={
                        <Button
                          color="info"
                          size="small"
                          onClick={handleUpdate}
                          disabled={updateLoading}
                        >
                          {updateLoading ? 'Обновление...' : 'Обновить'}
                        </Button>
                      }
                    >
                      Доступно обновление до версии {systemInfo.updates.version} от{' '}
                      {systemInfo.updates.releaseDate}
                    </Alert>
                    {updateLoading && <LinearProgress sx={{ mt: 1 }} />}
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Информация о сервере */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Информация о сервере
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Тип сервера
                  </Typography>
                  <Typography variant="body1">{systemInfo.server.type}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Операционная система
                  </Typography>
                  <Typography variant="body1">{systemInfo.server.os}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Процессор
                  </Typography>
                  <Typography variant="body1">{systemInfo.server.cpu.model}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Использование CPU: {systemInfo.server.cpu.usage}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={systemInfo.server.cpu.usage}
                    color={
                      systemInfo.server.cpu.usage > 80
                        ? 'error'
                        : systemInfo.server.cpu.usage > 60
                          ? 'warning'
                          : 'success'
                    }
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Использование RAM: {systemInfo.server.ram.used} из {systemInfo.server.ram.total}{' '}
                    ({systemInfo.server.ram.percentage}%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={systemInfo.server.ram.percentage}
                    color={
                      systemInfo.server.ram.percentage > 80
                        ? 'error'
                        : systemInfo.server.ram.percentage > 60
                          ? 'warning'
                          : 'success'
                    }
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Информация о базе данных и хранилище */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                База данных и хранилище
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Тип базы данных
                  </Typography>
                  <Typography variant="body1">
                    {systemInfo.database.type} {systemInfo.database.version}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Размер базы данных
                  </Typography>
                  <Typography variant="body1">{systemInfo.database.size}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Статус базы данных
                  </Typography>
                  <Chip
                    label={
                      systemInfo.database.status === 'ok'
                        ? 'Нормальный'
                        : systemInfo.database.status === 'warning'
                          ? 'Предупреждение'
                          : 'Ошибка'
                    }
                    color={getStatusColor(systemInfo.database.status)}
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Использование хранилища: {systemInfo.storage.used} из {systemInfo.storage.total}{' '}
                    ({systemInfo.storage.percentage}%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={systemInfo.storage.percentage}
                    color={
                      systemInfo.storage.percentage > 80
                        ? 'error'
                        : systemInfo.storage.percentage > 60
                          ? 'warning'
                          : 'success'
                    }
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Последнее резервное копирование
                  </Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body1">
                      {systemInfo.backups.last} ({systemInfo.backups.size})
                    </Typography>
                    <Chip
                      label={
                        systemInfo.backups.status === 'success'
                          ? 'Успешно'
                          : systemInfo.backups.status === 'warning'
                            ? 'Внимание'
                            : 'Ошибка'
                      }
                      color={getStatusColor(systemInfo.backups.status)}
                      size="small"
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleBackup}
                    disabled={backupLoading}
                    startIcon={<CloudUploadIcon />}
                    sx={{ mt: 1 }}
                  >
                    {backupLoading ? 'Создание резервной копии...' : 'Создать резервную копию'}
                  </Button>
                  {backupLoading && <LinearProgress sx={{ mt: 1 }} />}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Журнал системных событий */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Журнал системных событий
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <List>
                <ListItem>
                  <ListItemIcon>
                    <SystemUpdateAltIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Обновление системы до версии 1.5.2"
                    secondary="2025-04-01 08:32 • Успешно • Администратор: admin@example.com"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CloudUploadIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Создание резервной копии"
                    secondary="2025-03-31 03:00 • Автоматически • Размер: 1.2 GB"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Высокая нагрузка на CPU (87%)"
                    secondary="2025-03-30 14:15 • Продолжительность: 12 минут"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BuildIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Изменение системных настроек"
                    secondary="2025-03-29 10:45 • Администратор: admin@example.com"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ошибка подключения к базе данных"
                    secondary="2025-03-28 16:20 • Продолжительность: 5 минут • Причина: сетевая ошибка"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemInfo;
