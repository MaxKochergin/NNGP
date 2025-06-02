import { Delete as DeleteIcon, Person as PersonIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { CandidateBasicInfo } from '../../../features/candidates/candidatesSlice';

interface CandidateCardProps {
  candidate: CandidateBasicInfo;
  onClick: () => void;
  onDelete?: (candidateId: string) => void;
}

const CandidateCard = ({ candidate, onClick, onDelete }: CandidateCardProps) => {
  const theme = useTheme();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем срабатывание onClick карточки
    if (onDelete) {
      onDelete(candidate.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'новый':
        return 'info';
      case 'на собеседовании':
        return 'warning';
      case 'тестовое задание':
        return 'warning';
      case 'принят':
        return 'success';
      case 'отклонен':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Сегодня';
    } else if (diffDays === 1) {
      return 'Вчера';
    } else if (diffDays < 7) {
      return `${diffDays} дн. назад`;
    } else {
      return date.toLocaleDateString('ru-RU');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
        position: 'relative',
        overflow: 'visible',
      }}
      onClick={onClick}
    >
      {/* Кнопка удаления */}
      {onDelete && (
        <IconButton
          size="small"
          onClick={handleDeleteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': {
              bgcolor: 'error.light',
              color: 'error.contrastText',
            },
            zIndex: 1,
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={candidate.avatar || undefined}
            sx={{
              width: 56,
              height: 56,
              mr: 2,
              bgcolor: theme.palette.primary.main,
              fontSize: '1.2rem',
              fontWeight: 'bold',
            }}
          >
            {!candidate.avatar && getInitials(candidate.name)}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
                lineHeight: 1.2,
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {candidate.name}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.875rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {candidate.position}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            label={candidate.status}
            color={getStatusColor(candidate.status)}
            size="small"
            sx={{ height: 24, fontSize: '0.75rem' }}
          />
          <Chip
            label={`Опыт: ${candidate.experience}`}
            variant="outlined"
            size="small"
            sx={{ height: 24, fontSize: '0.75rem' }}
          />
        </Stack>

        {/* Дополнительная информация */}
        {(candidate.location || candidate.salary) && (
          <Box sx={{ mb: 2 }}>
            {candidate.location && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', fontSize: '0.75rem' }}
              >
                📍 {candidate.location}
              </Typography>
            )}
            {candidate.salary && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', fontSize: '0.75rem' }}
              >
                💰 {candidate.salary}
              </Typography>
            )}
          </Box>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
          Навыки:
        </Typography>
        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, minHeight: 52, flexGrow: 1 }}
        >
          {candidate.skills.slice(0, 3).map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 24 }}
            />
          ))}
          {candidate.skills.length > 3 && (
            <Chip
              label={`+${candidate.skills.length - 3}`}
              size="small"
              sx={{ fontSize: '0.7rem', height: 24, bgcolor: 'action.hover' }}
            />
          )}
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: 'right',
            fontSize: '0.7rem',
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 1,
            mt: 'auto',
          }}
        >
          Активность: {formatDate(candidate.lastActivity)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
