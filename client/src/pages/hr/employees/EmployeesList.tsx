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
  Divider,
  Drawer,
  Fab,
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
import { useEmployees } from '../../../features/employees/employeesHooks';
import { EmployeeBasicInfo } from '../../../features/employees/employeesSlice';
import EmployeeCard from './EmployeeCard';
import EmployeeFilters from './EmployeeFilters';

const EmployeesList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Состояние для диалога удаления
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeBasicInfo | null>(null);

  // Используем Redux hooks вместо локального состояния
  const {
    // Данные
    filteredEmployees,
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

    // CRUD операции
    loadEmployees,
    refreshEmployees,
    deleteEmployeeById,
  } = useEmployees();

  // Загружаем сотрудников при монтировании компонента
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const clearSearch = () => {
    clearSearchQuery();
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const employee = filteredEmployees.find(e => e.id === employeeId);
    if (employee) {
      setEmployeeToDelete(employee);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (employeeToDelete) {
      try {
        await deleteEmployeeById(employeeToDelete.id);
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
      } catch (error) {
        console.error('Ошибка при удалении сотрудника:', error);
        // Здесь можно добавить уведомление об ошибке
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleEmployeeClick = (employeeId: string) => {
    navigate(`/app/hr/employees/${employeeId}`);
  };

  const handleAddEmployee = () => {
    navigate('/app/hr/employees/new');
  };

  const getGridColumns = () => {
    if (isMobile) return { xs: 12 };
    return { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 };
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 2, sm: 3 },
        mb: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          minHeight: '70vh',
        }}
      >
        {/* Заголовок */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: {
                  xs: '1.7rem',
                  sm: '2rem',
                  md: '2.125rem',
                },
                fontWeight: 'bold',
                color: 'primary.main',
              }}
            >
              Сотрудники
              {activeFiltersCount > 0 && (
                <Chip
                  label={`Фильтры: ${activeFiltersCount}`}
                  size="small"
                  color="primary"
                  onDelete={clearAllFilters}
                  sx={{
                    ml: { xs: 0, sm: 2 },
                    mt: { xs: 1, sm: 0 },
                    verticalAlign: { xs: 'baseline', sm: 'middle' },
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  }}
                />
              )}
            </Typography>

            {/* Кнопка обновления */}
            <IconButton
              onClick={refreshEmployees}
              disabled={isLoading}
              sx={{
                display: { xs: 'flex', sm: 'none' },
                alignSelf: 'flex-end',
              }}
            >
              {isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
          </Box>

          {/* Статистика */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            Всего сотрудников: {statistics?.total || 0} • Показано: {filteredEmployees.length}
            {lastUpdated && <> • Обновлено: {new Date(lastUpdated).toLocaleTimeString()}</>}
          </Typography>
        </Box>

        {/* Поиск и фильтры */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          {/* Мобильная версия поиска */}
          {isMobile ? (
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Поиск сотрудников..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={clearSearch} sx={{ p: 0.5 }}>
                          <ClearIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      py: { xs: 1, sm: 1.5 },
                    },
                  }}
                />
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => toggleFiltersOpen(true)}
                  sx={{
                    minWidth: { xs: 'auto', sm: 120 },
                    px: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  }}
                >
                  Фильтры
                  {activeFiltersCount > 0 && (
                    <Chip
                      label={activeFiltersCount}
                      size="small"
                      sx={{ ml: 1, height: 16, fontSize: '0.6rem' }}
                    />
                  )}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddEmployee}
                  fullWidth
                  sx={{
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  Добавить сотрудника
                </Button>
                <Button
                  variant="outlined"
                  startIcon={isLoading ? <CircularProgress size={16} /> : <RefreshIcon />}
                  onClick={refreshEmployees}
                  disabled={isLoading}
                  sx={{
                    minWidth: { xs: 'auto', sm: 120 },
                    px: { xs: 1.5, sm: 2 },
                  }}
                >
                  Обновить
                </Button>
              </Box>
            </Stack>
          ) : (
            /* Десктопная версия поиска */
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
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
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                onClick={() => toggleFiltersOpen(true)}
              >
                Фильтры
                {activeFiltersCount > 0 && (
                  <Chip
                    label={activeFiltersCount}
                    size="small"
                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Button>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddEmployee}>
                Добавить
              </Button>
              <IconButton onClick={refreshEmployees} disabled={isLoading} title="Обновить список">
                {isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Ошибка загрузки */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Список сотрудников */}
        {isLoading && filteredEmployees.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredEmployees.length > 0 ? (
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }}>
            {filteredEmployees.map((employee: EmployeeBasicInfo) => (
              <Grid item {...getGridColumns()} key={employee.id}>
                <EmployeeCard
                  employee={employee}
                  onClick={() => handleEmployeeClick(employee.id)}
                  onDelete={handleDeleteEmployee}
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
              sx={{
                mb: 2,
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              {searchQuery || activeFiltersCount > 0
                ? 'Сотрудники не найдены'
                : 'Список сотрудников пуст'}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 3,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              {searchQuery || activeFiltersCount > 0
                ? 'Попробуйте изменить критерии поиска или фильтры'
                : 'Добавьте первого сотрудника в систему'}
            </Typography>
            {searchQuery || activeFiltersCount > 0 ? (
              <Button
                variant="outlined"
                onClick={() => {
                  clearSearchQuery();
                  clearAllFilters();
                }}
                sx={{ mr: 2 }}
              >
                Сбросить фильтры
              </Button>
            ) : null}
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddEmployee}>
              Добавить сотрудника
            </Button>
          </Box>
        )}

        {/* Фильтры в Drawer */}
        {isMobile ? (
          <SwipeableDrawer
            anchor="bottom"
            open={filtersOpen}
            onClose={() => toggleFiltersOpen(false)}
            onOpen={() => toggleFiltersOpen(true)}
            disableSwipeToOpen={false}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              '& .MuiDrawer-paper': {
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                maxHeight: '80vh',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Фильтры
              </Typography>
              <EmployeeFilters
                onApplyFilters={applyFilters}
                onClearFilters={clearAllFilters}
                currentFilters={filters}
              />
            </Box>
          </SwipeableDrawer>
        ) : (
          <Drawer
            anchor="right"
            open={filtersOpen}
            onClose={() => toggleFiltersOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: 320,
                p: 3,
              },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Фильтры
            </Typography>
            <EmployeeFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearAllFilters}
              currentFilters={filters}
            />
          </Drawer>
        )}

        {/* FAB для мобильных устройств */}
        {isMobile && (
          <Fab
            color="primary"
            aria-label="add"
            onClick={handleAddEmployee}
            sx={{
              position: 'fixed',
              bottom: { xs: 16, sm: 24 },
              right: { xs: 16, sm: 24 },
              zIndex: 1000,
            }}
          >
            <AddIcon />
          </Fab>
        )}

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
              Вы уверены, что хотите удалить сотрудника <strong>{employeeToDelete?.name}</strong>?
              Это действие нельзя отменить. Все данные сотрудника, включая заметки и оценки, будут
              удалены.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={isDeleting}>
              Отмена
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              autoFocus
              color="error"
              disabled={isDeleting}
              startIcon={isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />}
            >
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default EmployeesList;
