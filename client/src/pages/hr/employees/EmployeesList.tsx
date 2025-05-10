import { useState } from 'react';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Container,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EmployeeCard from './EmployeeCard';
import EmployeeFilters from './EmployeeFilters';

// Типы данных для сотрудников
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  experience: string;
  status: string;
  hireDate: string;
  skills: string[];
  avatar: string | null;
}

// Временные тестовые данные
const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Иванов Иван Иванович',
    position: 'Ведущий инженер-конструктор',
    department: 'Конструкторский отдел',
    experience: '5 лет',
    status: 'Работает',
    hireDate: '2025-04-15',
    skills: ['AutoCAD', 'Revit', 'ЛИРА-САПР', 'Железобетонные конструкции'],
    avatar: null,
  },
  {
    id: '2',
    name: 'Петрова Анна Сергеевна',
    position: 'Инженер-проектировщик ОВиК',
    department: 'Отдел инженерных систем',
    experience: '3 года',
    status: 'Работает',
    hireDate: '2025-04-10',
    skills: ['AutoCAD', 'Revit MEP', 'Расчет систем вентиляции'],
    avatar: null,
  },
  {
    id: '3',
    name: 'Сидоров Алексей Петрович',
    position: 'Главный инженер проекта',
    department: 'Управление проектами',
    experience: '8 лет',
    status: 'Работает',
    hireDate: '2024-11-03',
    skills: ['BIM', 'Управление проектами', 'Нормативная документация', 'Техническая экспертиза'],
    avatar: null,
  },
  {
    id: '4',
    name: 'Козлова Екатерина Владимировна',
    position: 'Главный архитектор',
    department: 'Архитектурный отдел',
    experience: '7 лет',
    status: 'Отпуск',
    hireDate: '2025-01-15',
    skills: ['ArchiCAD', 'Revit', '3D моделирование', 'Концептуальное проектирование'],
    avatar: null,
  },
  {
    id: '5',
    name: 'Соколов Дмитрий Александрович',
    position: 'BIM-координатор',
    department: 'BIM-отдел',
    experience: '4 года',
    status: 'Работает',
    hireDate: '2025-02-20',
    skills: ['Revit', 'Navisworks', 'BIM-координация', 'Autodesk BIM 360'],
    avatar: null,
  },
];

const EmployeesList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(mockEmployees);
  const [filterApplied, setFilterApplied] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredEmployees(mockEmployees);
    } else {
      const filtered = mockEmployees.filter(
        employee =>
          employee.name.toLowerCase().includes(query.toLowerCase()) ||
          employee.position.toLowerCase().includes(query.toLowerCase()) ||
          employee.department.toLowerCase().includes(query.toLowerCase()) ||
          employee.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredEmployees(filtered);
    }
  };

  const handleFilterClick = () => {
    setFiltersOpen(true);
  };

  const handleFilterClose = () => {
    setFiltersOpen(false);
  };

  const handleEmployeeClick = (employeeId: string) => {
    navigate(`/app/hr/employees/${employeeId}`);
  };

  const handleAddEmployee = () => {
    navigate('/app/hr/employees/new');
  };

  const applyFilters = (filters: any) => {
    // Логика применения фильтров
    // В реальном приложении здесь будет более сложная логика фильтрации
    const filtered = mockEmployees.filter(employee => {
      if (
        filters.department &&
        filters.department !== 'any' &&
        employee.department !== filters.department
      ) {
        return false;
      }
      if (
        filters.position &&
        filters.position !== 'any' &&
        !employee.position.includes(filters.position)
      ) {
        return false;
      }
      if (filters.status && filters.status !== 'any' && employee.status !== filters.status) {
        return false;
      }
      return true;
    });

    setFilteredEmployees(filtered);
    setFilterApplied(true);
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setFilteredEmployees(mockEmployees);
    setFilterApplied(false);
    setFiltersOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 0, sm: 1 } }}>
        {/* Заголовок и поиск */}
        <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              flexGrow: 1,
              fontSize: { xs: '1.7rem', sm: '2rem', md: '2.125rem' },
            }}
          >
            Сотрудники
            {filterApplied && (
              <Chip
                label="Фильтры активны"
                size="small"
                color="primary"
                onDelete={clearFilters}
                sx={{ ml: 2, verticalAlign: 'middle' }}
              />
            )}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
            <TextField
              size="small"
              placeholder="Поиск сотрудников..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 240, md: 300 } }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Фильтры
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddEmployee}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Добавить
            </Button>
          </Box>
        </Box>

        {/* Мобильные кнопки */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1, mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            fullWidth
          >
            Фильтры
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddEmployee} fullWidth>
            Добавить
          </Button>
        </Box>

        {/* Список сотрудников */}
        {filteredEmployees.length > 0 ? (
          <Box sx={{ mt: 0.5 }}>
            <Grid
              container
              spacing={{ xs: 2, sm: 3 }}
              alignItems="stretch"
              sx={{
                '& .MuiGrid-item': {
                  display: 'flex',
                },
              }}
            >
              {filteredEmployees.map(employee => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={employee.id}
                  sx={{
                    height: { xs: 'auto', sm: '250px', md: '260px', lg: '270px' },
                  }}
                >
                  <EmployeeCard
                    employee={employee}
                    onClick={() => handleEmployeeClick(employee.id)}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              Сотрудники не найдены
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Попробуйте изменить параметры поиска или фильтрации
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Мобильные фильтры */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={filtersOpen}
        onClose={handleFilterClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            height: { xs: 'auto', sm: '100%' },
            maxHeight: { xs: '85vh', sm: '100%' },
            p: { xs: 2, sm: 3 },
            borderTopLeftRadius: { xs: 16, sm: 0 },
            borderTopRightRadius: { xs: 16, sm: 0 },
          },
        }}
      >
        <EmployeeFilters
          onClose={handleFilterClose}
          onApply={applyFilters}
          onClear={clearFilters}
        />
      </Drawer>
    </Container>
  );
};

export default EmployeesList;
