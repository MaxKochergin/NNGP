import { useEffect, useState } from 'react';
import {
  Add as AddIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  SwipeableDrawer,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from '../../../features/candidates/candidatesHooks';
import { CandidateBasicInfo } from '../../../features/candidates/candidatesSlice';
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
    name: 'Королев Антон Павлович',
    position: 'Инженер-конструктор',
    experience: '5 лет',
    status: 'Новый',
    lastActivity: '2025-04-15',
    skills: ['AutoCAD', 'Revit', 'Железобетонные конструкции'],
    avatar: null,
  },
  {
    id: '2',
    name: 'Дмитриева Ольга Игоревна',
    position: 'Инженер-проектировщик ОВиК',
    experience: '5 лет',
    status: 'На собеседовании',
    lastActivity: '2025-04-14',
    skills: ['AutoCAD', 'Revit MEP', 'Расчет систем вентиляции'],
    avatar: null,
  },
  {
    id: '3',
    name: 'Васильев Сергей Станиславович',
    position: 'Ведущий инженер-конструктор',
    experience: '5 лет',
    status: 'Тестовое задание',
    lastActivity: '2025-04-12',
    skills: ['ЛИРА-САПР', 'AutoCAD', 'Revit', 'Расчет конструкций'],
    avatar: null,
  },
  {
    id: '4',
    name: 'Григорьева Наталья Михайловна',
    position: 'Архитектор',
    experience: '5 лет',
    status: 'Принят',
    lastActivity: '2025-04-10',
    skills: ['ArchiCAD', 'Revit', '3D моделирование'],
    avatar: null,
  },
  {
    id: '5',
    name: 'Морозов Игорь Валентинович',
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

  // Состояние для диалога удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<CandidateBasicInfo | null>(null);

  // Используем Redux hooks вместо локального состояния
  const {
    // Данные
    filteredCandidates,
    statistics,

    // Состояния загрузки
    isLoading,
    isDeleting,
    error,
    lastUpdated,

    // Поиск
    searchQuery,
    setSearch,
    clearSearchQuery,

    // Фильтры
    filters,
    activeFiltersCount,
    filtersOpen,
    applyFilters,
    clearAllFilters,
    toggleFiltersOpen,

    // Функции
    loadCandidates,
    refreshCandidates,
    deleteCandidateById,
  } = useCandidates();

  // Загружаем кандидатов при монтировании компонента
  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleFilterClick = () => {
    toggleFiltersOpen(true);
  };

  const handleFilterClose = () => {
    toggleFiltersOpen(false);
  };

  const handleCandidateClick = (candidateId: string) => {
    navigate(`/app/hr/candidates/${candidateId}`);
  };

  const handleAddCandidate = () => {
    navigate('/app/hr/candidates/new');
  };

  const handleRefresh = () => {
    refreshCandidates();
  };

  const clearSearch = () => {
    clearSearchQuery();
  };

  const handleDeleteCandidate = (candidateId: string) => {
    const candidate = filteredCandidates.find(c => c.id === candidateId);
    if (candidate) {
      setCandidateToDelete(candidate);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (candidateToDelete) {
      try {
        await deleteCandidateById(candidateToDelete.id);
        setDeleteDialogOpen(false);
        setCandidateToDelete(null);
      } catch (error) {
        console.error('Ошибка при удалении кандидата:', error);
        // Здесь можно добавить уведомление об ошибке
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCandidateToDelete(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Заголовок и статистика */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 1,
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
              }}
            >
              Кандидаты
              {activeFiltersCount > 0 && (
                <Chip
                  label={`Фильтры активны (${activeFiltersCount})`}
                  size="small"
                  color="primary"
                  onDelete={clearAllFilters}
                  sx={{ ml: 2, verticalAlign: 'middle' }}
                />
              )}
            </Typography>

            {/* Кнопка обновления для мобильных */}
            <IconButton
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{ display: { xs: 'flex', sm: 'none' } }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>

          {/* Статистика */}
          {statistics && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              Всего кандидатов: {statistics.total} • Показано: {filteredCandidates.length}
              {lastUpdated && <> • Обновлено: {new Date(lastUpdated).toLocaleString('ru-RU')}</>}
            </Typography>
          )}
        </Box>

        {/* Поиск и фильтры */}
        <Box sx={{ mb: 3 }}>
          {isMobile ? (
            /* Мобильная версия */
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
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
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={clearSearch}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={handleFilterClick}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddCandidate}
                  fullWidth
                >
                  Добавить кандидата
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRefresh}
                  disabled={isLoading}
                  sx={{ minWidth: 'auto', px: 2 }}
                >
                  Обновить
                </Button>
              </Box>
            </Stack>
          ) : (
            /* Десктопная версия */
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={clearSearch}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ width: { sm: 240, md: 300, lg: 400 } }}
              />
              <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleFilterClick}>
                Фильтры {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddCandidate}>
                Добавить
              </Button>
              <IconButton onClick={handleRefresh} disabled={isLoading} title="Обновить список">
                <RefreshIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Активные фильтры */}
        {(activeFiltersCount > 0 || searchQuery) && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {searchQuery && (
                <Chip
                  label={`Поиск: "${searchQuery}"`}
                  onDelete={clearSearch}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
              {activeFiltersCount > 0 && (
                <Chip
                  label={`Активные фильтры (${activeFiltersCount})`}
                  onDelete={clearAllFilters}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Состояние загрузки */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Ошибка */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Повторить
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Список кандидатов */}
        {!isLoading && !error && (
          <>
            {filteredCandidates.length > 0 ? (
              <Grid
                container
                spacing={{ xs: 2, sm: 2, md: 3 }}
                sx={{
                  '& .MuiGrid-item': {
                    display: 'flex',
                  },
                }}
              >
                {filteredCandidates.map((candidate: CandidateBasicInfo) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={candidate.id}>
                    <CandidateCard
                      candidate={candidate}
                      onClick={() => handleCandidateClick(candidate.id)}
                      onDelete={handleDeleteCandidate}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: { xs: 4, sm: 6 },
                  px: { xs: 2, sm: 4 },
                }}
              >
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, mb: 1 }}
                >
                  Кандидаты не найдены
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, mb: 2 }}
                >
                  Попробуйте изменить параметры поиска или фильтрации
                </Typography>
                {(searchQuery || activeFiltersCount > 0) && (
                  <Button variant="outlined" onClick={clearAllFilters}>
                    Сбросить все фильтры
                  </Button>
                )}
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Вы уверены, что хотите удалить кандидата <strong>{candidateToDelete?.name}</strong>? Это
            действие нельзя отменить. Все данные кандидата, включая заметки и интервью, будут
            удалены.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Отмена
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Фильтры в Drawer */}
      <SwipeableDrawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={filtersOpen}
        onClose={handleFilterClose}
        onOpen={() => toggleFiltersOpen(true)}
        disableSwipeToOpen={false}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            height: { xs: 'auto', sm: '100%' },
            maxHeight: { xs: '90vh', sm: '100%' },
            borderTopLeftRadius: { xs: 16, sm: 0 },
            borderTopRightRadius: { xs: 16, sm: 0 },
          },
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <CandidateFilters
            onClose={handleFilterClose}
            onApply={applyFilters}
            onClear={clearAllFilters}
          />
        </Box>
      </SwipeableDrawer>
    </Container>
  );
};

export default CandidatesList;
