import { useState } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
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
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface EmployeeFiltersProps {
  onClose: () => void;
  onApply: (filters: any) => void;
  onClear: () => void;
}

const statuses = [
  { value: 'any', label: 'Любой статус' },
  { value: 'Работает', label: 'Работает' },
  { value: 'Отпуск', label: 'Отпуск' },
  { value: 'Больничный', label: 'Больничный' },
  { value: 'Удаленная работа', label: 'Удаленная работа' },
  { value: 'Командировка', label: 'Командировка' },
  { value: 'Уволен', label: 'Уволен' },
];

const departments = [
  { value: 'any', label: 'Любой отдел' },
  { value: 'Конструкторский отдел', label: 'Конструкторский отдел' },
  { value: 'Архитектурный отдел', label: 'Архитектурный отдел' },
  { value: 'Отдел инженерных систем', label: 'Отдел инженерных систем' },
  { value: 'BIM-отдел', label: 'BIM-отдел' },
  { value: 'Управление проектами', label: 'Управление проектами' },
  { value: 'Сметный отдел', label: 'Сметный отдел' },
  { value: 'Технический отдел', label: 'Технический отдел' },
  { value: 'Отдел контроля качества', label: 'Отдел контроля качества' },
];

const positions = [
  { value: 'any', label: 'Любая должность' },
  { value: 'Инженер-конструктор', label: 'Инженер-конструктор' },
  { value: 'Ведущий инженер-конструктор', label: 'Ведущий инженер-конструктор' },
  { value: 'Инженер-проектировщик', label: 'Инженер-проектировщик' },
  { value: 'Архитектор', label: 'Архитектор' },
  { value: 'Главный архитектор', label: 'Главный архитектор' },
  { value: 'Главный инженер проекта', label: 'Главный инженер проекта' },
  { value: 'BIM-координатор', label: 'BIM-координатор' },
  { value: 'Сметчик', label: 'Сметчик' },
];

const experienceRanges = [
  { value: 'any', label: 'Любой опыт' },
  { value: '0-1', label: 'До 1 года' },
  { value: '1-3', label: 'От 1 до 3 лет' },
  { value: '3-5', label: 'От 3 до 5 лет' },
  { value: '5-10', label: 'От 5 до 10 лет' },
  { value: '10+', label: 'Более 10 лет' },
];

const hirePeriods = [
  { value: 'any', label: 'За все время' },
  { value: 'month', label: 'За последний месяц' },
  { value: 'quarter', label: 'За последние 3 месяца' },
  { value: 'halfyear', label: 'За последние 6 месяцев' },
  { value: 'year', label: 'За последний год' },
  { value: '3years', label: 'За последние 3 года' },
];

const EmployeeFilters = ({ onClose, onApply, onClear }: EmployeeFiltersProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [status, setStatus] = useState('any');
  const [department, setDepartment] = useState('any');
  const [position, setPosition] = useState('any');
  const [experience, setExperience] = useState('any');
  const [hirePeriod, setHirePeriod] = useState('any');
  const [showDismissed, setShowDismissed] = useState(false);

  const handleApplyFilters = () => {
    const filters = {
      status: status === 'any' ? '' : status,
      department: department === 'any' ? '' : department,
      position: position === 'any' ? '' : position,
      experience,
      hirePeriod,
      showDismissed,
    };
    onApply(filters);
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: 1, sm: 2 },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
          }}
        >
          Фильтры сотрудников
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ ml: 1 }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

      <Stack
        spacing={{ xs: 2, sm: 3 }}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          pr: { xs: 0, sm: 1 },
          pb: 1,
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
          <InputLabel id="department-label">Отдел</InputLabel>
          <Select
            labelId="department-label"
            id="department-select"
            value={department}
            label="Отдел"
            onChange={e => setDepartment(e.target.value)}
          >
            {departments.map(option => (
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

        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
          <InputLabel id="hire-period-label">Период приема на работу</InputLabel>
          <Select
            labelId="hire-period-label"
            id="hire-period-select"
            value={hirePeriod}
            label="Период приема на работу"
            onChange={e => setHirePeriod(e.target.value)}
          >
            {hirePeriods.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={showDismissed} onChange={e => setShowDismissed(e.target.checked)} />
            }
            label="Показывать уволенных"
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: { xs: '0.9rem', sm: '1rem' },
              },
            }}
          />
        </FormGroup>
      </Stack>

      <Divider sx={{ my: { xs: 2, sm: 3 } }} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" fullWidth onClick={onClear} size={isMobile ? 'medium' : 'large'}>
          Сбросить
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleApplyFilters}
          size={isMobile ? 'medium' : 'large'}
        >
          Применить
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeFilters;
