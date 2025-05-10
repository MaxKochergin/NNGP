import { useEffect, useState } from 'react';
import {
  ArrowBack as ArrowBackIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PeopleAlt as PeopleIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
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
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { mockTests, Test, TestQuestion } from '../../../types/test';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`test-tabpanel-${index}`}
      aria-labelledby={`test-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `test-tab-${index}`,
    'aria-controls': `test-tabpanel-${index}`,
  };
}

const TestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Имитация запроса к API
    const fetchTest = () => {
      setLoading(true);
      try {
        // В реальном приложении здесь был бы запрос к API
        const foundTest = mockTests.find(t => t.id === id);

        if (foundTest) {
          setTest(foundTest);
          setError('');
        } else {
          setError('Тест не найден');
        }
      } catch (err) {
        setError('Ошибка при загрузке теста');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditClick = () => {
    navigate(`/app/hr/tests/edit/${id}`);
  };

  const handleBackClick = () => {
    navigate('/app/hr/tests');
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Здесь будет логика удаления теста
    // await api.delete(`/tests/${id}`);
    setDeleteDialogOpen(false);
    navigate('/app/hr/tests');
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const getTargetAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'candidates':
        return <PersonIcon />;
      case 'employees':
        return <PeopleIcon />;
      case 'both':
        return (
          <Box sx={{ position: 'relative' }}>
            <PersonIcon />
            <PeopleIcon sx={{ position: 'absolute', left: -10, opacity: 0.7 }} />
          </Box>
        );
      default:
        return <PersonIcon />;
    }
  };

  const getTargetAudienceLabel = (audience: string): string => {
    switch (audience) {
      case 'candidates':
        return 'Кандидаты';
      case 'employees':
        return 'Сотрудники';
      case 'both':
        return 'Все';
      default:
        return audience;
    }
  };

  const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (difficulty) {
      case 'easy':
        return 'success';
      case 'medium':
        return 'warning';
      case 'hard':
        return 'error';
      case 'expert':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'draft':
        return 'Черновик';
      case 'archived':
        return 'Архив';
      default:
        return status;
    }
  };

  const getQuestionTypeLabel = (type: string): string => {
    switch (type) {
      case 'single':
        return 'Один вариант';
      case 'multiple':
        return 'Несколько вариантов';
      case 'text':
        return 'Текстовый ответ';
      case 'scale':
        return 'Шкала';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  if (error || !test) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error || 'Тест не найден'}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBackClick} sx={{ mt: 2 }}>
          Вернуться к списку тестов
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 3 }, mb: { xs: 3, sm: 4 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 0, sm: 1 } }}>
        {/* Верхняя панель с действиями */}
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}
        >
          <Button startIcon={<ArrowBackIcon />} onClick={handleBackClick}>
            Назад к тестам
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={handleEditClick}>
              Редактировать
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteClick}
            >
              Удалить
            </Button>
          </Box>
        </Box>

        {/* Основная информация о тесте */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                bgcolor: theme.palette.primary.main,
                borderRadius: 1,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <AssignmentIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {test.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                <Chip
                  label={getStatusLabel(test.status)}
                  color={getStatusColor(test.status)}
                  size="small"
                />
                <Chip
                  label={test.difficulty}
                  color={getDifficultyColor(test.difficulty)}
                  size="small"
                />
                <Chip
                  label={getTargetAudienceLabel(test.targetAudience)}
                  icon={getTargetAudienceIcon(test.targetAudience)}
                  size="small"
                  variant="outlined"
                />
                <Chip label={test.type} size="small" variant="outlined" />
              </Box>
            </Box>
          </Box>

          <Typography variant="body1" paragraph>
            {test.description}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Длительность
                  </Typography>
                  <Typography variant="h6">{test.duration} мин</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Проходной балл
                  </Typography>
                  <Typography variant="h6">{test.passingScore}%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Вопросов
                  </Typography>
                  <Typography variant="h6">{test.questions.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Автор
                  </Typography>
                  <Typography variant="h6">{test.author}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Вкладки с информацией */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="test tabs">
            <Tab label="Вопросы" {...a11yProps(0)} />
            <Tab label="Статистика" {...a11yProps(1)} />
            <Tab label="История изменений" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Панель с вопросами теста */}
        <TabPanel value={tabValue} index={0}>
          {test.questions.length > 0 ? (
            test.questions.map((question: TestQuestion, index) => (
              <Paper
                key={question.id}
                elevation={1}
                sx={{ p: 2, mb: 2, border: '1px solid', borderColor: 'divider' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">
                    Вопрос {index + 1} ({question.points} баллов)
                  </Typography>
                  <Chip label={getQuestionTypeLabel(question.type)} size="small" />
                </Box>
                <Typography paragraph>{question.text}</Typography>

                {question.options && question.options.length > 0 && (
                  <Box sx={{ ml: 2 }}>
                    {question.options.map(option => (
                      <Box
                        key={option.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 1,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: option.isCorrect ? 'success.50' : 'transparent',
                          border: '1px solid',
                          borderColor: option.isCorrect ? 'success.main' : 'divider',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: option.isCorrect ? 'success.main' : 'text.primary',
                            fontWeight: option.isCorrect ? 'bold' : 'regular',
                          }}
                        >
                          {option.text}
                          {option.isCorrect && ' ✓'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {question.type === 'text' && (
                  <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Тип ответа: текст
                    </Typography>
                  </Box>
                )}

                {question.type === 'scale' && (
                  <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Тип ответа: шкала оценки
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))
          ) : (
            <Typography sx={{ mt: 2 }}>В этом тесте еще нет вопросов.</Typography>
          )}
        </TabPanel>

        {/* Панель со статистикой */}
        <TabPanel value={tabValue} index={1}>
          <Typography>Статистика прохождения теста (в разработке)</Typography>
        </TabPanel>

        {/* Панель с историей изменений */}
        <TabPanel value={tabValue} index={2}>
          <Typography>История изменений теста (в разработке)</Typography>
        </TabPanel>
      </Paper>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Удаление теста</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы действительно хотите удалить тест "{test.title}"? Это действие нельзя будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Отмена</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TestDetails;
