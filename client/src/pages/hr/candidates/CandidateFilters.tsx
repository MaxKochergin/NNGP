import { useState } from 'react';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
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
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

interface CandidateFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
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
  const [status, setStatus] = useState('any');
  const [position, setPosition] = useState('any');
  const [experience, setExperience] = useState('any');
  const [activity, setActivity] = useState('any');
  const [skill, setSkill] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [onlyWithResume, setOnlyWithResume] = useState(false);

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
    const filters = {
      status: status === 'any' ? '' : status,
      position: position === 'any' ? '' : position,
      experience,
      activity,
      skills,
      onlyWithResume,
    };
    onApply(filters);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Фильтры кандидатов</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3} sx={{ flexGrow: 1, overflow: 'auto' }}>
        <FormControl fullWidth>
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

        <FormControl fullWidth>
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

        <FormControl fullWidth>
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
          <Typography variant="subtitle2" gutterBottom>
            Навыки
          </Typography>
          <Box sx={{ display: 'flex', mb: 1 }}>
            <TextField
              fullWidth
              size="small"
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
            <Button variant="contained" sx={{ ml: 1 }} onClick={handleAddSkill} disabled={!skill}>
              <AddIcon />
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {skills.map(s => (
              <Chip key={s} label={s} onDelete={() => handleRemoveSkill(s)} size="small" />
            ))}
          </Box>
        </Box>

        <FormControl fullWidth>
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
              />
            }
            label="Только с резюме"
          />
        </FormGroup>
      </Stack>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" fullWidth onClick={onClear}>
          Сбросить
        </Button>
        <Button variant="contained" fullWidth onClick={handleApplyFilters}>
          Применить
        </Button>
      </Box>
    </Box>
  );
};

export default CandidateFilters;
