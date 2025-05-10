import { useEffect, useState } from 'react';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  mockTests,
  Test,
  TestDifficulty,
  TestQuestion,
  TestStatus,
  TestTargetAudience,
  TestType,
} from '../../../types/test';

// Компонент для вкладок
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

// Компонент для формы редактирования вопроса
interface QuestionFormProps {
  question: TestQuestion;
  onChange: (updatedQuestion: TestQuestion) => void;
  onDelete: () => void;
  questionIndex: number;
}

const QuestionForm = ({ question, onChange, onDelete, questionIndex }: QuestionFormProps) => {
  const handleQuestionChange = (field: string, value: any) => {
    onChange({ ...question, [field]: value });
  };

  const handleOptionChange = (optionId: string, field: string, value: any) => {
    if (!question.options) return;

    const updatedOptions = question.options.map(option => {
      if (option.id === optionId) {
        return { ...option, [field]: value };
      }
      return option;
    });

    onChange({ ...question, options: updatedOptions });
  };

  const handleAddOption = () => {
    const newOption = {
      id: `o${Date.now()}`,
      text: '',
      isCorrect: false,
    };

    const updatedOptions = question.options ? [...question.options, newOption] : [newOption];
    onChange({ ...question, options: updatedOptions });
  };

  const handleDeleteOption = (optionId: string) => {
    if (!question.options) return;

    const updatedOptions = question.options.filter(option => option.id !== optionId);
    onChange({ ...question, options: updatedOptions });
  };

  const handleSetCorrectOption = (optionId: string) => {
    if (!question.options) return;

    // Для типа 'single' устанавливаем только один правильный ответ
    if (question.type === 'single') {
      const updatedOptions = question.options.map(option => ({
        ...option,
        isCorrect: option.id === optionId,
      }));
      onChange({ ...question, options: updatedOptions });
    } else if (question.type === 'multiple') {
      // Для типа 'multiple' переключаем значение isCorrect
      const updatedOptions = question.options.map(option => {
        if (option.id === optionId) {
          return { ...option, isCorrect: !option.isCorrect };
        }
        return option;
      });
      onChange({ ...question, options: updatedOptions });
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Вопрос {questionIndex + 1}</Typography>
          <IconButton color="error" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          label="Текст вопроса"
          value={question.text}
          onChange={e => handleQuestionChange('text', e.target.value)}
          sx={{ mb: 2 }}
          multiline
          rows={2}
        />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Тип вопроса</InputLabel>
              <Select
                value={question.type}
                label="Тип вопроса"
                onChange={e => handleQuestionChange('type', e.target.value)}
              >
                <MenuItem value="single">Один вариант</MenuItem>
                <MenuItem value="multiple">Несколько вариантов</MenuItem>
                <MenuItem value="text">Текстовый ответ</MenuItem>
                <MenuItem value="scale">Шкала оценки</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Баллы за вопрос"
              type="number"
              value={question.points}
              onChange={e => handleQuestionChange('points', parseInt(e.target.value, 10) || 0)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
        </Grid>

        {(question.type === 'single' || question.type === 'multiple') && (
          <Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
            >
              <Typography variant="subtitle1">Варианты ответов</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddOption}
                variant="outlined"
                size="small"
              >
                Добавить вариант
              </Button>
            </Box>

            {question.options &&
              question.options.map((option, index) => (
                <Box
                  key={option.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 1,
                    p: 1,
                    border: '1px solid',
                    borderColor: option.isCorrect ? 'success.main' : 'divider',
                    borderRadius: 1,
                    bgcolor: option.isCorrect ? 'success.50' : 'transparent',
                  }}
                >
                  <TextField
                    value={option.text}
                    onChange={e => handleOptionChange(option.id, 'text', e.target.value)}
                    placeholder={`Вариант ${index + 1}`}
                    fullWidth
                    variant="standard"
                    sx={{ mr: 1 }}
                  />
                  <Button
                    variant={option.isCorrect ? 'contained' : 'outlined'}
                    color={option.isCorrect ? 'success' : 'primary'}
                    size="small"
                    onClick={() => handleSetCorrectOption(option.id)}
                    sx={{ minWidth: 90, mr: 1 }}
                  >
                    {option.isCorrect ? 'Верный' : 'Отметить'}
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteOption(option.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

            {(!question.options || question.options.length === 0) && (
              <Typography color="text.secondary" sx={{ my: 2 }}>
                Добавьте варианты ответов
              </Typography>
            )}
          </Box>
        )}

        {question.type === 'text' && (
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2">
              Вопрос с текстовым ответом. Ответы на такие вопросы потребуют проверки HR-менеджером.
            </Typography>
          </Box>
        )}

        {question.type === 'scale' && (
          <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="body2">
              Вопрос со шкалой оценки. Тестируемый должен будет выбрать значение на шкале.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Основной компонент формы теста
const TestForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = !!id;

  // Состояние формы
  const [formData, setFormData] = useState<Partial<Test>>({
    title: '',
    description: '',
    targetAudience: 'both',
    duration: 60,
    passingScore: 70,
    type: 'professional',
    difficulty: 'medium',
    status: 'draft',
    department: '',
    position: '',
    questions: [],
    author: 'Текущий пользователь', // В реальном приложении получаем из контекста
  });

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Загрузка данных для редактирования
  useEffect(() => {
    if (isEditMode) {
      // Имитация загрузки теста с сервера
      const fetchTest = () => {
        setLoading(true);
        try {
          // В реальном приложении здесь был бы API запрос
          const test = mockTests.find(t => t.id === id);

          if (test) {
            setFormData(test);
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
    }
  }, [id, isEditMode]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Очищаем ошибку поля при изменении
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleQuestionChange = (questionId: string, updatedQuestion: TestQuestion) => {
    if (!formData.questions) return;

    const updatedQuestions = formData.questions.map(q => {
      if (q.id === questionId) {
        return updatedQuestion;
      }
      return q;
    });

    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleAddQuestion = () => {
    const newQuestion: TestQuestion = {
      id: `q${Date.now()}`,
      text: '',
      type: 'single',
      options: [],
      points: 5,
    };

    setFormData(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion],
    }));

    // Переключаемся на вкладку с вопросами
    setTabValue(1);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (!formData.questions) return;

    const updatedQuestions = formData.questions.filter(q => q.id !== questionId);

    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title) {
      errors.title = 'Название теста обязательно';
    }

    if (!formData.description) {
      errors.description = 'Описание теста обязательно';
    }

    if (!formData.questions || formData.questions.length === 0) {
      errors.questions = 'Добавьте хотя бы один вопрос';
    } else {
      formData.questions.forEach((question, index) => {
        if (!question.text) {
          errors[`question_${index}`] = `Вопрос ${index + 1}: добавьте текст вопроса`;
        }

        if (
          (question.type === 'single' || question.type === 'multiple') &&
          (!question.options || question.options.length < 2)
        ) {
          errors[`question_options_${index}`] =
            `Вопрос ${index + 1}: добавьте минимум 2 варианта ответа`;
        }

        if (
          question.type === 'single' &&
          question.options &&
          !question.options.some(o => o.isCorrect)
        ) {
          errors[`question_correct_${index}`] = `Вопрос ${index + 1}: отметьте правильный ответ`;
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Показываем ошибки в форме
      return;
    }

    try {
      // Здесь будет отправка данных на сервер
      console.log('Отправка данных:', formData);

      // В реальном приложении:
      // const response = await api.post('/tests', formData);
      // или
      // const response = await api.put(`/tests/${id}`, formData);

      // После успешного сохранения переходим к списку тестов
      navigate('/app/hr/tests');
    } catch (error) {
      console.error('Ошибка при сохранении теста:', error);
      setError('Ошибка при сохранении теста');
    }
  };

  const handleCancel = () => {
    navigate('/app/hr/tests');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={handleCancel} sx={{ mt: 2 }}>
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
          <Button startIcon={<ArrowBackIcon />} onClick={handleCancel}>
            Отмена
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSubmit}
            >
              Сохранить тест
            </Button>
          </Box>
        </Box>

        {/* Основная форма */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="test form tabs">
            <Tab label="Основная информация" {...a11yProps(0)} />
            <Tab
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Вопросы
                  {formData.questions && formData.questions.length > 0 && (
                    <Chip label={formData.questions.length} size="small" sx={{ ml: 1 }} />
                  )}
                </Box>
              }
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>

        {/* Вкладка основной информации */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название теста"
                value={formData.title || ''}
                onChange={e => handleInputChange('title', e.target.value)}
                error={!!formErrors.title}
                helperText={formErrors.title}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание теста"
                multiline
                rows={3}
                value={formData.description || ''}
                onChange={e => handleInputChange('description', e.target.value)}
                error={!!formErrors.description}
                helperText={formErrors.description}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Целевая аудитория</InputLabel>
                <Select
                  value={formData.targetAudience || 'both'}
                  label="Целевая аудитория"
                  onChange={e => handleInputChange('targetAudience', e.target.value)}
                >
                  <MenuItem value="candidates">Кандидаты</MenuItem>
                  <MenuItem value="employees">Сотрудники</MenuItem>
                  <MenuItem value="both">Все категории</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Тип теста</InputLabel>
                <Select
                  value={formData.type || 'professional'}
                  label="Тип теста"
                  onChange={e => handleInputChange('type', e.target.value)}
                >
                  <MenuItem value="professional">Профессиональный</MenuItem>
                  <MenuItem value="psychological">Психологический</MenuItem>
                  <MenuItem value="knowledge">Знания</MenuItem>
                  <MenuItem value="skills">Навыки</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Сложность</InputLabel>
                <Select
                  value={formData.difficulty || 'medium'}
                  label="Сложность"
                  onChange={e => handleInputChange('difficulty', e.target.value)}
                >
                  <MenuItem value="easy">Лёгкий</MenuItem>
                  <MenuItem value="medium">Средний</MenuItem>
                  <MenuItem value="hard">Сложный</MenuItem>
                  <MenuItem value="expert">Экспертный</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Длительность (мин)"
                type="number"
                value={formData.duration || 60}
                onChange={e => handleInputChange('duration', parseInt(e.target.value, 10))}
                InputProps={{ inputProps: { min: 5 } }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Проходной балл (%)"
                type="number"
                value={formData.passingScore || 70}
                onChange={e => handleInputChange('passingScore', parseInt(e.target.value, 10))}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Статус</InputLabel>
                <Select
                  value={formData.status || 'draft'}
                  label="Статус"
                  onChange={e => handleInputChange('status', e.target.value)}
                >
                  <MenuItem value="active">Активен</MenuItem>
                  <MenuItem value="draft">Черновик</MenuItem>
                  <MenuItem value="archived">Архив</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Отдел"
                value={formData.department || ''}
                onChange={e => handleInputChange('department', e.target.value)}
                helperText="Оставьте пустым, если тест подходит для всех отделов"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Должность"
                value={formData.position || ''}
                onChange={e => handleInputChange('position', e.target.value)}
                helperText="Оставьте пустым, если тест подходит для всех должностей"
              />
            </Grid>
          </Grid>

          {formErrors.questions && (
            <Typography color="error" sx={{ mt: 2 }}>
              {formErrors.questions}
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddQuestion}
              size="large"
            >
              Добавить вопрос
            </Button>
          </Box>
        </TabPanel>

        {/* Вкладка вопросов */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">Вопросы теста ({formData.questions?.length || 0})</Typography>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddQuestion}>
              Добавить вопрос
            </Button>
          </Box>

          {formData.questions && formData.questions.length > 0 ? (
            formData.questions.map((question, index) => (
              <QuestionForm
                key={question.id}
                question={question}
                onChange={updatedQuestion => handleQuestionChange(question.id, updatedQuestion)}
                onDelete={() => handleDeleteQuestion(question.id)}
                questionIndex={index}
              />
            ))
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
                bgcolor: 'grey.100',
                borderRadius: 1,
              }}
            >
              <Typography variant="body1" sx={{ mb: 2 }}>
                Еще нет добавленных вопросов
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddQuestion}>
                Добавить первый вопрос
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* Нижняя панель с кнопками */}
        <Divider sx={{ mt: 4, mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={handleCancel}>
            Отмена
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
          >
            {isEditMode ? 'Сохранить изменения' : 'Создать тест'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TestForm;
