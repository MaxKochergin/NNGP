import { useEffect, useMemo, useState } from 'react';
import {
  Assignment as AssignmentIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
// Импортируем моковые данные из TestResults
// В реальном проекте здесь будет API-запрос к бэкенду
import { mockTestResults } from './TestResultsData';

// Типы данных
interface TestResult {
  id: string;
  userId: string;
  userName: string;
  userType: 'candidate' | 'employee';
  testId: string;
  testTitle: string;
  score: number;
  passingScore: number;
  isPassed: boolean;
  completedAt: string;
  department?: string;
  position?: string;
}

// Для графиков
interface ChartData {
  name: string;
  value: number;
  color?: string;
}

// Статистика по тестам
interface TestStats {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageScore: number;
  completionRate: number;
}

// Временно используем моковые данные из TestResults для демонстрации
// В реальном приложении это будет загружаться через API
const mockResults: TestResult[] = mockTestResults;

const TestAnalytics = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Состояния
  const [loading, setLoading] = useState<boolean>(false);
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'candidate' | 'employee'>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>(
    'month'
  );
  const [topTests, setTopTests] = useState<{ name: string; completions: number }[]>([]);

  // Цвета для графиков
  const colors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
    passed: '#4caf50',
    failed: '#f44336',
    candidate: theme.palette.secondary.main,
    employee: theme.palette.primary.main,
  };

  // Фильтрация данных по типу пользователя
  const filteredResults = useMemo(() => {
    return mockResults.filter(result => {
      if (userTypeFilter !== 'all' && result.userType !== userTypeFilter) {
        return false;
      }
      return true;
    });
  }, [userTypeFilter]);

  // Расчет общей статистики
  const stats: TestStats = useMemo(() => {
    const total = filteredResults.length;
    const passed = filteredResults.filter(r => r.isPassed).length;
    const failed = total - passed;
    const avgScore = total > 0 ? filteredResults.reduce((sum, r) => sum + r.score, 0) / total : 0;
    // В реальном приложении здесь будет более сложная логика расчета completion rate
    const completionRate = 0.85; // 85% для примера

    return {
      totalTests: total,
      passedTests: passed,
      failedTests: failed,
      averageScore: avgScore,
      completionRate: completionRate,
    };
  }, [filteredResults]);

  // Данные для графика успеваемости
  const passRateChartData: ChartData[] = [
    { name: 'Пройдено', value: stats.passedTests, color: colors.passed },
    { name: 'Не пройдено', value: stats.failedTests, color: colors.failed },
  ];

  // Данные для графика распределения по типу пользователя
  const userTypeChartData: ChartData[] = useMemo(() => {
    const candidates = mockResults.filter(r => r.userType === 'candidate').length;
    const employees = mockResults.filter(r => r.userType === 'employee').length;

    return [
      { name: 'Кандидаты', value: candidates, color: colors.candidate },
      { name: 'Сотрудники', value: employees, color: colors.employee },
    ];
  }, [mockResults]);

  // Данные для графика среднего балла по отделам
  const departmentScoreChartData = useMemo(() => {
    const departments = new Map<string, { total: number; count: number }>();

    filteredResults.forEach(result => {
      if (result.department) {
        const dept = departments.get(result.department) || { total: 0, count: 0 };
        dept.total += result.score;
        dept.count += 1;
        departments.set(result.department, dept);
      }
    });

    return Array.from(departments.entries()).map(([name, data]) => ({
      name,
      score: Math.round(data.total / data.count),
    }));
  }, [filteredResults]);

  // Получение самых популярных тестов
  useEffect(() => {
    // Имитация API-запроса
    setLoading(true);

    // Группировка тестов по названию и подсчет количества прохождений
    const testCounts = new Map<string, number>();
    filteredResults.forEach(result => {
      const count = testCounts.get(result.testTitle) || 0;
      testCounts.set(result.testTitle, count + 1);
    });

    // Сортировка и получение топ-5
    const topTestsArray = Array.from(testCounts.entries())
      .map(([name, completions]) => ({ name, completions }))
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 5);

    setTopTests(topTestsArray);
    setLoading(false);
  }, [filteredResults]);

  const handleUserTypeFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setUserTypeFilter(event.target.value as 'all' | 'candidate' | 'employee');
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedTimeRange(event.target.value as 'week' | 'month' | 'quarter' | 'year');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 5 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 0, sm: 1 } }}>
        {/* Заголовок и фильтры */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 3, fontSize: { xs: '1.7rem', sm: '2rem', md: '2.125rem' } }}
          >
            Аналитика тестирования
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="user-type-filter-label">Категория пользователей</InputLabel>
                <Select
                  labelId="user-type-filter-label"
                  value={userTypeFilter}
                  label="Категория пользователей"
                  onChange={handleUserTypeFilterChange}
                >
                  <MenuItem value="all">Все категории</MenuItem>
                  <MenuItem value="employee">Сотрудники</MenuItem>
                  <MenuItem value="candidate">Кандидаты</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="time-range-filter-label">Период</InputLabel>
                <Select
                  labelId="time-range-filter-label"
                  value={selectedTimeRange}
                  label="Период"
                  onChange={handleTimeRangeChange}
                >
                  <MenuItem value="week">Неделя</MenuItem>
                  <MenuItem value="month">Месяц</MenuItem>
                  <MenuItem value="quarter">Квартал</MenuItem>
                  <MenuItem value="year">Год</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        {/* Карточки со статистикой */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Всего тестов
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats.totalTests}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {userTypeFilter === 'all'
                    ? 'Все категории'
                    : userTypeFilter === 'employee'
                      ? 'Сотрудники'
                      : 'Кандидаты'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ color: colors.passed, mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Успешность
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats.totalTests > 0
                    ? Math.round((stats.passedTests / stats.totalTests) * 100)
                    : 0}
                  %
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Пройдено: {stats.passedTests} / Не пройдено: {stats.failedTests}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimelineIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Средний балл
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {Math.round(stats.averageScore)}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  За выбранный период
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    Активность
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                  {Math.round(stats.completionRate * 100)}%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Прохождение назначенных тестов
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Графики */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* График успеваемости */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                  Успеваемость
                </Typography>
                <Box sx={{ height: 300 }}>
                  {!loading ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={passRateChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {passRateChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={value => [`${value} тестов`, 'Количество']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* График распределения пользователей */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                  Распределение по категориям
                </Typography>
                <Box sx={{ height: 300 }}>
                  {!loading ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userTypeChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {userTypeChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={value => [`${value} тестов`, 'Количество']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* График средних баллов по отделам */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                  Средний балл по отделам
                </Typography>
                <Box sx={{ height: 300 }}>
                  {!loading && departmentScoreChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={departmentScoreChartData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={value => [`${value}%`, 'Средний балл']} />
                        <Legend />
                        <Bar dataKey="score" name="Средний балл" fill={colors.primary} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : !loading && departmentScoreChartData.length === 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        Нет данных для отображения
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Таблицы и дополнительная информация */}
        <Grid container spacing={3}>
          {/* Самые популярные тесты */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                  Самые популярные тесты
                </Typography>
                {!loading && topTests.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Название теста</TableCell>
                          <TableCell align="right">Прохождений</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topTests.map((test, index) => (
                          <TableRow key={index} hover>
                            <TableCell>{test.name}</TableCell>
                            <TableCell align="right">{test.completions}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : !loading && topTests.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 2 }}
                  >
                    Нет данных для отображения
                  </Typography>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Общая статистика по типам тестов */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                  Назначение тестов
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      icon={<PersonIcon />}
                      label="Кандидаты"
                      color="secondary"
                      variant="outlined"
                    />
                    <Typography variant="body2">
                      {mockResults.filter(r => r.userType === 'candidate').length} тестов
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      icon={<PersonIcon />}
                      label="Сотрудники"
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="body2">
                      {mockResults.filter(r => r.userType === 'employee').length} тестов
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 1 }} />

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Тестирование по должностям (топ-3):
                    </Typography>
                    {/* В реальном приложении здесь будет отображаться статистика по должностям */}
                    <Typography variant="body2">Инженер-конструктор: 4 теста</Typography>
                    <Typography variant="body2">Архитектор: 2 теста</Typography>
                    <Typography variant="body2">BIM-координатор: 1 тест</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TestAnalytics;
