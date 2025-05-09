import { useState } from 'react';
import { Assignment, Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';

// Типы данных для тестов и вопросов
interface TestOption {
  id: string;
  text: string;
}

interface TestQuestion {
  id: string;
  text: string;
  options: TestOption[];
  correctAnswer: string;
}

interface Test {
  id: string;
  title: string;
  category: string;
  duration: number;
  questions: number;
  difficulty: string;
  description: string;
}

interface QuestionsMap {
  [key: string]: TestQuestion[];
}

// Временная заглушка для данных по тестам
const testsMock: Test[] = [
  {
    id: '1',
    title: 'Основы расчета конструкций',
    category: 'Инженер ПГС',
    duration: 30,
    questions: 15,
    difficulty: 'Средний',
    description: 'Базовый тест на знание расчетов в ПГС',
  },
  {
    id: '2',
    title: 'Железобетонные конструкции',
    category: 'Инженер ПГС',
    duration: 45,
    questions: 20,
    difficulty: 'Продвинутый',
    description: 'Тест на знание проектирования и расчета ЖБК',
  },
  {
    id: '3',
    title: 'Основы сметного дела',
    category: 'Сметчик',
    duration: 40,
    questions: 18,
    difficulty: 'Базовый',
    description: 'Базовый тест на знание сметного дела',
  },
  {
    id: '4',
    title: 'Системы отопления и вентиляции',
    category: 'Инженер по ОВ',
    duration: 35,
    questions: 15,
    difficulty: 'Средний',
    description: 'Тест на знание проектирования систем ОВ',
  },
  {
    id: '5',
    title: 'Проектирование электрических сетей',
    category: 'Инженер по проектированию ЭОМ',
    duration: 50,
    questions: 22,
    difficulty: 'Продвинутый',
    description: 'Тест для специалистов по проектированию электрооборудования и сетей',
  },
  {
    id: '6',
    title: 'Архитектурные решения',
    category: 'Проектировщик КМ/КЖ/АР',
    duration: 40,
    questions: 18,
    difficulty: 'Средний',
    description: 'Тест на знание проектирования архитектурных решений',
  },
];

// Генерация дополнительных вопросов для тестов
const generateMockQuestions = (testId: string, count: number): TestQuestion[] => {
  const questions: TestQuestion[] = [];

  // Базовые вопросы для разных типов тестов
  const baseQuestions: Record<string, { text: string; options: { id: string; text: string }[] }[]> =
    {
      '1': [
        // Основы расчета конструкций (ПГС)
        {
          text: 'Какой нормативный документ используется для расчета нагрузок на здания и сооружения?',
          options: [
            { id: 'a', text: 'СП 20.13330' },
            { id: 'b', text: 'СП 50.13330' },
            { id: 'c', text: 'СП 70.13330' },
            { id: 'd', text: 'СП 22.13330' },
          ],
        },
        {
          text: 'Что такое предельное состояние конструкции?',
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
        {
          text: 'Какая группа предельных состояний отвечает за прочность конструкции?',
          options: [
            { id: 'a', text: 'Первая группа' },
            { id: 'b', text: 'Вторая группа' },
            { id: 'c', text: 'Третья группа' },
            { id: 'd', text: 'Четвертая группа' },
          ],
        },
        {
          text: 'Для чего предназначен коэффициент надежности по нагрузке?',
          options: [
            { id: 'a', text: 'Учитывает возможное отклонение нагрузки в неблагоприятную сторону' },
            { id: 'b', text: 'Учитывает условия эксплуатации конструкции' },
            { id: 'c', text: 'Учитывает степень ответственности здания' },
            { id: 'd', text: 'Учитывает качество материала конструкции' },
          ],
        },
        {
          text: 'Что такое расчетное сопротивление материала?',
          options: [
            { id: 'a', text: 'Максимальное напряжение, которое может выдержать материал' },
            { id: 'b', text: 'Нормативное сопротивление, деленное на коэффициент надежности' },
            { id: 'c', text: 'Предел прочности материала при разрушении' },
            { id: 'd', text: 'Среднее значение сопротивления материала' },
          ],
        },
      ],
      '2': [
        // Железобетонные конструкции (ПГС)
        {
          text: 'Какие классы бетона по прочности на сжатие применяются в современном строительстве?',
          options: [
            { id: 'a', text: 'B15, B20, B25' },
            { id: 'b', text: 'B40, B45, B50' },
            { id: 'c', text: 'B60, B70, B80' },
            { id: 'd', text: 'B90, B100, B110' },
          ],
        },
        {
          text: 'Как обозначается арматура класса A-III по новой классификации?',
          options: [
            { id: 'a', text: 'A300' },
            { id: 'b', text: 'A400' },
            { id: 'c', text: 'A500' },
            { id: 'd', text: 'A600' },
          ],
        },
        {
          text: 'Какое минимальное значение защитного слоя бетона для арматуры в плитах перекрытия?',
          options: [
            { id: 'a', text: '10 мм' },
            { id: 'b', text: '15 мм' },
            { id: 'c', text: '20 мм' },
            { id: 'd', text: '25 мм' },
          ],
        },
        {
          text: 'Что такое рабочая высота сечения железобетонной балки?',
          options: [
            { id: 'a', text: 'Полная высота сечения' },
            { id: 'b', text: 'Расстояние от центра тяжести арматуры до противоположной грани' },
            { id: 'c', text: 'Ширина балки' },
            { id: 'd', text: 'Толщина защитного слоя' },
          ],
        },
        {
          text: 'С какой целью используют поперечную арматуру (хомуты) в железобетонных балках?',
          options: [
            { id: 'a', text: 'Для восприятия растягивающих усилий при изгибе' },
            {
              id: 'b',
              text: 'Для восприятия поперечных сил и предотвращения образования наклонных трещин',
            },
            { id: 'c', text: 'Только для соединения продольной арматуры' },
            { id: 'd', text: 'Для увеличения прочности бетона на сжатие' },
          ],
        },
      ],
      '3': [
        // Основы сметного дела
        {
          text: 'Что такое ФЕР?',
          options: [
            { id: 'a', text: 'Федеральные единичные расценки' },
            { id: 'b', text: 'Формальная единица расчета' },
            { id: 'c', text: 'Финансово-экономическое распределение' },
            { id: 'd', text: 'Фонд единого развития' },
          ],
        },
        {
          text: 'Какие виды смет существуют?',
          options: [
            { id: 'a', text: 'Только локальные' },
            { id: 'b', text: 'Локальные и объектные' },
            { id: 'c', text: 'Локальные, объектные и сводные' },
            { id: 'd', text: 'Только сводные' },
          ],
        },
        {
          text: 'Что входит в состав прямых затрат?',
          options: [
            { id: 'a', text: 'Материалы, оплата труда, эксплуатация машин' },
            { id: 'b', text: 'Накладные расходы и сметная прибыль' },
            { id: 'c', text: 'Только стоимость материалов' },
            { id: 'd', text: 'Все расходы, включая НДС' },
          ],
        },
        {
          text: 'Что такое накладные расходы?',
          options: [
            { id: 'a', text: 'Затраты на приобретение материалов' },
            {
              id: 'b',
              text: 'Затраты, связанные с созданием условий производства и его обслуживанием',
            },
            { id: 'c', text: 'Затраты на эксплуатацию строительных машин' },
            { id: 'd', text: 'Затраты на оплату труда основных рабочих' },
          ],
        },
        {
          text: 'Какой метод составления смет основан на использовании текущих цен ресурсов?',
          options: [
            { id: 'a', text: 'Базисно-индексный' },
            { id: 'b', text: 'Ресурсный' },
            { id: 'c', text: 'Ресурсно-индексный' },
            { id: 'd', text: 'Базисный' },
          ],
        },
      ],
      '4': [
        // Системы отопления и вентиляции
        {
          text: 'Какие системы отопления применяются в многоквартирных домах?',
          options: [
            { id: 'a', text: 'Только однотрубные' },
            { id: 'b', text: 'Только двухтрубные' },
            { id: 'c', text: 'Однотрубные и двухтрубные' },
            { id: 'd', text: 'Только воздушные' },
          ],
        },
        {
          text: 'Как рассчитывается кратность воздухообмена в помещении?',
          options: [
            { id: 'a', text: 'Отношение объема вытяжного воздуха к объему помещения' },
            { id: 'b', text: 'Отношение объема приточного воздуха к площади помещения' },
            { id: 'c', text: 'Сумма объемов приточного и вытяжного воздуха' },
            { id: 'd', text: 'Произведение объема помещения и коэффициента теплопередачи' },
          ],
        },
        {
          text: 'Какой тип системы вентиляции обеспечивает подачу свежего воздуха в помещение?',
          options: [
            { id: 'a', text: 'Приточная' },
            { id: 'b', text: 'Вытяжная' },
            { id: 'c', text: 'Рециркуляционная' },
            { id: 'd', text: 'Естественная' },
          ],
        },
        {
          text: 'Что такое тепловая мощность системы отопления?',
          options: [
            {
              id: 'a',
              text: 'Количество теплоты, необходимое для обогрева помещения за единицу времени',
            },
            { id: 'b', text: 'Температура теплоносителя в системе отопления' },
            { id: 'c', text: 'Объем теплоносителя в системе' },
            { id: 'd', text: 'Площадь отапливаемого помещения' },
          ],
        },
        {
          text: 'Какой параметр является основным при подборе радиатора отопления?',
          options: [
            { id: 'a', text: 'Цвет радиатора' },
            { id: 'b', text: 'Тепловая мощность' },
            { id: 'c', text: 'Производитель радиатора' },
            { id: 'd', text: 'Стоимость радиатора' },
          ],
        },
      ],
      '5': [
        // Проектирование электрических сетей
        {
          text: 'Что такое ВРУ?',
          options: [
            { id: 'a', text: 'Вводно-распределительное устройство' },
            { id: 'b', text: 'Временное распределение узлов' },
            { id: 'c', text: 'Высоковольтное распределительное устройство' },
            { id: 'd', text: 'Внутреннее распределение установок' },
          ],
        },
        {
          text: 'Какой допустимый уровень освещенности для рабочих мест с компьютерами?',
          options: [
            { id: 'a', text: '100-150 лк' },
            { id: 'b', text: '200-300 лк' },
            { id: 'c', text: '300-500 лк' },
            { id: 'd', text: '500-700 лк' },
          ],
        },
        {
          text: 'Каким сечением должен быть нулевой рабочий проводник в трехфазной сети?',
          options: [
            { id: 'a', text: 'Меньше фазного' },
            { id: 'b', text: 'Равным фазному' },
            { id: 'c', text: 'Больше фазного' },
            { id: 'd', text: 'Сечение не имеет значения' },
          ],
        },
        {
          text: 'Какая категория электроснабжения требует наличия двух независимых источников питания?',
          options: [
            { id: 'a', text: 'Первая' },
            { id: 'b', text: 'Вторая' },
            { id: 'c', text: 'Третья' },
            { id: 'd', text: 'Четвертая' },
          ],
        },
        {
          text: 'Что такое ОУР в электрических схемах?',
          options: [
            { id: 'a', text: 'Осветительная установка рабочая' },
            { id: 'b', text: 'Отказоустойчивое реле' },
            { id: 'c', text: 'Основное управление распределением' },
            { id: 'd', text: 'Однолинейная условная расчетная схема' },
          ],
        },
      ],
      '6': [
        // Архитектурные решения
        {
          text: 'Что такое КМ в проектной документации?',
          options: [
            { id: 'a', text: 'Конструкции металлические' },
            { id: 'b', text: 'Контроль материалов' },
            { id: 'c', text: 'Коэффициент масштабирования' },
            { id: 'd', text: 'Конструктивные модули' },
          ],
        },
        {
          text: 'Что содержит раздел АР проектной документации?',
          options: [
            { id: 'a', text: 'Архитектурные решения' },
            { id: 'b', text: 'Армирование ростверков' },
            { id: 'c', text: 'Аварийные работы' },
            { id: 'd', text: 'Анализ рисков' },
          ],
        },
        {
          text: 'Какой минимальный уклон кровли для профнастила?',
          options: [
            { id: 'a', text: '5%' },
            { id: 'b', text: '10%' },
            { id: 'c', text: '15%' },
            { id: 'd', text: '20%' },
          ],
        },
        {
          text: 'Что такое КЖ в проектной документации?',
          options: [
            { id: 'a', text: 'Конструкции жилья' },
            { id: 'b', text: 'Конструкции железобетонные' },
            { id: 'c', text: 'Капитальные железоблоки' },
            { id: 'd', text: 'Комплексный журнал' },
          ],
        },
        {
          text: 'Какой документ регламентирует требования к эвакуационным путям и выходам?',
          options: [
            { id: 'a', text: 'СП 1.13130' },
            { id: 'b', text: 'СП 2.13130' },
            { id: 'c', text: 'СП 4.13130' },
            { id: 'd', text: 'СП 7.13130' },
          ],
        },
      ],
    };

  // Генерируем нужное количество вопросов
  for (let i = 0; i < count; i++) {
    const baseQuestionsForType = baseQuestions[testId] || [];
    const questionIndex = i % baseQuestionsForType.length;
    const baseQuestion = baseQuestionsForType[questionIndex];

    if (baseQuestion) {
      questions.push({
        id: `${testId}_${i + 1}`,
        text: baseQuestion.text,
        options: [...baseQuestion.options],
        correctAnswer: baseQuestion.options[0].id, // Делаем первый вариант правильным для примера
      });
    } else {
      // Генерируем случайный вопрос, если нет базовых вопросов для данного типа теста
      questions.push({
        id: `${testId}_${i + 1}`,
        text: `Вопрос ${i + 1} для теста ${testId}`,
        options: [
          { id: 'a', text: 'Вариант A' },
          { id: 'b', text: 'Вариант B' },
          { id: 'c', text: 'Вариант C' },
          { id: 'd', text: 'Вариант D' },
        ],
        correctAnswer: 'a',
      });
    }
  }

  return questions;
};

// Динамическая генерация вопросов для каждого теста
const generateQuestionsMock = (): QuestionsMap => {
  const questionsMap: QuestionsMap = {};

  testsMock.forEach(test => {
    questionsMap[test.id] = generateMockQuestions(test.id, test.questions);
  });

  return questionsMap;
};

// Заглушка для вопросов теста
const questionsMock: QuestionsMap = generateQuestionsMock();

function AvailableTests() {
  const [tests, setTests] = useState<Test[]>(testsMock);
  const user = useAppSelector(state => state.auth.user);
  const userRole = user?.roles?.[0] || 'candidate';

  // Состояния для модального окна и теста
  const [open, setOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<Test | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // В реальном приложении здесь будет запрос к API для получения доступных тестов
  // useEffect(() => {
  //   const fetchAvailableTests = async () => {
  //     try {
  //       // const response = await api.get('/tests/available');
  //       // setTests(response.data);
  //     } catch (error) {
  //       console.error('Ошибка при загрузке тестов:', error);
  //     }
  //   };
  //
  //   fetchAvailableTests();
  // }, []);

  const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (difficulty.toLowerCase()) {
      case 'базовый':
        return 'success';
      case 'средний':
        return 'warning';
      case 'продвинутый':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleStartTest = (test: Test) => {
    setCurrentTest(test);
    // Получаем вопросы для теста из заглушки и убеждаемся, что их количество соответствует указанному
    const testQuestions = questionsMock[test.id] || [];
    setCurrentQuestions(testQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setAnswers({});
    setTestCompleted(false);
    setScore(0);
    setTimeLeft(test.duration);
    setOpen(true);
  };

  const handleCloseModal = () => {
    if (!testCompleted) {
      // Можно добавить дополнительное подтверждение для закрытия незавершенного теста
      if (window.confirm('Вы уверены, что хотите закрыть тест? Прогресс будет потерян.')) {
        setOpen(false);
      }
    } else {
      setOpen(false);
    }
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    // Сохраняем текущий ответ
    const newAnswers = { ...answers };
    newAnswers[currentQuestions[currentQuestionIndex].id] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestionIndex < currentQuestions.length - 1) {
      // Переход к следующему вопросу
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
    } else {
      // Завершение теста и подсчет результатов
      calculateTestResults(newAnswers);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      // Восстанавливаем предыдущий ответ
      const questionId = currentQuestions[currentQuestionIndex - 1].id;
      setSelectedAnswer(answers[questionId] || '');
    }
  };

  const calculateTestResults = (finalAnswers: Record<string, string>) => {
    let correctCount = 0;

    currentQuestions.forEach(question => {
      if (finalAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / currentQuestions.length) * 100);
    setScore(finalScore);
    setTestCompleted(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3 }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Assignment sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1">
            Доступные тесты
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {tests.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {tests.map(test => (
              <Box key={test.id} sx={{ width: { xs: '100%', md: '47%', lg: '31%' } }}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardHeader
                    title={test.title}
                    subheader={test.category}
                    action={
                      <Chip
                        label={test.difficulty}
                        color={getDifficultyColor(test.difficulty)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    }
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {test.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Время:</strong> {test.duration} мин
                      </Typography>
                      <Typography variant="body2">
                        <strong>Вопросов:</strong> {test.questions}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => handleStartTest(test)}
                    >
                      Начать тест
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Нет доступных тестов
            </Typography>
            <Typography variant="body1" color="text.secondary">
              В данный момент для вас не назначено тестов. Пожалуйста, проверьте позже или свяжитесь
              с HR-менеджером.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Модальное окно для прохождения теста */}
      <Dialog
        open={open}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">{currentTest?.title}</Typography>
            <IconButton onClick={handleCloseModal} edge="end" aria-label="close">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ flexGrow: 1 }}>
          {!testCompleted ? (
            // Отображение вопроса
            currentQuestions.length > 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">
                    Вопрос {currentQuestionIndex + 1} из {currentQuestions.length}
                  </Typography>
                  <Typography variant="subtitle1">Осталось: {currentTest?.duration} мин</Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={((currentQuestionIndex + 1) / currentQuestions.length) * 100}
                  sx={{ mb: 3, height: 6, borderRadius: 3 }}
                />

                <Typography variant="h6" gutterBottom>
                  {currentQuestions[currentQuestionIndex].text}
                </Typography>

                <FormControl component="fieldset" sx={{ width: '100%', mt: 3 }}>
                  <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
                    {currentQuestions[currentQuestionIndex].options.map((option: TestOption) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.id}
                        control={
                          <Radio
                            sx={{
                              '&.Mui-checked': {
                                color: 'primary.main',
                              },
                            }}
                          />
                        }
                        label={option.text}
                        sx={{
                          mb: 1,
                          p: 1.5,
                          borderRadius: 2,
                          width: '100%',
                          border: '1px solid',
                          borderColor: 'divider',
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                          ...(selectedAnswer === option.id
                            ? {
                                bgcolor: 'primary.light',
                                borderColor: 'primary.main',
                              }
                            : {}),
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            )
          ) : (
            // Отображение результатов
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h4" gutterBottom>
                Тест завершен!
              </Typography>
              <Typography
                variant="h5"
                gutterBottom
                color={score >= 70 ? 'success.main' : 'error.main'}
              >
                Ваш результат: {score}%
              </Typography>
              <Typography variant="body1" sx={{ mt: 3 }}>
                Правильных ответов: {Math.round((score / 100) * currentQuestions.length)} из{' '}
                {currentQuestions.length}
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleCloseModal}
                  sx={{ mr: 2 }}
                >
                  Закрыть
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    // В реальном приложении здесь может быть логика для просмотра результатов
                    handleCloseModal();
                  }}
                >
                  Смотреть детали
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>

        {!testCompleted && (
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
              Назад
            </Button>
            <Button
              variant="contained"
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              color="primary"
            >
              {currentQuestionIndex < currentQuestions.length - 1 ? 'Далее' : 'Завершить тест'}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
}

export default AvailableTests;
