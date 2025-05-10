import { useState } from 'react';
import {
  ArticleOutlined as ArticleIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  School as CourseIcon,
  FindInPage as DocumentIcon,
  Edit as EditIcon,
  Slideshow as PresentationIcon,
  StarRate as StarIcon,
  PlayCircleOutline as VideoIcon,
} from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  alpha,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LearningMaterial } from '../../../types/learning-material';

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
  if (!minutes) return '';

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

// Компонент карточки учебного материала
interface LearningMaterialCardProps {
  material: LearningMaterial;
  onClick?: (id: string) => void;
}

const LearningMaterialCard = ({ material, onClick }: LearningMaterialCardProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event?: React.MouseEvent<HTMLElement>) => {
    if (event) {
      event.stopPropagation();
    }
    setAnchorEl(null);
  };

  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    navigate(`/app/hr/learning/edit/${material.id}`);
    handleMenuClose();
  };

  const handleToggleFavorite = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Определяем иконку в зависимости от типа материала
  const getIcon = () => {
    switch (material.type) {
      case 'course':
        return <CourseIcon />;
      case 'video':
        return <VideoIcon />;
      case 'article':
        return <ArticleIcon />;
      case 'document':
        return <DocumentIcon />;
      case 'presentation':
        return <PresentationIcon />;
      default:
        return <ArticleIcon />;
    }
  };

  // Определяем цвет в зависимости от типа материала
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

  // Определяем цвет фона для статуса
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

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardActionArea
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
        onClick={() => onClick && onClick(material.id)}
      >
        {/* Верхняя часть с иконкой и типом */}
        <Box
          sx={{
            height: 64,
            bgcolor: alpha(getColor(), 0.12),
            color: getColor(),
            display: 'flex',
            alignItems: 'center',
            pl: 2,
          }}
        >
          {getIcon()}
          <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 500 }}>
            {getTypeLabel()}
          </Typography>
          {material.isMandatory && (
            <Chip
              size="small"
              label="Обязательный"
              color="error"
              variant="outlined"
              sx={{ ml: 'auto', mr: 2 }}
            />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              mb: 1,
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              lineHeight: '1.4em',
              height: '2.8em',
            }}
          >
            {material.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
              height: '4.5em',
            }}
          >
            {material.description}
          </Typography>

          <Box sx={{ mb: 0.5 }}>
            {material.department && (
              <Typography variant="caption" display="block" color="text.secondary">
                Отдел: {material.department}
              </Typography>
            )}
            {material.durationMinutes && (
              <Typography variant="caption" display="block" color="text.secondary">
                Длительность: {formatDuration(material.durationMinutes)}
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 'auto' }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={1}
              sx={{ mt: 1 }}
            >
              <Stack direction="row" spacing={0.5} alignItems="center">
                <StarIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />
                <Typography variant="body2">{material.rating.toFixed(1)}</Typography>
              </Stack>

              <Chip
                size="small"
                label={getStatusLabel()}
                sx={{
                  bgcolor: alpha(getStatusColor().main, 0.1),
                  color: getStatusColor().main,
                  borderRadius: '4px',
                }}
              />
            </Stack>
          </Box>
        </CardContent>
      </CardActionArea>

      {/* Кнопки управления */}
      <Box sx={{ position: 'absolute', top: 4, right: 4, display: 'flex' }}>
        <Tooltip title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}>
          <IconButton size="small" onClick={handleToggleFavorite}>
            {isFavorite ? (
              <BookmarkIcon fontSize="small" color="primary" />
            ) : (
              <BookmarkBorderIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="Действия">
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Меню */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose()}
        onClick={e => e.stopPropagation()}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Редактировать
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default LearningMaterialCard;
