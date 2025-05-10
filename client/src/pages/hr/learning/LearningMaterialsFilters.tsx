import React, { useState } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  LearningMaterialDifficulty,
  LearningMaterialStatus,
  LearningMaterialType,
} from '../../../types/learning-material';

interface LearningMaterialsFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  onClear: () => void;
}

// Моковые данные для выпадающих списков
const departments = [
  'Конструкторский отдел',
  'Технический отдел',
  'BIM-отдел',
  'Финансовый отдел',
  'Отдел проектирования',
  'Управление проектами',
];

const positions = [
  'Инженер-конструктор',
  'Ведущий инженер',
  'Архитектор',
  'Руководитель проекта',
  'BIM-координатор',
  'Инженер-проектировщик',
  'Сметчик',
];

const LearningMaterialsFilters = ({ onClose, onApply, onClear }: LearningMaterialsFiltersProps) => {
  const theme = useTheme();

  // Состояния фильтров
  const [type, setType] = useState<LearningMaterialType | 'all'>('all');
  const [status, setStatus] = useState<LearningMaterialStatus | 'all'>('all');
  const [difficulty, setDifficulty] = useState<LearningMaterialDifficulty | 'all'>('all');
  const [department, setDepartment] = useState<string>('all');
  const [position, setPosition] = useState<string>('all');
  const [isMandatory, setIsMandatory] = useState<boolean | undefined>(undefined);
  const [maxDuration, setMaxDuration] = useState<number>(180); // в минутах

  // Обработчики изменения состояния
  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as LearningMaterialType | 'all');
  };

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatus(event.target.value as LearningMaterialStatus | 'all');
  };

  const handleDifficultyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDifficulty(event.target.value as LearningMaterialDifficulty | 'all');
  };

  const handleDepartmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDepartment(event.target.value as string);
  };

  const handlePositionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPosition(event.target.value as string);
  };

  const handleMandatoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setIsMandatory(true);
    } else {
      setIsMandatory(undefined);
    }
  };

  const handleMaxDurationChange = (_: Event, newValue: number | number[]) => {
    setMaxDuration(newValue as number);
  };

  // Сброс всех фильтров
  const handleClearFilters = () => {
    setType('all');
    setStatus('all');
    setDifficulty('all');
    setDepartment('all');
    setPosition('all');
    setIsMandatory(undefined);
    setMaxDuration(180);
    onClear();
  };

  // Применение фильтров
  const handleApplyFilters = () => {
    const filters = {
      type,
      status,
      difficulty,
      department,
      position,
      isMandatory,
      maxDuration,
    };
    onApply(filters);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Фильтры</Typography>
        <Button
          variant="text"
          color="inherit"
          startIcon={<CloseIcon />}
          onClick={onClose}
          size="small"
        >
          Закрыть
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, overflow: 'auto', pr: 1 }}>
        <Stack spacing={3}>
          {/* Тип материала */}
          <FormControl fullWidth size="small">
            <InputLabel id="type-filter-label">Тип материала</InputLabel>
            <Select
              labelId="type-filter-label"
              value={type}
              label="Тип материала"
              onChange={handleTypeChange}
            >
              <MenuItem value="all">Все типы</MenuItem>
              <MenuItem value="course">Курсы</MenuItem>
              <MenuItem value="video">Видео</MenuItem>
              <MenuItem value="article">Статьи</MenuItem>
              <MenuItem value="document">Документы</MenuItem>
              <MenuItem value="presentation">Презентации</MenuItem>
            </Select>
          </FormControl>

          {/* Статус */}
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Статус</InputLabel>
            <Select
              labelId="status-filter-label"
              value={status}
              label="Статус"
              onChange={handleStatusChange}
            >
              <MenuItem value="all">Все статусы</MenuItem>
              <MenuItem value="active">Активный</MenuItem>
              <MenuItem value="draft">Черновик</MenuItem>
              <MenuItem value="archived">Архив</MenuItem>
            </Select>
          </FormControl>

          {/* Сложность */}
          <FormControl fullWidth size="small">
            <InputLabel id="difficulty-filter-label">Сложность</InputLabel>
            <Select
              labelId="difficulty-filter-label"
              value={difficulty}
              label="Сложность"
              onChange={handleDifficultyChange}
            >
              <MenuItem value="all">Любая сложность</MenuItem>
              <MenuItem value="beginner">Начальный</MenuItem>
              <MenuItem value="intermediate">Средний</MenuItem>
              <MenuItem value="advanced">Продвинутый</MenuItem>
              <MenuItem value="expert">Экспертный</MenuItem>
            </Select>
          </FormControl>

          <Divider />

          {/* Отдел */}
          <FormControl fullWidth size="small">
            <InputLabel id="department-filter-label">Отдел</InputLabel>
            <Select
              labelId="department-filter-label"
              value={department}
              label="Отдел"
              onChange={handleDepartmentChange}
            >
              <MenuItem value="all">Все отделы</MenuItem>
              {departments.map(dept => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Должность */}
          <FormControl fullWidth size="small">
            <InputLabel id="position-filter-label">Должность</InputLabel>
            <Select
              labelId="position-filter-label"
              value={position}
              label="Должность"
              onChange={handlePositionChange}
            >
              <MenuItem value="all">Все должности</MenuItem>
              {positions.map(pos => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />

          {/* Обязательные */}
          <FormControlLabel
            control={
              <Checkbox
                checked={isMandatory === true}
                onChange={handleMandatoryChange}
                color="primary"
              />
            }
            label="Только обязательные материалы"
          />

          {/* Максимальная длительность */}
          <Box>
            <Typography variant="body2" gutterBottom>
              Максимальная длительность:{' '}
              {maxDuration > 60
                ? `${Math.floor(maxDuration / 60)} ч ${maxDuration % 60} мин`
                : `${maxDuration} мин`}
            </Typography>
            <Slider
              value={maxDuration}
              onChange={handleMaxDurationChange}
              min={10}
              max={180}
              step={10}
              valueLabelDisplay="auto"
              valueLabelFormat={value => {
                if (value >= 60) {
                  return `${Math.floor(value / 60)}ч ${value % 60}м`;
                }
                return `${value}м`;
              }}
            />
          </Box>
        </Stack>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="outlined" fullWidth onClick={handleClearFilters}>
          Сбросить
        </Button>
        <Button variant="contained" fullWidth onClick={handleApplyFilters}>
          Применить
        </Button>
      </Box>
    </Box>
  );
};

export default LearningMaterialsFilters;
