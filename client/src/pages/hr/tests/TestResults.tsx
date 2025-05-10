import { useMemo, useState } from 'react';
import {
  Analytics as AnalyticsIcon,
  FilterList as FilterListIcon,
  Person as PersonIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Chip,
  Container,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { mockTestResults, TestResult } from './TestResultsData';

const TestResults = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Состояния компонента
  const [results, setResults] = useState<TestResult[]>(mockTestResults);
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'candidate' | 'employee'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Фильтрация результатов
  const filteredResults = useMemo(() => {
    return mockTestResults.filter(result => {
      // Фильтр по типу пользователя
      if (userTypeFilter !== 'all' && result.userType !== userTypeFilter) {
        return false;
      }

      // Поиск по ФИО
      if (searchQuery && !result.userName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [userTypeFilter, searchQuery]);

  // Обработчики событий
  const handleUserTypeFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setUserTypeFilter(event.target.value as 'all' | 'candidate' | 'employee');
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleResultClick = (resultId: string) => {
    // Находим результат по ID
    const result = filteredResults.find(r => r.id === resultId);
    if (result) {
      // Перенаправляем на страницу пользователя при клике на строку
      handleUserClick(result.userId, result.userType);
    }
  };

  const handleUserClick = (userId: string, userType: 'candidate' | 'employee') => {
    // Перенаправление на страницу пользователя в зависимости от типа
    const path =
      userType === 'candidate' ? `/app/hr/candidates/${userId}` : `/app/hr/employees/${userId}`;

    navigate(path);
  };

  const handleAnalyticsClick = () => {
    navigate('/app/hr/tests/analytics');
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Получение отображаемых записей с учетом пагинации
  const visibleRows = filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 0, sm: 1 } }}>
        {/* Заголовок и инструменты фильтрации */}
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: { xs: '1.7rem', sm: '2rem', md: '2.125rem' },
              }}
            >
              Результаты тестирования
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AnalyticsIcon />}
              onClick={handleAnalyticsClick}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Аналитика
            </Button>
          </Box>

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
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel id="user-type-filter-label">Тип пользователя</InputLabel>
                <Select
                  labelId="user-type-filter-label"
                  value={userTypeFilter}
                  label="Тип пользователя"
                  onChange={handleUserTypeFilterChange}
                >
                  <MenuItem value="all">Все</MenuItem>
                  <MenuItem value="employee">Сотрудники</MenuItem>
                  <MenuItem value="candidate">Кандидаты</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                Клик на строку или ФИО открывает профиль пользователя
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AnalyticsIcon />}
                onClick={handleAnalyticsClick}
              >
                Аналитика
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Таблица результатов */}
        {filteredResults.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.action.hover }}>
                  <TableCell>ФИО</TableCell>
                  <TableCell>Тип</TableCell>
                  <TableCell>Тест</TableCell>
                  <TableCell align="center">Результат</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Должность/Отдел</TableCell>
                  <TableCell>Дата прохождения</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map(result => (
                  <Tooltip
                    key={result.id}
                    title={`Открыть профиль ${result.userType === 'employee' ? 'сотрудника' : 'кандидата'}`}
                    placement="top"
                  >
                    <TableRow
                      hover
                      onClick={() => handleResultClick(result.id)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 'medium',
                            '&:hover': { textDecoration: 'underline' },
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            handleUserClick(result.userId, result.userType);
                          }}
                        >
                          {result.userName}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={result.userType === 'employee' ? 'Сотрудник' : 'Кандидат'}
                          color={result.userType === 'employee' ? 'primary' : 'secondary'}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{result.testTitle}</TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 'bold',
                              color: result.isPassed ? 'success.main' : 'error.main',
                            }}
                          >
                            {result.score}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            (min: {result.passingScore}%)
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={result.isPassed ? 'Пройден' : 'Не пройден'}
                          color={result.isPassed ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {result.position}
                          {result.department && (
                            <>
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                {result.department}
                              </Typography>
                            </>
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(result.completedAt)}</TableCell>
                    </TableRow>
                  </Tooltip>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredResults.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Строк на странице:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
            />
          </TableContainer>
        ) : (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              Результаты не найдены
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Попробуйте изменить параметры поиска или фильтрации
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TestResults;
