import { useMemo, useState } from 'react';
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
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  mockTests,
  Test,
  TestDifficulty,
  TestStatus,
  TestTargetAudience,
  TestType,
} from '../../../types/test';
import TestCard from './TestCard';
import TestsFilters from './TestsFilters';

const TestsList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tests, setTests] = useState<Test[]>(mockTests);
  const [filteredTests, setFilteredTests] = useState<Test[]>(mockTests);
  const [filterApplied, setFilterApplied] = useState(false);

  // Быстрые фильтры по целевой аудитории
  const [quickTargetFilter, setQuickTargetFilter] = useState<TestTargetAudience | 'all'>('all');
  const [quickStatusFilter, setQuickStatusFilter] = useState<TestStatus | 'all'>('all');

  // Применяем быстрые фильтры и поиск
  const applyQuickFilters = (testsToFilter: Test[]) => {
    return testsToFilter.filter(test => {
      // Фильтр по целевой аудитории
      if (
        quickTargetFilter !== 'all' &&
        test.targetAudience !== quickTargetFilter &&
        test.targetAudience !== 'both'
      ) {
        return false;
      }

      // Фильтр по статусу
      if (quickStatusFilter !== 'all' && test.status !== quickStatusFilter) {
        return false;
      }

      // Поиск по запросу
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          test.title.toLowerCase().includes(query) ||
          test.description.toLowerCase().includes(query) ||
          (test.department && test.department.toLowerCase().includes(query)) ||
          (test.position && test.position.toLowerCase().includes(query))
        );
      }

      return true;
    });
  };

  // Обновляем отфильтрованные тесты при изменении фильтров или поискового запроса
  useMemo(() => {
    const newFilteredTests = applyQuickFilters(tests);
    setFilteredTests(newFilteredTests);
    setFilterApplied(
      quickTargetFilter !== 'all' || quickStatusFilter !== 'all' || searchQuery.trim() !== ''
    );
  }, [tests, quickTargetFilter, quickStatusFilter, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterClick = () => {
    setFiltersOpen(true);
  };

  const handleFilterClose = () => {
    setFiltersOpen(false);
  };

  const handleTestClick = (testId: string) => {
    navigate(`/app/hr/tests/edit/${testId}`);
  };

  const handleCreateTest = () => {
    navigate('/app/hr/tests/new');
  };

  const clearFilters = () => {
    setQuickTargetFilter('all');
    setQuickStatusFilter('all');
    setSearchQuery('');
    setFilterApplied(false);
  };

  const applyAdvancedFilters = (filters: any) => {
    // Здесь будет более сложная логика фильтрации с использованием всех параметров
    const filtered = mockTests.filter(test => {
      // Фильтр по целевой аудитории
      if (filters.targetAudience && filters.targetAudience !== 'all') {
        if (test.targetAudience !== filters.targetAudience && test.targetAudience !== 'both') {
          return false;
        }
      }

      // Фильтр по статусу
      if (filters.status && filters.status !== 'all') {
        if (test.status !== filters.status) {
          return false;
        }
      }

      // Фильтр по типу теста
      if (filters.type && filters.type !== 'all') {
        if (test.type !== filters.type) {
          return false;
        }
      }

      // Фильтр по сложности
      if (filters.difficulty && filters.difficulty !== 'all') {
        if (test.difficulty !== filters.difficulty) {
          return false;
        }
      }

      // Фильтр по отделу
      if (filters.department && filters.department !== 'all') {
        if (!test.department || !test.department.includes(filters.department)) {
          return false;
        }
      }

      // Фильтр по должности
      if (filters.position && filters.position !== 'all') {
        if (!test.position || !test.position.includes(filters.position)) {
          return false;
        }
      }

      // Фильтр по времени прохождения
      if (filters.maxDuration && filters.maxDuration > 0) {
        if (test.duration > filters.maxDuration) {
          return false;
        }
      }

      return true;
    });

    setFilteredTests(filtered);
    setFilterApplied(true);
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
            Тесты
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
              placeholder="Поиск тестов..."
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
              onClick={handleCreateTest}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Создать тест
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
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreateTest} fullWidth>
            Создать тест
          </Button>
        </Box>

        {/* Быстрые фильтры */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 200 } }}>
            <InputLabel id="target-quick-filter-label">Целевая аудитория</InputLabel>
            <Select
              labelId="target-quick-filter-label"
              value={quickTargetFilter}
              label="Целевая аудитория"
              onChange={e => setQuickTargetFilter(e.target.value as TestTargetAudience | 'all')}
            >
              <MenuItem value="all">Все</MenuItem>
              <MenuItem value="candidates">Кандидаты</MenuItem>
              <MenuItem value="employees">Сотрудники</MenuItem>
              <MenuItem value="both">Все категории</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 200 } }}>
            <InputLabel id="status-quick-filter-label">Статус</InputLabel>
            <Select
              labelId="status-quick-filter-label"
              value={quickStatusFilter}
              label="Статус"
              onChange={e => setQuickStatusFilter(e.target.value as TestStatus | 'all')}
            >
              <MenuItem value="all">Все статусы</MenuItem>
              <MenuItem value="active">Активный</MenuItem>
              <MenuItem value="draft">Черновик</MenuItem>
              <MenuItem value="archived">Архивный</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Список тестов */}
        {filteredTests.length > 0 ? (
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
              {filteredTests.map(test => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={test.id}
                  sx={{
                    height: { xs: 'auto', sm: '280px', md: '300px', lg: '320px' },
                  }}
                >
                  <TestCard test={test} onClick={() => handleTestClick(test.id)} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              Тесты не найдены
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Попробуйте изменить параметры поиска или фильтрации
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Панель расширенных фильтров */}
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
        <TestsFilters
          onClose={handleFilterClose}
          onApply={applyAdvancedFilters}
          onClear={clearFilters}
        />
      </Drawer>
    </Container>
  );
};

export default TestsList;
