import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { TestDifficulty, TestStatus, TestTargetAudience, TestType } from '../../../types/test';

interface TestsFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  onClear: () => void;
}

const TestsFilters = ({ onClose, onApply, onClear }: TestsFiltersProps) => {
  // Состояния для фильтров
  const [targetAudience, setTargetAudience] = useState<TestTargetAudience | 'all'>('all');
  const [status, setStatus] = useState<TestStatus | 'all'>('all');
  const [type, setType] = useState<TestType | 'all'>('all');
  const [difficulty, setDifficulty] = useState<TestDifficulty | 'all'>('all');
  const [department, setDepartment] = useState('all');
  const [position, setPosition] = useState('all');
  const [maxDuration, setMaxDuration] = useState(120);

  // Временные списки отделов и должностей (в реальном приложении должны быть получены из API)
  const departments = ['Конструкторский отдел', 'Технический отдел', 'BIM-отдел'];
  const positions = [
    'Инженер-конструктор',
    'Архитектор',
    'BIM-координатор',
    'Руководитель проекта',
  ];

  const handleApply = () => {
    const filters = {
      targetAudience,
      status,
      type,
      difficulty,
      department,
      position,
      maxDuration,
    };
    onApply(filters);
  };

  const handleClear = () => {
    setTargetAudience('all');
    setStatus('all');
    setType('all');
    setDifficulty('all');
    setDepartment('all');
    setPosition('all');
    setMaxDuration(120);
    onClear();
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Фильтры</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ overflow: 'auto', flexGrow: 1, pr: 1 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="target-audience-label">Целевая аудитория</InputLabel>
          <Select
            labelId="target-audience-label"
            value={targetAudience}
            label="Целевая аудитория"
            onChange={e => setTargetAudience(e.target.value as TestTargetAudience | 'all')}
          >
            <MenuItem value="all">Все</MenuItem>
            <MenuItem value="candidates">Кандидаты</MenuItem>
            <MenuItem value="employees">Сотрудники</MenuItem>
            <MenuItem value="both">Все категории</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="status-label">Статус</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            label="Статус"
            onChange={e => setStatus(e.target.value as TestStatus | 'all')}
          >
            <MenuItem value="all">Все статусы</MenuItem>
            <MenuItem value="active">Активный</MenuItem>
            <MenuItem value="draft">Черновик</MenuItem>
            <MenuItem value="archived">Архивный</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="type-label">Тип теста</InputLabel>
          <Select
            labelId="type-label"
            value={type}
            label="Тип теста"
            onChange={e => setType(e.target.value as TestType | 'all')}
          >
            <MenuItem value="all">Все типы</MenuItem>
            <MenuItem value="professional">Профессиональный</MenuItem>
            <MenuItem value="psychological">Психологический</MenuItem>
            <MenuItem value="knowledge">Знания</MenuItem>
            <MenuItem value="skills">Навыки</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="difficulty-label">Сложность</InputLabel>
          <Select
            labelId="difficulty-label"
            value={difficulty}
            label="Сложность"
            onChange={e => setDifficulty(e.target.value as TestDifficulty | 'all')}
          >
            <MenuItem value="all">Все уровни</MenuItem>
            <MenuItem value="easy">Лёгкий</MenuItem>
            <MenuItem value="medium">Средний</MenuItem>
            <MenuItem value="hard">Сложный</MenuItem>
            <MenuItem value="expert">Экспертный</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="department-label">Отдел</InputLabel>
          <Select
            labelId="department-label"
            value={department}
            label="Отдел"
            onChange={e => setDepartment(e.target.value)}
          >
            <MenuItem value="all">Все отделы</MenuItem>
            {departments.map(dept => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="position-label">Должность</InputLabel>
          <Select
            labelId="position-label"
            value={position}
            label="Должность"
            onChange={e => setPosition(e.target.value)}
          >
            <MenuItem value="all">Все должности</MenuItem>
            {positions.map(pos => (
              <MenuItem key={pos} value={pos}>
                {pos}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Максимальная длительность (мин)</Typography>
          <Slider
            value={maxDuration}
            onChange={(_, newValue) => setMaxDuration(newValue as number)}
            min={15}
            max={180}
            step={15}
            valueLabelDisplay="auto"
            marks={[
              { value: 15, label: '15' },
              { value: 60, label: '60' },
              { value: 120, label: '120' },
              { value: 180, label: '180' },
            ]}
          />
        </Box>
      </Box>

      <Divider sx={{ mt: 2, mb: 2 }} />

      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={handleClear} fullWidth>
          Сбросить
        </Button>
        <Button variant="contained" onClick={handleApply} fullWidth>
          Применить
        </Button>
      </Stack>
    </Box>
  );
};

export default TestsFilters;
