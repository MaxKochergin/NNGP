import { useState } from 'react';
import { Close as CloseIcon, DragHandle as DragHandleIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Collapse,
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

  // Расширенные breakpoints для лучшей адаптивности
  const isXSmall = useMediaQuery('(max-width:320px)');
  const isVerySmall = useMediaQuery('(max-width:375px)');
  const isSmall = useMediaQuery('(max-width:480px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleClearFilters = () => {
    setStatus('any');
    setDepartment('any');
    setPosition('any');
    setExperience('any');
    setHirePeriod('any');
    setShowDismissed(false);
    onClear();
  };

  // Подсчет активных фильтров
  const getActiveFiltersCount = () => {
    let count = 0;
    if (status !== 'any') count++;
    if (department !== 'any') count++;
    if (position !== 'any') count++;
    if (experience !== 'any') count++;
    if (hirePeriod !== 'any') count++;
    if (showDismissed) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Drag handle для мобильных */}
      {isMobile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            py: 1,
            cursor: 'grab',
            '&:active': {
              cursor: 'grabbing',
            },
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 4,
              bgcolor: 'grey.300',
              borderRadius: 2,
            }}
          />
        </Box>
      )}

      {/* Заголовок */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: { xs: isXSmall ? 1 : 1.5, sm: 2 },
          px: { xs: 0, sm: 0 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              fontSize: {
                xs: isXSmall ? '1rem' : isVerySmall ? '1.05rem' : '1.1rem',
                sm: '1.25rem',
              },
            }}
          >
            Фильтры
          </Typography>
          {activeFiltersCount > 0 && (
            <Chip
              label={activeFiltersCount}
              size="small"
              color="primary"
              sx={{
                height: { xs: 20, sm: 24 },
                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                minWidth: { xs: 20, sm: 24 },
                '& .MuiChip-label': {
                  px: { xs: 0.5, sm: 1 },
                },
              }}
            />
          )}
        </Box>

        <IconButton
          onClick={onClose}
          size={isXSmall ? 'small' : 'medium'}
          sx={{
            ml: 1,
            p: { xs: 0.5, sm: 1 },
          }}
        >
          <CloseIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
      </Box>

      <Divider sx={{ mb: { xs: isXSmall ? 1.5 : 2, sm: 3 } }} />

      {/* Фильтры */}
      <Stack
        spacing={{ xs: isXSmall ? 1.5 : 2, sm: 3 }}
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          pr: { xs: 0, sm: 1 },
          pb: 1,
          // Улучшенная прокрутка для мобильных
          '&::-webkit-scrollbar': {
            width: { xs: 4, sm: 6 },
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'grey.300',
            borderRadius: 3,
            '&:hover': {
              bgcolor: 'grey.400',
            },
          },
        }}
      >
        {/* Статус */}
        <FormControl
          fullWidth
          size={isMobile ? 'small' : 'medium'}
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            },
            '& .MuiSelect-select': {
              fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            },
          }}
        >
          <InputLabel id="status-label">Статус</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={status}
            label="Статус"
            onChange={e => setStatus(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: { xs: 200, sm: 300 },
                  '& .MuiMenuItem-root': {
                    fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
                    minHeight: { xs: 36, sm: 48 },
                    px: { xs: 1.5, sm: 2 },
                  },
                },
              },
            }}
          >
            {statuses.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Отдел */}
        <FormControl
          fullWidth
          size={isMobile ? 'small' : 'medium'}
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            },
            '& .MuiSelect-select': {
              fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            },
          }}
        >
          <InputLabel id="department-label">Отдел</InputLabel>
          <Select
            labelId="department-label"
            id="department-select"
            value={department}
            label="Отдел"
            onChange={e => setDepartment(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: { xs: 200, sm: 300 },
                  '& .MuiMenuItem-root': {
                    fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
                    minHeight: { xs: 36, sm: 48 },
                    px: { xs: 1.5, sm: 2 },
                  },
                },
              },
            }}
          >
            {departments.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {isXSmall && option.label.length > 20
                  ? `${option.label.substring(0, 20)}...`
                  : option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Должность */}
        <FormControl
          fullWidth
          size={isMobile ? 'small' : 'medium'}
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            },
            '& .MuiSelect-select': {
              fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            },
          }}
        >
          <InputLabel id="position-label">Должность</InputLabel>
          <Select
            labelId="position-label"
            id="position-select"
            value={position}
            label="Должность"
            onChange={e => setPosition(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: { xs: 200, sm: 300 },
                  '& .MuiMenuItem-root': {
                    fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
                    minHeight: { xs: 36, sm: 48 },
                    px: { xs: 1.5, sm: 2 },
                  },
                },
              },
            }}
          >
            {positions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {isXSmall && option.label.length > 25
                  ? `${option.label.substring(0, 25)}...`
                  : option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Опыт работы */}
        <FormControl
          fullWidth
          size={isMobile ? 'small' : 'medium'}
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            },
            '& .MuiSelect-select': {
              fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            },
          }}
        >
          <InputLabel id="experience-label">Опыт работы</InputLabel>
          <Select
            labelId="experience-label"
            id="experience-select"
            value={experience}
            label="Опыт работы"
            onChange={e => setExperience(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: { xs: 200, sm: 300 },
                  '& .MuiMenuItem-root': {
                    fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
                    minHeight: { xs: 36, sm: 48 },
                    px: { xs: 1.5, sm: 2 },
                  },
                },
              },
            }}
          >
            {experienceRanges.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Период приема */}
        <FormControl
          fullWidth
          size={isMobile ? 'small' : 'medium'}
          sx={{
            '& .MuiInputLabel-root': {
              fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            },
            '& .MuiSelect-select': {
              fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            },
          }}
        >
          <InputLabel id="hire-period-label">
            {isXSmall ? 'Период приема' : 'Период приема на работу'}
          </InputLabel>
          <Select
            labelId="hire-period-label"
            id="hire-period-select"
            value={hirePeriod}
            label={isXSmall ? 'Период приема' : 'Период приема на работу'}
            onChange={e => setHirePeriod(e.target.value)}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: { xs: 200, sm: 300 },
                  '& .MuiMenuItem-root': {
                    fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
                    minHeight: { xs: 36, sm: 48 },
                    px: { xs: 1.5, sm: 2 },
                  },
                },
              },
            }}
          >
            {hirePeriods.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Переключатель уволенных */}
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={showDismissed}
                onChange={e => setShowDismissed(e.target.checked)}
                size={isXSmall ? 'small' : 'medium'}
              />
            }
            label={isXSmall ? 'Уволенные' : 'Показывать уволенных'}
            sx={{
              '& .MuiFormControlLabel-label': {
                fontSize: {
                  xs: isXSmall ? '0.85rem' : '0.9rem',
                  sm: '1rem',
                },
              },
              '& .MuiSwitch-root': {
                mr: { xs: 1, sm: 2 },
              },
            }}
          />
        </FormGroup>
      </Stack>

      <Divider sx={{ my: { xs: isXSmall ? 1.5 : 2, sm: 3 } }} />

      {/* Кнопки действий */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, sm: 2 },
          flexDirection: { xs: isXSmall ? 'column' : 'row', sm: 'row' },
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          onClick={handleClearFilters}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            py: { xs: 1, sm: 1.5 },
            minHeight: { xs: 40, sm: 48 },
          }}
        >
          Сбросить
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={handleApplyFilters}
          size={isMobile ? 'medium' : 'large'}
          sx={{
            fontSize: { xs: isXSmall ? '0.85rem' : '0.9rem', sm: '1rem' },
            py: { xs: 1, sm: 1.5 },
            minHeight: { xs: 40, sm: 48 },
          }}
        >
          Применить {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeFilters;
