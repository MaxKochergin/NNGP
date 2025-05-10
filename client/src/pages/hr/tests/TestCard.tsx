import { Assignment as AssignmentIcon } from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Stack, Typography, useTheme } from '@mui/material';
import { Test, TestDifficulty, TestStatus } from '../../../types/test';

interface TestCardProps {
  test: Test;
  onClick: () => void;
}

const TestCard = ({ test, onClick }: TestCardProps) => {
  const theme = useTheme();

  const getDifficultyColor = (
    difficulty: TestDifficulty
  ): 'success' | 'warning' | 'error' | 'default' => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      case 'expert':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: TestStatus): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: TestStatus): string => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'draft':
        return 'Черновик';
      case 'archived':
        return 'Архив';
      default:
        return status;
    }
  };

  const getTargetAudienceLabel = (audience: string): string => {
    switch (audience) {
      case 'candidates':
        return 'Кандидаты';
      case 'employees':
        return 'Сотрудники';
      case 'both':
        return 'Все';
      default:
        return audience;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
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
      }}
      onClick={onClick}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                borderRadius: 1,
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
              }}
            >
              <AssignmentIcon sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontSize: '1rem', fontWeight: 'bold' }}
              >
                {test.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {test.type}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            label={getStatusLabel(test.status)}
            color={getStatusColor(test.status)}
            size="small"
            sx={{ height: 24 }}
          />
          <Chip
            label={test.difficulty}
            color={getDifficultyColor(test.difficulty)}
            size="small"
            sx={{ height: 24 }}
          />
        </Stack>

        <Typography
          variant="body2"
          sx={{
            mb: 2,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            flexGrow: 1,
          }}
        >
          {test.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Для: {getTargetAudienceLabel(test.targetAudience)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {test.duration} мин
            </Typography>
          </Stack>

          {(test.department || test.position) && (
            <Typography variant="caption" color="text.secondary" noWrap>
              {test.department && `Отдел: ${test.department}`}
              {test.department && test.position && ' | '}
              {test.position && `Должность: ${test.position}`}
            </Typography>
          )}

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
              mt: 1,
            }}
          >
            Обновлено: {formatDate(test.updatedAt)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TestCard;
