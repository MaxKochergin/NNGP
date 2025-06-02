import { useEffect, useState } from 'react';
import {
  Add as AddIcon,
  Close as CloseIcon,
  DragHandle as DragHandleIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCandidatesFilters } from '../../../features/candidates/candidatesHooks';
import { CandidateFilters as CandidateFiltersType } from '../../../features/candidates/candidatesSlice';

interface CandidateFiltersProps {
  onClose: () => void;
  onApply: (filters: CandidateFiltersType) => void;
  onClear: () => void;
}

const statuses = [
  { value: 'any', label: 'Любой статус' },
  { value: 'Новый', label: 'Новый' },
  { value: 'На собеседовании', label: 'На собеседовании' },
  { value: 'Тестовое задание', label: 'Тестовое задание' },
  { value: 'Принят', label: 'Принят' },
  { value: 'Отклонен', label: 'Отклонен' },
];

const positions = [
  { value: 'any', label: 'Любая позиция' },
  { value: 'Инженер-конструктор', label: 'Инженер-конструктор' },
  { value: 'Ведущий инженер-конструктор', label: 'Ведущий инженер-конструктор' },
  { value: 'Инженер-проектировщик', label: 'Инженер-проектировщик' },
  { value: 'Инженер-проектировщик ОВиК', label: 'Инженер-проектировщик ОВиК' },
  { value: 'Архитектор', label: 'Архитектор' },
  { value: 'BIM-координатор', label: 'BIM-координатор' },
];

const experienceRanges = [
  { value: 'any', label: 'Любой опыт' },
  { value: '0-1', label: 'До 1 года' },
  { value: '1-3', label: 'От 1 до 3 лет' },
  { value: '3-5', label: 'От 3 до 5 лет' },
  { value: '5-10', label: 'От 5 до 10 лет' },
  { value: '10+', label: 'Более 10 лет' },
];

const activityPeriods = [
  { value: 'any', label: 'За все время' },
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'За последнюю неделю' },
  { value: 'month', label: 'За последний месяц' },
  { value: 'quarter', label: 'За последние 3 месяца' },
];

const CandidateFilters = ({ onClose, onApply, onClear }: CandidateFiltersProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Получаем текущие фильтры из Redux
  const { filters: currentFilters, activeFiltersCount } = useCandidatesFilters();

  // Локальное состояние для формы
  const [status, setStatus] = useState(currentFilters.status || 'any');
  const [position, setPosition] = useState(currentFilters.position || 'any');
  const [experience, setExperience] = useState(currentFilters.experience || 'any');
  const [activity, setActivity] = useState(currentFilters.activity || 'any');
  const [skill, setSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(currentFilters.skills || []);
  const [onlyWithResume, setOnlyWithResume] = useState(currentFilters.onlyWithResume || false);

  // Синхронизируем локальное состояние с Redux при изменении фильтров
  useEffect(() => {
    setStatus(currentFilters.status || 'any');
    setPosition(currentFilters.position || 'any');
    setExperience(currentFilters.experience || 'any');
    setActivity(currentFilters.activity || 'any');
    setSkills(currentFilters.skills || []);
    setOnlyWithResume(currentFilters.onlyWithResume || false);
  }, [currentFilters]);

  const handleAddSkill = () => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleApplyFilters = () => {
    const filters: CandidateFiltersType = {
      status: status === 'any' ? undefined : status,
      position: position === 'any' ? undefined : position,
      experience: experience === 'any' ? undefined : experience,
      activity: activity === 'any' ? undefined : activity,
      skills: skills.length > 0 ? skills : undefined,
      onlyWithResume: onlyWithResume || undefined,
    };
    onApply(filters);
  };

  const handleClearFilters = () => {
    setStatus('any');
    setPosition('any');
    setExperience('any');
    setActivity('any');
    setSkills([]);
    setOnlyWithResume(false);
    onClear();
  };

  const hasChanges = () => {
    return (
      status !== (currentFilters.status || 'any') ||
      position !== (currentFilters.position || 'any') ||
      experience !== (currentFilters.experience || 'any') ||
      activity !== (currentFilters.activity || 'any') ||
      JSON.stringify(skills) !== JSON.stringify(currentFilters.skills || []) ||
      onlyWithResume !== (currentFilters.onlyWithResume || false)
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Заголовок с drag handle для мобильных */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          position: 'relative',
        }}
      >
        {isMobile && (
          <Box
            sx={{
              position: 'absolute',
              top: -16,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 40,
              height: 4,
              bgcolor: 'divider',
              borderRadius: 2,
            }}
          />
        )}

        <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Фильтры кандидатов
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
            />
          )}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack
        spacing={3}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.divider,
            borderRadius: 3,
          },
        }}
      >
        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
          <InputLabel id="status-label">Статус</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={status}
            label="Статус"
            onChange={e => setStatus(e.target.value)}
          >
            {statuses.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
          <InputLabel id="position-label">Должность</InputLabel>
          <Select
            labelId="position-label"
            id="position-select"
            value={position}
            label="Должность"
            onChange={e => setPosition(e.target.value)}
          >
            {positions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
          <InputLabel id="experience-label">Опыт работы</InputLabel>
          <Select
            labelId="experience-label"
            id="experience-select"
            value={experience}
            label="Опыт работы"
            onChange={e => setExperience(e.target.value)}
          >
            {experienceRanges.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            Навыки
          </Typography>
          <Box sx={{ display: 'flex', mb: 1, gap: 1 }}>
            <TextField
              fullWidth
              size={isMobile ? 'small' : 'medium'}
              placeholder="Введите навык"
              value={skill}
              onChange={e => setSkill(e.target.value)}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  handleAddSkill();
                  e.preventDefault();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddSkill}
              disabled={!skill}
              sx={{ minWidth: 'auto', px: { xs: 1, sm: 2 } }}
            >
              <AddIcon />
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, minHeight: 32 }}>
            {skills.map(s => (
              <Chip
                key={s}
                label={s}
                onDelete={() => handleRemoveSkill(s)}
                size="small"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
            {skills.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ py: 1 }}>
                Навыки не выбраны
              </Typography>
            )}
          </Box>
        </Box>

        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
          <InputLabel id="activity-label">Активность</InputLabel>
          <Select
            labelId="activity-label"
            id="activity-select"
            value={activity}
            label="Активность"
            onChange={e => setActivity(e.target.value)}
          >
            {activityPeriods.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={onlyWithResume}
                onChange={e => setOnlyWithResume(e.target.checked)}
                size={isMobile ? 'small' : 'medium'}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Только с резюме
              </Typography>
            }
          />
        </FormGroup>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Кнопки действий */}
      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={handleApplyFilters}
          disabled={!hasChanges()}
          fullWidth
          size={isMobile ? 'medium' : 'large'}
        >
          Применить фильтры
          {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
        </Button>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            disabled={activeFiltersCount === 0}
            fullWidth
            size={isMobile ? 'medium' : 'large'}
          >
            Сбросить все
          </Button>
          <Button variant="text" onClick={onClose} fullWidth size={isMobile ? 'medium' : 'large'}>
            Отмена
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CandidateFilters;
