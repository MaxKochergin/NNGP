import { useEffect, useState } from 'react';
import {
  Add as AddIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Person as PersonIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Alert,
  Badge,
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
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isXSmall = useMediaQuery('(max-width:320px)');

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
    const employee = filteredEmployees?.find(e => e.id === employeeId);
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
    if (isTablet) return { xs: 12, sm: 6 };
    return { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 };
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 1, sm: 2, md: 3 },
        mb: { xs: 7, sm: 3 }, // Увеличиваем отступ снизу для FAB на мобильных
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Paper
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          borderRadius: { xs: 1, sm: 2 },
          minHeight: '70vh',
          background: {
            xs: theme => theme.palette.background.paper,
            sm: theme =>
              `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          },
          boxShadow: { xs: 1, sm: 2 },
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontSize: {
                    xs: '1.5rem',
                    sm: '1.8rem',
                    md: '2rem',
                  },
                  fontWeight: 'bold',
                  color: 'primary.main',
                }}
              >
                Сотрудники
              </Typography>

              {activeFiltersCount > 0 && (
                <Badge
                  badgeContent={activeFiltersCount}
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.7rem',
                      height: 18,
                      minWidth: 18,
                    },
                  }}
                >
                  <Chip
                    label="Фильтры"
                    size="small"
                    color="primary"
                    variant="outlined"
                    onDelete={clearAllFilters}
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.75rem' },
                      height: { xs: 24, sm: 28 },
                    }}
                  />
                </Badge>
              )}
            </Box>

            {/* Панель действий для десктопа */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={refreshEmployees}
                  size={isTablet ? 'small' : 'medium'}
                >
                  Обновить
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddEmployee}
                  size={isTablet ? 'small' : 'medium'}
                >
                  Добавить сотрудника
                </Button>
              </Box>
            )}
          </Box>

          {/* Строка поиска и фильтров */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: { xs: 1, sm: 2 },
              mt: { xs: 1.5, sm: 2 },
              width: '100%',
            }}
          >
            {/* Поле поиска */}
            <TextField
              placeholder="Поиск сотрудников..."
              variant="outlined"
              fullWidth
              size={isMobile ? 'small' : 'medium'}
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize={isMobile ? 'small' : 'medium'} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      size={isMobile ? 'small' : 'medium'}
                      onClick={clearSearch}
                      edge="end"
                      aria-label="clear search"
                    >
                      <ClearIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: {
                  borderRadius: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                },
              }}
              sx={{
                flexGrow: 1,
                maxWidth: { sm: '60%', md: '50%' },
              }}
            />

            {/* Кнопка фильтров */}
            <Button
              variant={activeFiltersCount > 0 ? 'contained' : 'outlined'}
              color={activeFiltersCount > 0 ? 'primary' : 'inherit'}
              startIcon={<FilterListIcon />}
              onClick={toggleFiltersOpen}
              size={isMobile ? 'small' : 'medium'}
              sx={{
                minWidth: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              }}
            >
              {isMobile ? 'Фильтры' : 'Фильтровать список'}
              {activeFiltersCount > 0 && !isMobile && ` (${activeFiltersCount})`}
            </Button>
          </Box>
        </Box>

        {/* Основное содержимое */}
        <Box sx={{ mt: { xs: 2, sm: 3 } }}>
          {isLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={isMobile ? 32 : 40} />
              <Typography sx={{ mt: 2 }}>Загрузка сотрудников...</Typography>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : filteredEmployees && filteredEmployees.length > 0 ? (
            <>
              {/* Информация о результатах */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: { xs: 1.5, sm: 2 },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {filteredEmployees.length === statistics?.total
                    ? `Всего сотрудников: ${filteredEmployees.length}`
                    : `Показано ${filteredEmployees.length} из ${statistics?.total || 0} сотрудников`}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  Последнее обновление:{' '}
                  {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Н/Д'}
                </Typography>
              </Box>

              {/* Сетка сотрудников */}
              <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
                {filteredEmployees.map(employee => (
                  <Grid item key={employee.id} {...getGridColumns()}>
                    <EmployeeCard
                      employee={employee}
                      onClick={() => handleEmployeeClick(employee.id)}
                      onDelete={handleDeleteEmployee}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Сотрудники не найдены
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchQuery || activeFiltersCount > 0
                  ? 'Попробуйте изменить параметры поиска или фильтры'
                  : 'Добавьте первого сотрудника, нажав на кнопку "Добавить сотрудника"'}
              </Typography>
              {(searchQuery || activeFiltersCount > 0) && (
                <Button variant="outlined" onClick={clearAllFilters} startIcon={<ClearIcon />}>
                  Сбросить все фильтры
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Панель фильтров (боковая) */}
      <SwipeableDrawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={filtersOpen}
        onClose={toggleFiltersOpen}
        onOpen={toggleFiltersOpen}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 350,
            maxWidth: '100%',
            borderTopLeftRadius: isMobile ? 16 : 0,
            borderTopRightRadius: isMobile ? 16 : 0,
            maxHeight: isMobile ? '90vh' : '100%',
          },
        }}
      >
        <EmployeeFilters
          filters={filters}
          onApply={applyFilters}
          onClose={toggleFiltersOpen}
          onClear={clearAllFilters}
        />
      </SwipeableDrawer>

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel} fullWidth maxWidth="xs">
        <DialogTitle>Удаление сотрудника</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Вы действительно хотите удалить сотрудника <strong>{employeeToDelete?.name}</strong>?
            <br />
            Это действие нельзя отменить.
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
            startIcon={isDeleting ? <CircularProgress size={16} /> : undefined}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Плавающая кнопка добавления для мобильных устройств */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add employee"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: theme => theme.zIndex.drawer - 1,
          }}
          onClick={handleAddEmployee}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
};

export default EmployeesList;
