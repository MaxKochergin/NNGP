import { Person as PersonIcon } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Chip, Stack, Typography, useTheme } from '@mui/material';
import { Candidate } from './CandidatesList';

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

const CandidateCard = ({ candidate, onClick }: CandidateCardProps) => {
  const theme = useTheme();

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
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={candidate.avatar || undefined}
            sx={{
              width: 56,
              height: 56,
              mr: 2,
              bgcolor: theme.palette.primary.main,
            }}
          >
            {!candidate.avatar && <PersonIcon />}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
              {candidate.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {candidate.position}
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            label={candidate.status}
            color={getStatusColor(candidate.status)}
            size="small"
            sx={{ height: 24 }}
          />
          <Chip
            label={`Опыт: ${candidate.experience}`}
            variant="outlined"
            size="small"
            sx={{ height: 24 }}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
          Навыки:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2, minHeight: 52 }}>
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
              sx={{ fontSize: '0.7rem', height: 24 }}
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
          }}
        >
          Активность: {formatDate(candidate.lastActivity)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
