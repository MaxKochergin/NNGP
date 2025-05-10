import { useEffect, useState } from 'react';
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarMonthIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Event as EventIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Send as SendIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

// Расширенные тестовые данные для кандидатов
const mockCandidatesDetails = [
  {
    id: '1',
    name: 'Иванов Иван Иванович',
    position: 'Инженер-конструктор',
    experience: '5 лет',
    status: 'Новый',
    lastActivity: '2025-04-15',
    skills: [
      'AutoCAD',
      'Revit',
      'Железобетонные конструкции',
      'ЛИРА-САПР',
      'Нормативная документация',
    ],
    avatar: null,
    email: 'ivanov@example.com',
    phone: '+7 (999) 123-45-67',
    resumeUrl: '/documents/resume1.pdf',
    salary: '120 000 руб.',
    location: 'Москва',
    education: [
      {
        id: '1',
        degree: 'Магистр',
        specialty: 'Промышленное и гражданское строительство',
        university: 'Московский государственный строительный университет',
        year: '2018',
        description: 'Специализация: проектирование железобетонных конструкций. Диплом с отличием.',
      },
      {
        id: '2',
        degree: 'Бакалавр',
        specialty: 'Строительство',
        university: 'Московский государственный строительный университет',
        year: '2016',
        description: 'Направление: промышленное и гражданское строительство.',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'ООО "СтройПроект"',
        position: 'Инженер-конструктор',
        period: '2020-2025',
        description:
          'Проектирование железобетонных конструкций многоквартирных жилых домов. Расчет конструкций в ЛИРА-САПР. Разработка рабочей документации.',
      },
      {
        id: '2',
        company: 'ООО "Стройэксперт"',
        position: 'Техник-проектировщик',
        period: '2016-2020',
        description:
          'Разработка чертежей строительных конструкций. Оформление проектной документации. Помощь ведущим специалистам в расчетах.',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-15',
        text: 'Проведено первичное собеседование. Кандидат показал хорошие знания в области проектирования железобетонных конструкций. Предложено пройти тестовое задание.',
        author: 'Петрова А.С. (HR)',
      },
      {
        id: '2',
        date: '2025-04-10',
        text: 'Проведен предварительный отбор резюме. Кандидат соответствует требованиям вакансии. Рекомендовано пригласить на собеседование.',
        author: 'Смирнов П.Р. (Руководитель отдела)',
      },
    ],
    interviews: [
      {
        id: '1',
        date: '2025-04-15',
        time: '14:00',
        type: 'Первичное собеседование',
        status: 'Проведено',
        interviewers: ['Петрова А.С.', 'Смирнов П.Р.'],
        result: 'Успешно',
        notes: 'Кандидат успешно прошел собеседование. Требуется техническая оценка.',
      },
      {
        id: '2',
        date: '2025-04-20',
        time: '11:30',
        type: 'Техническое интервью',
        status: 'Запланировано',
        interviewers: ['Смирнов П.Р.', 'Козлов И.А.'],
        result: null,
        notes: '',
      },
    ],
  },
  {
    id: '2',
    name: 'Петрова Анна Сергеевна',
    position: 'Инженер-проектировщик ОВиК',
    experience: '5 лет',
    status: 'На собеседовании',
    lastActivity: '2025-04-14',
    skills: [
      'AutoCAD',
      'Revit MEP',
      'Расчет систем вентиляции',
      'BIM-проектирование',
      'Нормативная документация',
    ],
    avatar: null,
    email: 'petrova@example.com',
    phone: '+7 (999) 234-56-78',
    resumeUrl: '/documents/resume2.pdf',
    salary: '130 000 руб.',
    location: 'Москва',
    education: [
      {
        id: '1',
        degree: 'Магистр',
        specialty: 'Теплогазоснабжение и вентиляция',
        university: 'Московский государственный строительный университет',
        year: '2018',
        description:
          'Специализация: проектирование систем отопления, вентиляции и кондиционирования.',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'ООО "ИнженерПроект"',
        position: 'Инженер-проектировщик ОВиК',
        period: '2020-2025',
        description:
          'Проектирование систем отопления, вентиляции и кондиционирования для жилых и общественных зданий. BIM-моделирование инженерных систем.',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-14',
        text: 'Проведено первичное собеседование. Кандидат имеет хороший опыт работы с системами ОВиК в жилых комплексах.',
        author: 'Петрова А.С. (HR)',
      },
    ],
    interviews: [
      {
        id: '1',
        date: '2025-04-14',
        time: '11:00',
        type: 'Первичное собеседование',
        status: 'Проведено',
        interviewers: ['Петрова А.С.', 'Николаев К.Р.'],
        result: 'Успешно',
        notes: 'Кандидат показал хорошие знания. Рекомендован к техническому собеседованию.',
      },
      {
        id: '2',
        date: '2025-04-21',
        time: '15:00',
        type: 'Техническое интервью',
        status: 'Запланировано',
        interviewers: ['Николаев К.Р.', 'Смирнова О.В.'],
        result: null,
        notes: '',
      },
    ],
  },
  {
    id: '3',
    name: 'Сидоров Алексей Петрович',
    position: 'Ведущий инженер-конструктор',
    experience: '5 лет',
    status: 'Тестовое задание',
    lastActivity: '2025-04-12',
    skills: ['ЛИРА-САПР', 'AutoCAD', 'Revit', 'Расчет конструкций', 'Организация проектных работ'],
    avatar: null,
    email: 'sidorov@example.com',
    phone: '+7 (999) 345-67-89',
    resumeUrl: '/documents/resume3.pdf',
    salary: '180 000 руб.',
    location: 'Москва',
    education: [
      {
        id: '1',
        degree: 'Магистр',
        specialty: 'Промышленное и гражданское строительство',
        university: 'Московский государственный строительный университет',
        year: '2017',
        description: 'Специализация: проектирование уникальных зданий и сооружений.',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'ООО "Стройпроект"',
        position: 'Инженер-конструктор 1 категории',
        period: '2020-2025',
        description:
          'Разработка конструктивных решений для многоэтажных жилых и общественных зданий. Расчеты зданий на различные воздействия.',
      },
      {
        id: '2',
        company: 'ООО "СтройконструкцияПроект"',
        position: 'Инженер-конструктор',
        period: '2017-2020',
        description:
          'Проектирование железобетонных и металлических конструкций. Разработка рабочей документации марки КЖ и КМ.',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-12',
        text: 'Кандидату выдано тестовое задание по расчету конструкций многоэтажного здания. Срок выполнения - до 19.04.2025.',
        author: 'Кузнецов Д.М. (Технический директор)',
      },
    ],
    interviews: [
      {
        id: '1',
        date: '2025-04-10',
        time: '10:00',
        type: 'Первичное собеседование',
        status: 'Проведено',
        interviewers: ['Петрова А.С.', 'Кузнецов Д.М.'],
        result: 'Успешно',
        notes: 'Кандидат имеет хороший опыт. Предложено пройти тестовое задание.',
      },
    ],
  },
  {
    id: '4',
    name: 'Козлова Екатерина Владимировна',
    position: 'Архитектор',
    experience: '5 лет',
    status: 'Принят',
    lastActivity: '2025-04-10',
    skills: [
      'ArchiCAD',
      'Revit',
      '3D моделирование',
      'Adobe Photoshop',
      'Концептуальное проектирование',
    ],
    avatar: null,
    email: 'kozlova@example.com',
    phone: '+7 (999) 456-78-90',
    resumeUrl: '/documents/resume4.pdf',
    salary: '150 000 руб.',
    location: 'Москва',
    education: [
      {
        id: '1',
        degree: 'Магистр',
        specialty: 'Архитектура',
        university: 'Московский архитектурный институт',
        year: '2018',
        description:
          'Специализация: проектирование жилых и общественных зданий. Диплом с отличием.',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'ООО "АрхПроект"',
        position: 'Архитектор',
        period: '2020-2025',
        description:
          'Разработка архитектурных концепций и проектной документации для жилых и общественных зданий. Подготовка визуализаций и презентаций проектов.',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-10',
        text: 'Кандидат принят на работу с испытательным сроком 3 месяца. Выход - 01.05.2025.',
        author: 'Петрова А.С. (HR)',
      },
      {
        id: '2',
        date: '2025-04-05',
        text: 'Проведено финальное интервью с руководителем архитектурного отдела. Принято решение о найме.',
        author: 'Соколова Е.В. (Главный архитектор)',
      },
    ],
    interviews: [
      {
        id: '1',
        date: '2025-04-01',
        time: '14:00',
        type: 'Первичное собеседование',
        status: 'Проведено',
        interviewers: ['Петрова А.С.', 'Соколова Е.В.'],
        result: 'Успешно',
        notes: 'Кандидат показал отличные знания и портфолио проектов.',
      },
      {
        id: '2',
        date: '2025-04-05',
        time: '16:00',
        type: 'Финальное интервью',
        status: 'Проведено',
        interviewers: ['Соколова Е.В.', 'Васильев П.М.'],
        result: 'Успешно',
        notes: 'Принято решение о найме кандидата.',
      },
    ],
  },
  {
    id: '5',
    name: 'Соколов Дмитрий Александрович',
    position: 'BIM-координатор',
    experience: '5 лет',
    status: 'Отклонен',
    lastActivity: '2025-04-08',
    skills: ['Revit', 'Navisworks', 'BIM-координация', 'Autodesk BIM 360', 'Dynamo'],
    avatar: null,
    email: 'sokolov@example.com',
    phone: '+7 (999) 567-89-01',
    resumeUrl: '/documents/resume5.pdf',
    salary: '160 000 руб.',
    location: 'Москва',
    education: [
      {
        id: '1',
        degree: 'Специалист',
        specialty: 'Информационные системы и технологии',
        university: 'Московский государственный технический университет',
        year: '2018',
        description: 'Специализация: информационное моделирование в строительстве.',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'ООО "БИМ-Проект"',
        position: 'BIM-координатор',
        period: '2020-2025',
        description:
          'Координация BIM-проектов, настройка шаблонов, обучение сотрудников. Выявление коллизий и управление данными проекта.',
      },
      {
        id: '2',
        company: 'ООО "ПроектСтрой"',
        position: 'BIM-специалист',
        period: '2018-2020',
        description:
          'Разработка информационных моделей зданий. Подготовка документации на основе BIM-моделей.',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-08',
        text: 'Кандидат отклонен. Причина: недостаточный опыт координации междисциплинарных проектов.',
        author: 'Михайлов В.А. (Руководитель BIM-отдела)',
      },
      {
        id: '2',
        date: '2025-04-02',
        text: 'Проведено техническое собеседование. Кандидат хорошо знает Revit, но имеет пробелы в Navisworks и BIM 360.',
        author: 'Михайлов В.А. (Руководитель BIM-отдела)',
      },
    ],
    interviews: [
      {
        id: '1',
        date: '2025-04-01',
        time: '11:00',
        type: 'Первичное собеседование',
        status: 'Проведено',
        interviewers: ['Петрова А.С.', 'Михайлов В.А.'],
        result: 'Условно',
        notes: 'Кандидат приглашен на техническое собеседование.',
      },
      {
        id: '2',
        date: '2025-04-02',
        time: '14:00',
        type: 'Техническое интервью',
        status: 'Проведено',
        interviewers: ['Михайлов В.А.', 'Сергеев А.К.'],
        result: 'Отклонен',
        notes: 'Недостаточный опыт для требуемой позиции.',
      },
    ],
  },
];

// Для обратной совместимости (компонент все еще может использовать эту переменную)
const mockCandidateDetails = mockCandidatesDetails[0];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`candidate-tabpanel-${index}`}
      aria-labelledby={`candidate-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const CandidateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [candidate, setCandidate] = useState(mockCandidateDetails);
  const [newNote, setNewNote] = useState('');

  // Имитация загрузки данных
  useEffect(() => {
    setLoading(true);

    // Имитация API-запроса
    setTimeout(() => {
      const foundCandidate = mockCandidatesDetails.find(c => c.id === id);
      if (foundCandidate) {
        setCandidate(foundCandidate);
        setError(null);
      } else {
        setError('Кандидат не найден');
      }
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/app/hr/candidates');
  };

  const handleEdit = () => {
    navigate(`/app/hr/candidates/${id}/edit`);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const newNoteItem = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        text: newNote,
        author: 'Вы (HR)',
      };

      setCandidate({
        ...candidate,
        notes: [newNoteItem, ...candidate.notes],
      });

      setNewNote('');
    }
  };

  // Функция для форматирования даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Отображение индикатора загрузки
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
          Вернуться к списку кандидатов
        </Button>
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'новый':
        return 'info';
      case 'на собеседовании':
        return 'warning';
      case 'тестовое задание':
        return 'warning';
      case 'принят':
        return 'success';
      case 'отклонен':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Заголовок и кнопки */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Профиль кандидата
          </Typography>
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit} sx={{ mr: 1 }}>
            Редактировать
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Основная информация */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={candidate.avatar || undefined}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  >
                    <PersonIcon sx={{ fontSize: 60 }} />
                  </Avatar>
                  <Typography variant="h5" component="div" align="center">
                    {candidate.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" align="center">
                    {candidate.position}
                  </Typography>
                  <Chip
                    label={candidate.status}
                    color={getStatusColor(candidate.status)}
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Контакты
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                      Email: {candidate.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                      Телефон: {candidate.phone}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                      Город: {candidate.location}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Основная информация
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                      Опыт работы: {candidate.experience}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                      Ожидаемая зарплата: {candidate.salary}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Навыки
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                      {candidate.skills.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ mt: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Скачать резюме
                    </Button>
                    <Button variant="contained" startIcon={<SendIcon />} fullWidth>
                      Отправить приглашение
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ближайшие собеседования
                </Typography>
                <Stack spacing={2}>
                  {candidate.interviews
                    .filter(interview => interview.status === 'Запланировано')
                    .map(interview => (
                      <Box key={interview.id} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <CalendarMonthIcon color="primary" sx={{ mr: 1, mt: 0.3 }} />
                        <Box>
                          <Typography variant="subtitle2">
                            {interview.type} - {formatDate(interview.date)}, {interview.time}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Интервьюеры: {interview.interviewers.join(', ')}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  {candidate.interviews.filter(interview => interview.status === 'Запланировано')
                    .length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Нет запланированных собеседований
                    </Typography>
                  )}
                </Stack>
                <Button variant="text" sx={{ mt: 2 }}>
                  Запланировать собеседование
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab icon={<WorkIcon />} label="Опыт работы" />
                <Tab icon={<SchoolIcon />} label="Образование" />
                <Tab icon={<DescriptionIcon />} label="Заметки" />
                <Tab icon={<EventIcon />} label="Собеседования" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Stack spacing={2}>
                {candidate.workExperience.map(exp => (
                  <Card key={exp.id} variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{exp.position}</Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {exp.company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {exp.period}
                      </Typography>
                      <Typography variant="body1">{exp.description}</Typography>
                    </CardContent>
                  </Card>
                ))}
                {candidate.workExperience.length === 0 && (
                  <Typography color="text.secondary">Нет данных об опыте работы</Typography>
                )}
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Stack spacing={2}>
                {candidate.education.map(edu => (
                  <Card key={edu.id} variant="outlined">
                    <CardContent>
                      <Typography variant="h6">
                        {edu.degree}, {edu.specialty}
                      </Typography>
                      <Typography variant="subtitle1">{edu.university}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Год окончания: {edu.year}
                      </Typography>
                      {edu.description && (
                        <Typography variant="body1">{edu.description}</Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {candidate.education.length === 0 && (
                  <Typography color="text.secondary">Нет данных об образовании</Typography>
                )}
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Добавить заметку"
                  multiline
                  rows={3}
                  fullWidth
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" onClick={handleAddNote} disabled={!newNote.trim()}>
                    Сохранить заметку
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2}>
                {candidate.notes.map(note => (
                  <Card key={note.id} variant="outlined">
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}
                      >
                        <span>{formatDate(note.date)}</span>
                        <span>{note.author}</span>
                      </Typography>
                      <Typography variant="body1">{note.text}</Typography>
                    </CardContent>
                  </Card>
                ))}
                {candidate.notes.length === 0 && (
                  <Typography color="text.secondary">Нет заметок</Typography>
                )}
              </Stack>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Stack spacing={2}>
                {candidate.interviews.map(interview => (
                  <Card
                    key={interview.id}
                    variant="outlined"
                    sx={{
                      borderLeft: '4px solid',
                      borderLeftColor:
                        interview.status === 'Проведено'
                          ? 'success.main'
                          : interview.status === 'Запланировано'
                            ? 'warning.main'
                            : 'error.main',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6">{interview.type}</Typography>
                        <Chip
                          label={interview.status}
                          color={
                            interview.status === 'Проведено'
                              ? 'success'
                              : interview.status === 'Запланировано'
                                ? 'warning'
                                : 'error'
                          }
                          size="small"
                        />
                      </Box>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        {formatDate(interview.date)}, {interview.time}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Интервьюеры: {interview.interviewers.join(', ')}
                      </Typography>

                      {interview.result && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="subtitle2">Результат: {interview.result}</Typography>
                        </Box>
                      )}

                      {interview.notes && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2">{interview.notes}</Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {candidate.interviews.length === 0 && (
                  <Typography color="text.secondary">Нет данных о собеседованиях</Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined">Запланировать собеседование</Button>
                </Box>
              </Stack>
            </TabPanel>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CandidateDetails;
