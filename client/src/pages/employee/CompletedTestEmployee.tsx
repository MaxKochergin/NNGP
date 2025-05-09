import { useState } from 'react';
import {
  Assessment as AssessmentIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
// Исправляем Grid для типизации с учетом Material UI v5
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Grid as MuiGrid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';

// Интерфейсы для типизации данных
interface TestAttempt {
  id: string;
  testId: string;
  testTitle: string;
  category: string;
  completedAt: string;
  score: number;
  duration: number;
  totalQuestions: number;
  correctAnswers: number;
  status: 'passed' | 'failed';
}

interface TestResultDetail {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  options: { id: string; text: string }[];
}

// Временные данные для примера
const mockTestAttempts: TestAttempt[] = [
  {
    id: '1',
    testId: '1',
    testTitle: 'Основы расчета конструкций',
    category: 'Инженер ПГС',
    completedAt: '2025-04-05T14:30:00',
    score: 72,
    duration: 25,
    totalQuestions: 15,
    correctAnswers: 11,
    status: 'passed',
  },
  {
    id: '2',
    testId: '2',
    testTitle: 'Железобетонные конструкции',
    category: 'Инженер ПГС',
    completedAt: '2025-04-10T10:45:00',
    score: 65,
    duration: 40,
    totalQuestions: 20,
    correctAnswers: 13,
    status: 'passed',
  },
  {
    id: '3',
    testId: '3',
    testTitle: 'Основы сметного дела',
    category: 'Сметчик',
    completedAt: '2025-04-15T09:15:00',
    score: 68,
    duration: 35,
    totalQuestions: 18,
    correctAnswers: 12,
    status: 'passed',
  },
  {
    id: '4',
    testId: '4',
    testTitle: 'Системы отопления и вентиляции',
    category: 'Инженер по ОВ',
    completedAt: '2025-04-20T16:20:00',
    score: 75,
    duration: 32,
    totalQuestions: 15,
    correctAnswers: 11,
    status: 'passed',
  },
  {
    id: '5',
    testId: '5',
    testTitle: 'Архитектурные решения',
    category: 'Проектировщик КМ/КЖ/АР',
    completedAt: '2025-04-25T11:30:00',
    score: 70,
    duration: 38,
    totalQuestions: 18,
    correctAnswers: 13,
    status: 'passed',
  },
];

const mockTestResultDetails: Record<string, TestResultDetail[]> = {
  '1': [
    {
      questionId: '1_1',
      question:
        'Какой нормативный документ используется для расчета нагрузок на здания и сооружения?',
      userAnswer: 'a',
      correctAnswer: 'a',
      isCorrect: true,
      options: [
        { id: 'a', text: 'СП 20.13330' },
        { id: 'b', text: 'СП 50.13330' },
        { id: 'c', text: 'СП 70.13330' },
        { id: 'd', text: 'СП 22.13330' },
      ],
    },
    {
      questionId: '1_2',
      question: 'Что такое предельное состояние конструкции?',
      userAnswer: 'b',
      correctAnswer: 'a',
      isCorrect: false,
      options: [
        { id: 'a', text: 'Состояние, при котором конструкция разрушается' },
        {
          id: 'b',
          text: 'Состояние, при котором конструкция перестает удовлетворять требованиям эксплуатации',
        },
        {
          id: 'c',
          text: 'Состояние, при котором конструкция имеет максимальную несущую способность',
        },
        { id: 'd', text: 'Состояние, при котором конструкция получает первую трещину' },
      ],
    },
    // Другие вопросы для этого теста...
  ],
  // Другие тесты...
};

// Компонент для отображения пройденных тестов
function CompletedTests() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));

  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>(mockTestAttempts);
  const [selectedTest, setSelectedTest] = useState<TestAttempt | null>(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [testDetails, setTestDetails] = useState<TestResultDetail[]>([]);

  const user = useAppSelector(state => state.auth.user);
  const userRole = user?.roles?.[0] || 'candidate';

  // Открытие деталей теста
  const handleOpenDetails = (test: TestAttempt) => {
    setSelectedTest(test);
    // В реальном приложении здесь был бы запрос к API
    // Гарантируем, что у всех тестов будут детали, даже если их нет в mockTestResultDetails
    if (mockTestResultDetails[test.id]) {
      setTestDetails(mockTestResultDetails[test.id]);
    } else {
      // Создаем временные данные для других тестов
      const tempDetails: TestResultDetail[] = [];
      for (let i = 0; i < 3; i++) {
        tempDetails.push({
          questionId: `${test.id}_${i + 1}`,
          question: `Пример вопроса ${i + 1} для теста "${test.testTitle}"`,
          userAnswer: i % 2 === 0 ? 'a' : 'b',
          correctAnswer: 'a',
          isCorrect: i % 2 === 0,
          options: [
            { id: 'a', text: 'Вариант A (правильный)' },
            { id: 'b', text: 'Вариант B' },
            { id: 'c', text: 'Вариант C' },
            { id: 'd', text: 'Вариант D' },
          ],
        });
      }
      setTestDetails(tempDetails);
    }
    setOpenDetails(true);
  };

  // Закрытие деталей теста
  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  // Подсчет статистики
  const totalTests = testAttempts.length;
  const passedTests = testAttempts.filter(test => test.status === 'passed').length;
  const failedTests = totalTests - passedTests;
  const averageScore = Math.round(
    testAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalTests
  );

  // Группировка результатов по категориям для диаграммы
  const categoriesData = Object.entries(
    testAttempts.reduce((acc: Record<string, { count: number; passed: number }>, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = { count: 0, passed: 0 };
      }
      acc[curr.category].count += 1;
      if (curr.status === 'passed') {
        acc[curr.category].passed += 1;
      }
      return acc;
    }, {})
  ).map(([name, data]) => ({
    name,
    ...data,
  }));

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Интервалы оценок для отображения цвета
  const getScoreColor = (score: number): 'success' | 'warning' | 'error' => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' },
          }}
        >
          <AssignmentIcon
            sx={{
              fontSize: { xs: 24, sm: 32 },
              color: 'primary.main',
              mr: { xs: 0, sm: 2 },
              mb: { xs: 1, sm: 0 },
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            }}
          >
            Пройденные тесты
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {/* Сводная статистика */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          <Box>
            <Card
              sx={{
                height: '100%',
                p: { xs: 1.5, sm: 2 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'primary.lighter',
                  color: 'primary.dark',
                  mb: 2.5,
                }}
              >
                <AssessmentIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2.25rem', sm: '2.5rem' },
                  fontWeight: 'bold',
                  color: 'primary.dark',
                  mb: 1,
                }}
              >
                {totalTests}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  color: 'text.secondary',
                }}
              >
                Всего тестов
              </Typography>
            </Card>
          </Box>
          <Box>
            <Card
              sx={{
                height: '100%',
                p: { xs: 1.5, sm: 2 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'success.lighter',
                  color: 'success.dark',
                  mb: 2.5,
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2.25rem', sm: '2.5rem' },
                  fontWeight: 'bold',
                  color: 'success.dark',
                  mb: 1,
                }}
              >
                {passedTests}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  color: 'text.secondary',
                }}
              >
                Успешных тестов
              </Typography>
            </Card>
          </Box>
          <Box>
            <Card
              sx={{
                height: '100%',
                p: { xs: 1.5, sm: 2 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'error.lighter',
                  color: 'error.dark',
                  mb: 2.5,
                }}
              >
                <CancelIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2.25rem', sm: '2.5rem' },
                  fontWeight: 'bold',
                  color: 'error.dark',
                  mb: 1,
                }}
              >
                {failedTests}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  color: 'text.secondary',
                }}
              >
                Неудачных тестов
              </Typography>
            </Card>
          </Box>
          <Box>
            <Card
              sx={{
                height: '100%',
                p: { xs: 1.5, sm: 2 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                boxShadow: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'warning.lighter',
                  color: 'warning.dark',
                  mb: 2.5,
                }}
              >
                <BarChartIcon sx={{ fontSize: 28 }} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2.25rem', sm: '2.5rem' },
                  fontWeight: 'bold',
                  color: 'warning.dark',
                  mb: 1,
                }}
              >
                70%
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  color: 'text.secondary',
                }}
              >
                Средний балл
              </Typography>
            </Card>
          </Box>
        </Box>

        {/* Визуализация результатов - имитация диаграмм */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          <Box>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <PieChartIcon sx={{ mr: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                  Распределение результатов
                </Typography>

                {/* Круговая диаграмма */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: { xs: 200, sm: 250 },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/* Внешний круг (всего тестов) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: { xs: 150, sm: 180 },
                      height: { xs: 150, sm: 180 },
                      borderRadius: '50%',
                      border: '12px solid',
                      borderColor: 'success.lighter',
                    }}
                  />

                  {/* Полный зеленый круг */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: { xs: 150, sm: 180 },
                      height: { xs: 150, sm: 180 },
                      borderRadius: '50%',
                      border: '12px solid',
                      borderColor: 'success.main',
                    }}
                  />

                  {/* Процент успеха в центре */}
                  <Box
                    sx={{
                      position: 'relative',
                      textAlign: 'center',
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        color: 'text.primary',
                        fontSize: { xs: '1.75rem', sm: '2rem' },
                      }}
                    >
                      100%
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      }}
                    >
                      успешных
                    </Typography>
                  </Box>
                </Box>

                {/* Легенда */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 3,
                    gap: 4,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'success.main',
                        mr: 1,
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Пройдено: {passedTests}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'error.main',
                        mr: 1,
                        borderRadius: 1,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Не пройдено: {failedTests}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <TimelineIcon sx={{ mr: 1, fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                  Динамика результатов
                </Typography>
                <Box sx={{ height: 30 }} /> {/* Отступ сверху для процентов */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    height: { xs: 200, sm: 220, md: 240 },
                    mx: { xs: 1, sm: 4 },
                    mb: 2,
                    position: 'relative',
                    pb: 4 /* Для оси X */,
                    pl: { xs: 0, sm: 5 } /* Отступ слева для меток */,
                  }}
                >
                  {/* Горизонтальные линии сетки */}
                  {[0, 25, 50, 75, 100].map(mark => (
                    <Box
                      key={mark}
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: mark === 0 ? '2px' : '1px',
                        bgcolor: mark === 0 ? 'divider' : 'rgba(0, 0, 0, 0.08)',
                        bottom: `calc(${mark}% - 1px)`,
                        left: 0,
                        zIndex: 1,
                      }}
                    />
                  ))}

                  {/* Метки процентов слева */}
                  {[0, 25, 50, 75, 100].map(mark => (
                    <Typography
                      key={`label-${mark}`}
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        left: -25,
                        bottom: `calc(${mark}% - 10px)`,
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        display: { xs: 'none', sm: 'block' },
                      }}
                    >
                      {mark}%
                    </Typography>
                  ))}

                  {/* Вертикальные столбцы */}
                  {testAttempts.map((test, index) => (
                    <Box
                      key={test.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        position: 'relative',
                        width: `${80 / testAttempts.length}%`,
                        height: '100%',
                        zIndex: 3,
                        '&:hover': {
                          '& .column-tooltip': {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    >
                      {/* Тултип при наведении */}
                      <Box
                        className="column-tooltip"
                        sx={{
                          position: 'absolute',
                          top: -60,
                          bgcolor: 'background.paper',
                          color: 'text.primary',
                          p: 1,
                          borderRadius: 1,
                          boxShadow: 3,
                          zIndex: 10,
                          minWidth: 120,
                          textAlign: 'center',
                          opacity: 0,
                          transform: 'translateY(10px)',
                          transition: 'all 0.2s ease',
                          pointerEvents: 'none',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -5,
                            left: 'calc(50% - 5px)',
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'rotate(45deg)',
                          },
                        }}
                      >
                        <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>
                          {test.testTitle}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ color: getScoreColor(test.score) }}
                        >
                          Результат: {test.score}%
                        </Typography>
                        <Typography variant="caption" display="block">
                          {test.correctAnswers} из {test.totalQuestions} вопросов
                        </Typography>
                      </Box>

                      {/* Процент над столбцом */}
                      <Typography
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          top: -25,
                          color: getScoreColor(test.score),
                          fontWeight: 'bold',
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        }}
                      >
                        {test.score}%
                      </Typography>

                      {/* Столбец с анимацией */}
                      <Box
                        sx={{
                          width: { xs: '60%', sm: '55%' },
                          height: 0, // Начальная высота для анимации
                          opacity: 0,
                          bgcolor: getScoreColor(test.score) + '.main',
                          borderRadius: '4px 4px 0 0',
                          transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                          animation: `growUp${test.id} 1s forwards ${index * 0.15}s`,
                          [`@keyframes growUp${test.id}`]: {
                            '0%': {
                              height: '0%',
                              opacity: 0.3,
                            },
                            '100%': {
                              height: `${test.score}%`,
                              opacity: 1,
                            },
                          },
                          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                          '&:hover': {
                            width: { xs: '70%', sm: '65%' },
                            filter: 'brightness(1.1)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                            transform: 'translateY(-4px)',
                          },
                          zIndex: 2,
                          cursor: 'pointer',
                        }}
                        onClick={() => handleOpenDetails(test)}
                      />

                      {/* Номер попытки под столбцом */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          mt: 1,
                          position: 'absolute',
                          bottom: -20,
                          fontWeight: 'medium',
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        }}
                      >
                        {index + 1}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Typography
                  variant="caption"
                  align="center"
                  display="block"
                  sx={{
                    mt: 1,
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                    color: 'text.secondary',
                  }}
                >
                  Номера попыток (от старых к новым)
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Ответы по категориям */}
       
        
       

        {/* Таблица с историей прохождения тестов */}
        <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          История прохождения тестов
        </Typography>

        {testAttempts.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 0, border: '1px solid', borderColor: 'divider' }}
          >
            <Table size={isMobile ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Тест
                  </TableCell>
                  {!isSmall && (
                    <TableCell
                      sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      Категория
                    </TableCell>
                  )}
                  <TableCell
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Дата
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Результат
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 'bold', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Действия
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testAttempts.map(test => (
                  <TableRow key={test.id} hover>
                    <TableCell
                      sx={{
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        maxWidth: { xs: 120, sm: 200 },
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {test.testTitle}
                    </TableCell>
                    {!isSmall && (
                      <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {test.category}
                      </TableCell>
                    )}
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {formatDate(test.completedAt)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${test.score}%`}
                        color={getScoreColor(test.score)}
                        size="small"
                        sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenDetails(test)}
                        sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                      >
                        Детали
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 5 } }}>
            <Typography
              variant="h6"
              color="text.secondary"
              gutterBottom
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Нет пройденных тестов
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              У вас пока нет пройденных тестов. Перейдите в раздел "Доступные тесты", чтобы начать
              тестирование.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Диалоговое окно с деталями теста */}
      <Dialog
        open={openDetails}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'auto' },
          },
        }}
      >
        <DialogTitle sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.15rem', sm: '1.5rem' },
                wordBreak: 'break-word',
              }}
            >
              {selectedTest?.testTitle}
            </Typography>
            <IconButton
              onClick={handleCloseDetails}
              edge="end"
              aria-label="close"
              sx={{
                ml: 1,
                padding: { xs: 0.5, sm: 1 },
              }}
            >
              <CloseIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: { xs: 1.5, sm: 3 } }}>
          {selectedTest && (
            <>
              {/* Информация о тесте */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: 'text.secondary' }}
                    >
                      Категория:
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {selectedTest.category}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: 'text.secondary' }}
                    >
                      Дата:
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {formatDate(selectedTest.completedAt)}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: 'text.secondary' }}
                    >
                      Результат:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        color: getScoreColor(selectedTest.score),
                        fontWeight: 'bold',
                      }}
                    >
                      {selectedTest.score}% (
                      {selectedTest.status === 'passed' ? 'Тест пройден' : 'Тест не пройден'})
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: 'text.secondary' }}
                    >
                      Правильных ответов:
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {selectedTest.correctAnswers} из {selectedTest.totalQuestions}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Детали ответов */}
              <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Детали ответов
              </Typography>

              {testDetails.length > 0 ? (
                <Box sx={{ mb: 2 }}>
                  {testDetails.map((detail, index) => (
                    <Card
                      key={detail.questionId}
                      sx={{
                        mb: 2,
                        borderLeft: '4px solid',
                        borderColor: detail.isCorrect ? 'success.main' : 'error.main',
                      }}
                    >
                      <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            mb: 1,
                            fontWeight: 'bold',
                          }}
                        >
                          Вопрос {index + 1}: {detail.question}
                        </Typography>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1 }}>
                          {detail.options.map(option => (
                            <Box key={option.id}>
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  border: '1px solid',
                                  borderColor: 'divider',
                                  bgcolor:
                                    option.id === detail.correctAnswer
                                      ? 'success.lighter'
                                      : option.id === detail.userAnswer && !detail.isCorrect
                                        ? 'error.lighter'
                                        : 'background.paper',
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    fontWeight:
                                      option.id === detail.correctAnswer ? 'bold' : 'normal',
                                    color:
                                      option.id === detail.correctAnswer
                                        ? 'success.dark'
                                        : option.id === detail.userAnswer && !detail.isCorrect
                                          ? 'error.dark'
                                          : 'text.primary',
                                  }}
                                >
                                  {option.id.toUpperCase()}. {option.text}
                                  {option.id === detail.userAnswer && ' (ваш ответ)'}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            mt: 1.5,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            color: detail.isCorrect ? 'success.main' : 'error.main',
                            fontWeight: 'medium',
                          }}
                        >
                          {detail.isCorrect ? '✓ Правильно' : '✗ Неправильно'}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Typography
                  variant="body1"
                  sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}
                >
                  Детальная информация об ответах недоступна
                </Typography>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Button
            onClick={handleCloseDetails}
            variant="contained"
            sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default CompletedTests;
