import { useEffect, useMemo, useState } from 'react';
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
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LearningMaterialDifficulty,
  LearningMaterialStatus,
  LearningMaterialType,
  mockLearningMaterials,
} from '../../../types/learning-material';
import LearningMaterialCard from './LearningMaterialCard';
import LearningMaterialsFilters from './LearningMaterialsFilters';

const LearningMaterialsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [materials, setMaterials] = useState(mockLearningMaterials);
  const [filteredMaterials, setFilteredMaterials] = useState(mockLearningMaterials);
  const [filterApplied, setFilterApplied] = useState(false);

  // Быстрые фильтры
  const [quickTypeFilter, setQuickTypeFilter] = useState<LearningMaterialType | 'all'>('all');
  const [quickStatusFilter, setQuickStatusFilter] = useState<LearningMaterialStatus | 'all'>('all');

  // Обновляем список материалов при каждом возвращении на страницу или изменении моковых данных
  useEffect(() => {
    setMaterials(mockLearningMaterials);
  }, [location.pathname, mockLearningMaterials]);

  // Применяем быстрые фильтры и поиск
  const applyQuickFilters = (materialsToFilter = materials) => {
    return materialsToFilter.filter(material => {
      // Фильтр по типу материала
      if (quickTypeFilter !== 'all' && material.type !== quickTypeFilter) {
        return false;
      }

      // Фильтр по статусу
      if (quickStatusFilter !== 'all' && material.status !== quickStatusFilter) {
        return false;
      }

      // Поиск по запросу
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          material.title.toLowerCase().includes(query) ||
          material.description.toLowerCase().includes(query) ||
          (material.department && material.department.toLowerCase().includes(query)) ||
          (material.position && material.position.toLowerCase().includes(query)) ||
          material.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      return true;
    });
  };

  // Обновляем отфильтрованные материалы при изменении фильтров или поискового запроса
  useMemo(() => {
    const newFilteredMaterials = applyQuickFilters();
    setFilteredMaterials(newFilteredMaterials);
    setFilterApplied(
      quickTypeFilter !== 'all' || quickStatusFilter !== 'all' || searchQuery.trim() !== ''
    );
  }, [materials, quickTypeFilter, quickStatusFilter, searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterClick = () => {
    setFiltersOpen(true);
  };

  const handleFilterClose = () => {
    setFiltersOpen(false);
  };

  const handleMaterialClick = (materialId: string) => {
    navigate(`/app/hr/learning/${materialId}`);
  };

  const handleCreateMaterial = () => {
    navigate('/app/hr/learning/new');
  };

  const clearFilters = () => {
    setQuickTypeFilter('all');
    setQuickStatusFilter('all');
    setSearchQuery('');
    setFilterApplied(false);
  };

  const applyAdvancedFilters = (filters: any) => {
    // Здесь будет более сложная логика фильтрации с использованием всех параметров
    const filtered = mockLearningMaterials.filter(material => {
      // Фильтр по типу материала
      if (filters.type && filters.type !== 'all') {
        if (material.type !== filters.type) {
          return false;
        }
      }

      // Фильтр по статусу
      if (filters.status && filters.status !== 'all') {
        if (material.status !== filters.status) {
          return false;
        }
      }

      // Фильтр по сложности
      if (filters.difficulty && filters.difficulty !== 'all') {
        if (material.difficulty !== filters.difficulty) {
          return false;
        }
      }

      // Фильтр по отделу
      if (filters.department && filters.department !== 'all') {
        if (!material.department || !material.department.includes(filters.department)) {
          return false;
        }
      }

      // Фильтр по должности
      if (filters.position && filters.position !== 'all') {
        if (!material.position || !material.position.includes(filters.position)) {
          return false;
        }
      }

      // Фильтр по обязательности
      if (filters.isMandatory !== undefined) {
        if (material.isMandatory !== filters.isMandatory) {
          return false;
        }
      }

      // Фильтр по длительности
      if (filters.maxDuration && filters.maxDuration > 0) {
        if (!material.durationMinutes || material.durationMinutes > filters.maxDuration) {
          return false;
        }
      }

      return true;
    });

    setFilteredMaterials(filtered);
    setFilterApplied(true);
    setFiltersOpen(false);
  };

  // Разделение материалов по типу для удобного отображения
  const renderMaterialsByType = () => {
    if (filteredMaterials.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            Материалы не найдены
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Попробуйте изменить параметры поиска или фильтрации
          </Typography>
        </Box>
      );
    }

    // Если применен поиск или фильтры, показываем все материалы вместе
    if (filterApplied) {
      return (
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
            {filteredMaterials.map(material => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={material.id}
                sx={{
                  height: { xs: 'auto', sm: '280px', md: '300px', lg: '320px' },
                }}
              >
                <LearningMaterialCard
                  material={material}
                  onClick={() => handleMaterialClick(material.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    // Группируем материалы по типу для более удобного просмотра
    const materialsByType = {
      course: filteredMaterials.filter(m => m.type === 'course'),
      video: filteredMaterials.filter(m => m.type === 'video'),
      article: filteredMaterials.filter(m => m.type === 'article'),
      document: filteredMaterials.filter(m => m.type === 'document'),
      presentation: filteredMaterials.filter(m => m.type === 'presentation'),
    };

    const typeLabels = {
      course: 'Курсы',
      video: 'Видео',
      article: 'Статьи',
      document: 'Документы',
      presentation: 'Презентации',
    };

    // Отображаем только те типы, по которым есть материалы
    return Object.entries(materialsByType)
      .filter(([_, materials]) => materials.length > 0)
      .map(([type, materials]) => (
        <Box key={type} sx={{ mb: 4 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
            {typeLabels[type as keyof typeof typeLabels]}
          </Typography>
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
            {materials.map(material => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={material.id}
                sx={{
                  height: { xs: 'auto', sm: '280px', md: '300px', lg: '320px' },
                }}
              >
                <LearningMaterialCard
                  material={material}
                  onClick={() => handleMaterialClick(material.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ));
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
            Учебные материалы
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
              placeholder="Поиск материалов..."
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
              onClick={handleCreateMaterial}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Добавить материал
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
            onClick={handleCreateMaterial}
            fullWidth
          >
            Добавить
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
            <InputLabel id="type-quick-filter-label">Тип материала</InputLabel>
            <Select
              labelId="type-quick-filter-label"
              value={quickTypeFilter}
              label="Тип материала"
              onChange={e => setQuickTypeFilter(e.target.value as LearningMaterialType | 'all')}
            >
              <MenuItem value="all">Все типы</MenuItem>
              <MenuItem value="course">Курсы</MenuItem>
              <MenuItem value="video">Видео</MenuItem>
              <MenuItem value="article">Статьи</MenuItem>
              <MenuItem value="document">Документы</MenuItem>
              <MenuItem value="presentation">Презентации</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 200 } }}>
            <InputLabel id="status-quick-filter-label">Статус</InputLabel>
            <Select
              labelId="status-quick-filter-label"
              value={quickStatusFilter}
              label="Статус"
              onChange={e => setQuickStatusFilter(e.target.value as LearningMaterialStatus | 'all')}
            >
              <MenuItem value="all">Все статусы</MenuItem>
              <MenuItem value="active">Активный</MenuItem>
              <MenuItem value="draft">Черновик</MenuItem>
              <MenuItem value="archived">Архивный</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Список материалов */}
        {renderMaterialsByType()}
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
        <LearningMaterialsFilters
          onClose={handleFilterClose}
          onApply={applyAdvancedFilters}
          onClear={clearFilters}
        />
      </Drawer>
    </Container>
  );
};

export default LearningMaterialsList;
