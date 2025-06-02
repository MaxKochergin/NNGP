import { useEffect, useMemo } from 'react';
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
import { useTests } from '../../../features/tests/testsHooks';
import { TestDifficulty, TestStatus, TestTargetAudience, TestType } from '../../../types/test';
import TestCard from './TestCard';
import TestsFilters from './TestsFilters';

const TestsList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Redux hooks
  const {
    tests: filteredTests,
    filters,
    isLoading,
    error,
    loadTests,
    updateFilters,
    resetFilters,
  } = useTests();

  // Загружаем тесты при монтировании компонента
  useEffect(() => {
    loadTests();
  }, [loadTests]);

  // Проверяем, применены ли фильтры
  const filterApplied = useMemo(() => {
    return (
      filters.searchQuery.trim() !== '' ||
      filters.targetAudience !== 'all' ||
      filters.status !== 'all' ||
      filters.type !== 'all' ||
      filters.difficulty !== 'all' ||
      filters.department.trim() !== '' ||
      filters.position.trim() !== ''
    );
  }, [filters]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ searchQuery: event.target.value });
  };

  const handleFilterClick = () => {
    // Открываем панель расширенных фильтров
    // setFiltersOpen(true);
  };

  const handleTestClick = (testId: string) => {
    navigate(`/app/hr/tests/${testId}`);
  };

  const handleCreateTest = () => {
    navigate('/app/hr/tests/new');
  };

  const clearFilters = () => {
    resetFilters();
  };

  const applyAdvancedFilters = (newFilters: any) => {
    updateFilters(newFilters);
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
              value={filters.searchQuery}
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
              value={filters.targetAudience}
              label="Целевая аудитория"
              onChange={e =>
                updateFilters({ targetAudience: e.target.value as TestTargetAudience })
              }
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
              value={filters.status}
              label="Статус"
              onChange={e => updateFilters({ status: e.target.value as TestStatus })}
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
        open={false}
        onClose={() => {}}
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
        <TestsFilters onClose={() => {}} onApply={applyAdvancedFilters} onClear={clearFilters} />
      </Drawer>
    </Container>
  );
};

export default TestsList;
