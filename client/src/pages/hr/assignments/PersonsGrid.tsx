import { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { AssignmentType, PersonType } from './AssignmentDashboard';
import PersonCard from './PersonCard';

// Моковые данные сотрудников
const mockEmployees = [
  {
    id: 'emp1',
    name: 'Смирнов Дмитрий Константинович',
    position: 'Инженер-конструктор',
    department: 'Конструкторский отдел',
    photo: '',
  },
  {
    id: 'emp2',
    name: 'Петрова Анна Сергеевна',
    position: 'Ведущий инженер',
    department: 'Технический отдел',
    photo: '',
  },
  {
    id: 'emp3',
    name: 'Сидоров Алексей Петрович',
    position: 'Архитектор',
    department: 'BIM-отдел',
    photo: '',
  },
  {
    id: 'emp4',
    name: 'Козлова Елена Викторовна',
    position: 'Руководитель проекта',
    department: 'Управление проектами',
    photo: '',
  },
  {
    id: 'emp5',
    name: 'Соколов Дмитрий Александрович',
    position: 'BIM-координатор',
    department: 'BIM-отдел',
    photo: '',
  },
];

// Моковые данные кандидатов
const mockCandidates = [
  {
    id: 'cand1',
    name: 'Смирнов Максим Алексеевич',
    position: 'Инженер-проектировщик',
    photo: '',
  },
  {
    id: 'cand2',
    name: 'Новикова Екатерина Владимировна',
    position: 'Инженер-конструктор',
    photo: '',
  },
  {
    id: 'cand3',
    name: 'Кузнецов Андрей Сергеевич',
    position: 'BIM-специалист',
    photo: '',
  },
];

// Отделы для фильтрации
const departments = [
  'Все отделы',
  'Конструкторский отдел',
  'Технический отдел',
  'BIM-отдел',
  'Управление проектами',
];

// Должности для фильтрации
const positions = [
  'Все должности',
  'Инженер-конструктор',
  'Ведущий инженер',
  'Архитектор',
  'Руководитель проекта',
  'BIM-координатор',
  'BIM-специалист',
  'Инженер-проектировщик',
];

interface PersonsGridProps {
  personType: PersonType;
  onAssign: (person: any, type: AssignmentType) => void;
}

const PersonsGrid = ({ personType, onAssign }: PersonsGridProps) => {
  // Получаем соответствующие данные в зависимости от выбранного типа
  const [persons, setPersons] = useState<any[]>([]);

  // Состояния для фильтров
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('Все отделы');
  const [positionFilter, setPositionFilter] = useState('Все должности');

  // Фильтрованные данные
  const [filteredPersons, setFilteredPersons] = useState<any[]>([]);

  // Загружаем данные при изменении типа пользователей
  useEffect(() => {
    setPersons(personType === 'employee' ? mockEmployees : mockCandidates);
  }, [personType]);

  // Применяем фильтры при изменении значений
  useEffect(() => {
    let filtered = [...persons];

    // Фильтр по поисковому запросу (ФИО)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(person => person.name.toLowerCase().includes(query));
    }

    // Фильтр по отделу
    if (departmentFilter !== 'Все отделы') {
      filtered = filtered.filter(person => person.department === departmentFilter);
    }

    // Фильтр по должности
    if (positionFilter !== 'Все должности') {
      filtered = filtered.filter(person => person.position === positionFilter);
    }

    setFilteredPersons(filtered);
  }, [persons, searchQuery, departmentFilter, positionFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDepartmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setDepartmentFilter(event.target.value as string);
  };

  const handlePositionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPositionFilter(event.target.value as string);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDepartmentFilter('Все отделы');
    setPositionFilter('Все должности');
  };

  const isFiltered =
    searchQuery || departmentFilter !== 'Все отделы' || positionFilter !== 'Все должности';

  return (
    <Box>
      {/* Фильтры */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              placeholder="Поиск по ФИО"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>

          {personType === 'employee' && (
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="department-filter-label">Отдел</InputLabel>
                <Select
                  labelId="department-filter-label"
                  value={departmentFilter}
                  label="Отдел"
                  onChange={handleDepartmentChange}
                >
                  {departments.map(dept => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="position-filter-label">Должность</InputLabel>
              <Select
                labelId="position-filter-label"
                value={positionFilter}
                label="Должность"
                onChange={handlePositionChange}
              >
                {positions.map(pos => (
                  <MenuItem key={pos} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {isFiltered && (
            <Grid item xs={12} sm={6} md={2}>
              <Button fullWidth variant="outlined" onClick={handleClearFilters}>
                Сбросить фильтры
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Результаты фильтрации */}
      {isFiltered && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1">
            Найдено: {filteredPersons.length}{' '}
            {personType === 'employee' ? 'сотрудников' : 'кандидатов'}
            {isFiltered && (
              <Chip
                label="Фильтры активны"
                size="small"
                color="primary"
                onDelete={handleClearFilters}
                sx={{ ml: 2 }}
              />
            )}
          </Typography>
        </Box>
      )}

      {/* Сетка с карточками */}
      {filteredPersons.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            {personType === 'employee' ? 'Сотрудники' : 'Кандидаты'} не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Попробуйте изменить параметры поиска или фильтрации
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredPersons.map(person => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={person.id}>
              <PersonCard person={person} personType={personType} onAssign={onAssign} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PersonsGrid;
