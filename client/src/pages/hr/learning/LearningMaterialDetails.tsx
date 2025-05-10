import { useEffect, useState } from 'react';
import {
  ArrowBack as ArrowBackIcon,
  ArticleOutlined as ArticleIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  School as CourseIcon,
  Delete as DeleteIcon,
  FindInPage as DocumentIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  Slideshow as PresentationIcon,
  Schedule as ScheduleIcon,
  PlayCircleOutline as VideoIcon,
  VisibilityOutlined as VisibilityIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Rating,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';
import {
  deleteMaterial,
  LearningMaterial,
  mockLearningMaterials,
} from '../../../types/learning-material';

// Вспомогательная функция для форматирования даты
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Вспомогательная функция для форматирования длительности
const formatDuration = (minutes: number | undefined) => {
  if (!minutes) return '-';

  if (minutes < 60) {
    return `${minutes} мин`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ч`;
  }

  return `${hours} ч ${remainingMinutes} мин`;
};

const LearningMaterialDetails = () => {
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<LearningMaterial | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Медиа-запросы для адаптивности
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // В реальном приложении здесь будет API запрос
    const foundMaterial = mockLearningMaterials.find(m => m.id === id);
    if (foundMaterial) {
      setMaterial(foundMaterial);
    }
  }, [id]);

  if (!material) {
    return (
      <Container maxWidth="lg" sx={{ my: { xs: 2, sm: 4 } }}>
        <Typography>Материал не найден</Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/app/hr/learning')}
          sx={{ mt: 2 }}
        >
          Вернуться к списку
        </Button>
      </Container>
    );
  }

  // Определяем иконку и цвет в зависимости от типа материала
  const getIcon = () => {
    const size = isMobile ? 28 : 36;
    switch (material.type) {
      case 'course':
        return <CourseIcon sx={{ fontSize: size }} />;
      case 'video':
        return <VideoIcon sx={{ fontSize: size }} />;
      case 'article':
        return <ArticleIcon sx={{ fontSize: size }} />;
      case 'document':
        return <DocumentIcon sx={{ fontSize: size }} />;
      case 'presentation':
        return <PresentationIcon sx={{ fontSize: size }} />;
      default:
        return <ArticleIcon sx={{ fontSize: size }} />;
    }
  };

  const getColor = () => {
    switch (material.type) {
      case 'course':
        return theme.palette.primary.main;
      case 'video':
        return theme.palette.error.main;
      case 'article':
        return theme.palette.info.main;
      case 'document':
        return theme.palette.success.main;
      case 'presentation':
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Локализованные названия типов
  const getTypeLabel = () => {
    switch (material.type) {
      case 'course':
        return 'Курс';
      case 'video':
        return 'Видео';
      case 'article':
        return 'Статья';
      case 'document':
        return 'Документ';
      case 'presentation':
        return 'Презентация';
      default:
        return 'Материал';
    }
  };

  // Локализованные названия уровней сложности
  const getDifficultyLabel = () => {
    switch (material.difficulty) {
      case 'beginner':
        return 'Начальный';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      case 'expert':
        return 'Экспертный';
      default:
        return 'Неизвестно';
    }
  };

  // Локализованные названия статусов
  const getStatusLabel = () => {
    switch (material.status) {
      case 'active':
        return 'Активен';
      case 'draft':
        return 'Черновик';
      case 'archived':
        return 'Архив';
      default:
        return 'Неизвестно';
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleEdit = () => {
    navigate(`/app/hr/learning/edit/${material.id}`);
  };

  const handleBackToList = () => {
    navigate('/app/hr/learning');
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    // Используем функцию deleteMaterial для удаления из массива моковых данных
    if (material && deleteMaterial(material.id)) {
      setSnackbarMessage('Материал успешно удален');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      // Закрываем диалог
      setDeleteDialogOpen(false);

      // Делаем небольшую задержку перед перенаправлением,
      // чтобы пользователь увидел уведомление об успешном удалении
      setTimeout(() => {
        navigate('/app/hr/learning');
      }, 1500);
    } else {
      setSnackbarMessage('Ошибка при удалении материала');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Получаем цвет для статуса
  const getStatusColor = () => {
    switch (material.status) {
      case 'active':
        return theme.palette.success;
      case 'draft':
        return theme.palette.warning;
      case 'archived':
        return theme.palette.error;
      default:
        return theme.palette.success;
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        my: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2, md: 3 }, // Уменьшенные горизонтальные отступы на мобильных
      }}
    >
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToList}
        sx={{ mb: 2, display: { xs: 'none', sm: 'flex' } }}
      >
        Вернуться к списку
      </Button>

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          position: 'relative',
          borderRadius: { xs: 1, sm: 2 },
        }}
      >
        {/* Мобильная кнопка назад */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToList}
            size={isMobile ? 'small' : 'medium'}
          >
            Назад
          </Button>
        </Box>

        {/* Шапка с типом и заголовком */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            bgcolor: alpha(getColor(), 0.1),
            p: { xs: 1.5, sm: 2 },
            borderRadius: 1,
            mb: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: { xs: '100%', sm: 'auto' },
              mb: { xs: 1, sm: 0 },
            }}
          >
            <Box sx={{ color: getColor(), mr: 1.5 }}>{getIcon()}</Box>
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ color: getColor(), fontWeight: 500 }}
            >
              {getTypeLabel()}
            </Typography>

            {/* Кнопки перемещены в мобильной версии */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' }, ml: 'auto' }}>
              <Tooltip title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}>
                <IconButton onClick={handleToggleFavorite} size={isMobile ? 'small' : 'medium'}>
                  {isFavorite ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Редактировать">
                <IconButton onClick={handleEdit} size={isMobile ? 'small' : 'medium'}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Удалить">
                <IconButton
                  onClick={handleDeleteClick}
                  size={isMobile ? 'small' : 'medium'}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mt: { xs: 0, sm: 0.5 },
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              }}
            >
              {material.title}
            </Typography>
          </Box>

          {/* Десктопные кнопки */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <Tooltip title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}>
              <IconButton onClick={handleToggleFavorite}>
                {isFavorite ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Редактировать">
              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Удалить">
              <IconButton onClick={handleDeleteClick} color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {/* Основная информация */}
          <Grid item xs={12} md={8} order={{ xs: 2, md: 1 }}>
            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Описание
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  lineHeight: { xs: 1.5, sm: 1.6 },
                }}
              >
                {material.description}
              </Typography>
            </Box>

            <Divider sx={{ my: { xs: 2, sm: 3 } }} />

            <Box sx={{ mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Метаданные
              </Typography>

              <Grid container spacing={{ xs: 1, sm: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" component="div" color="text.secondary">
                        Автор
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        {material.author}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" component="div" color="text.secondary">
                        Создан
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        {formatDate(material.createdAt)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" component="div" color="text.secondary">
                        Обновлен
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        {formatDate(material.updatedAt)}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" component="div" color="text.secondary">
                        Длительность
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        {formatDuration(material.durationMinutes)}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" component="div" color="text.secondary">
                        Просмотры
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <VisibilityIcon
                          fontSize={isMobile ? 'small' : 'small'}
                          sx={{ mr: 1, color: theme.palette.text.secondary }}
                        />
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                          {material.viewCount}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" component="div" color="text.secondary">
                        Рейтинг
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating
                          value={material.rating}
                          precision={0.1}
                          readOnly
                          size={isMobile ? 'small' : 'small'}
                          sx={{ mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                        >
                          ({material.rating.toFixed(1)})
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: { xs: 2, sm: 3 } }} />

            <Box>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Теги
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0.5, sm: 1 } }}>
                {material.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    size={isMobile ? 'small' : 'small'}
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Боковая панель */}
          <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
            <Card variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Информация
              </Typography>

              <Stack spacing={{ xs: 1.5, sm: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Статус
                  </Typography>
                  <Chip
                    label={getStatusLabel()}
                    size={isMobile ? 'small' : 'small'}
                    sx={{
                      mt: 0.5,
                      bgcolor: alpha(getStatusColor().main, 0.1),
                      color: getStatusColor().main,
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Уровень сложности
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                    {getDifficultyLabel()}
                  </Typography>
                </Box>

                {material.department && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Отдел
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}
                    >
                      {material.department}
                    </Typography>
                  </Box>
                )}

                {material.position && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Должность
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}
                    >
                      {material.position}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Обязательный материал
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                    {material.isMandatory ? 'Да' : 'Нет'}
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {material.url && (
              <Card variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                >
                  Материал
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  size={isMobile ? 'medium' : 'medium'}
                  sx={{ mt: 1 }}
                >
                  Открыть материал
                </Button>
              </Card>
            )}

            {/* Кнопка удаления для мобильной версии (внизу страницы) */}
            <Box sx={{ mt: 3, display: { xs: 'block', md: 'none' } }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
              >
                Удалить материал
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Удаление учебного материала</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы действительно хотите удалить материал "{material.title}"? Это действие нельзя будет
            отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомление о результате операции */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LearningMaterialDetails;
