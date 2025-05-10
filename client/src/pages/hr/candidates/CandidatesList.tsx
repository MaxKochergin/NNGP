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
import CandidateCard from './CandidateCard';
import CandidateFilters from './CandidateFilters';

// Типы данных для кандидатов
export interface Candidate {
  id: string;
  name: string;
  position: string;
  experience: string;
  status: string;
  lastActivity: string;
  skills: string[];
  avatar: string | null;
}

// Временные тестовые данные
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Иванов Иван Иванович',
    position: 'Инженер-конструктор',
    experience: '5 лет',
    status: 'Новый',
    lastActivity: '2025-04-15',
    skills: ['AutoCAD', 'Revit', 'Железобетонные конструкции'],
    avatar: null,
  },
  {
    id: '2',
    name: 'Петрова Анна Сергеевна',
    position: 'Инженер-проектировщик ОВиК',
    experience: '5 лет',
    status: 'На собеседовании',
    lastActivity: '2025-04-14',
    skills: ['AutoCAD', 'Revit MEP', 'Расчет систем вентиляции'],
    avatar: null,
  },
  {
    id: '3',
    name: 'Сидоров Алексей Петрович',
    position: 'Ведущий инженер-конструктор',
    experience: '5 лет',
    status: 'Тестовое задание',
    lastActivity: '2025-04-12',
    skills: ['ЛИРА-САПР', 'AutoCAD', 'Revit', 'Расчет конструкций'],
    avatar: null,
  },
  {
    id: '4',
    name: 'Козлова Екатерина Владимировна',
    position: 'Архитектор',
    experience: '5 лет',
    status: 'Принят',
    lastActivity: '2025-04-10',
    skills: ['ArchiCAD', 'Revit', '3D моделирование'],
    avatar: null,
  },
  {
    id: '5',
    name: 'Соколов Дмитрий Александрович',
    position: 'BIM-координатор',
    experience: '5 лет',
    status: 'Отклонен',
    lastActivity: '2025-04-08',
    skills: ['Revit', 'Navisworks', 'BIM-координация'],
    avatar: null,
  },
];

const CandidatesList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>(mockCandidates);
  const [filterApplied, setFilterApplied] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredCandidates(mockCandidates);
    } else {
      const filtered = mockCandidates.filter(
        candidate =>
          candidate.name.toLowerCase().includes(query.toLowerCase()) ||
          candidate.position.toLowerCase().includes(query.toLowerCase()) ||
          candidate.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredCandidates(filtered);
    }
  };

  const handleFilterClick = () => {
    setFiltersOpen(true);
  };

  const handleFilterClose = () => {
    setFiltersOpen(false);
  };

  const handleCandidateClick = (candidateId: string) => {
    navigate(`/app/hr/candidates/${candidateId}`);
  };

  const handleAddCandidate = () => {
    navigate('/app/hr/candidates/new');
  };

  const applyFilters = (filters: any) => {
    // Логика применения фильтров
    // В реальном приложении здесь будет более сложная логика фильтрации
    const filtered = mockCandidates.filter(candidate => {
      if (filters.status && filters.status !== 'any' && candidate.status !== filters.status) {
        return false;
      }
      if (
        filters.position &&
        filters.position !== 'any' &&
        candidate.position !== filters.position
      ) {
        return false;
      }
      return true;
    });

    setFilteredCandidates(filtered);
    setFilterApplied(true);
    setFiltersOpen(false);
  };

  const clearFilters = () => {
    setFilteredCandidates(mockCandidates);
    setFilterApplied(false);
    setFiltersOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Заголовок и поиск */}
        <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Кандидаты
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
              placeholder="Поиск кандидатов..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: { xs: '100%', sm: 300 } }}
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
              onClick={handleAddCandidate}
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCandidate}
            fullWidth
          >
            Добавить
          </Button>
        </Box>

        {/* Список кандидатов */}
        {filteredCandidates.length > 0 ? (
          <Grid container spacing={2}>
            {filteredCandidates.map(candidate => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={candidate.id}>
                <CandidateCard
                  candidate={candidate}
                  onClick={() => handleCandidateClick(candidate.id)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              Кандидаты не найдены
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Попробуйте изменить параметры поиска или фильтрации
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Мобильные фильтры */}
      <Drawer
        anchor="right"
        open={filtersOpen}
        onClose={handleFilterClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            p: 3,
          },
        }}
      >
        <CandidateFilters
          onClose={handleFilterClose}
          onApply={applyFilters}
          onClear={clearFilters}
        />
      </Drawer>
    </Container>
  );
};

export default CandidatesList;
