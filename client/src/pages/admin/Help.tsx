import { useState } from 'react';
import {
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Computer as ComputerIcon,
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  QuestionAnswer as QuestionAnswerIcon,
  School as SchoolIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';

// Интерфейс для FAQ
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'account' | 'tests' | 'profile' | 'system';
}

// Интерфейс для вкладок
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Компонент панели вкладки
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`help-tabpanel-${index}`}
      aria-labelledby={`help-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `help-tab-${index}`,
    'aria-controls': `help-tabpanel-${index}`,
  };
}

// Список FAQ
const faqItems: FAQ[] = [
  {
    id: '1',
    question: 'Как изменить данные профиля?',
    answer:
      'Для изменения данных профиля перейдите в раздел "Мой профиль". Здесь вы можете обновить личную информацию, опыт работы, образование и навыки, используя соответствующие вкладки меню.',
    category: 'profile',
  },
  {
    id: '2',
    question: 'Как начать тестирование?',
    answer:
      'Для начала тестирования перейдите в раздел "Доступные тесты". Выберите интересующий вас тест и нажмите кнопку "Начать тест". Внимательно прочитайте инструкции перед началом.',
    category: 'tests',
  },
  {
    id: '3',
    question: 'Как просмотреть результаты пройденных тестов?',
    answer:
      'Результаты пройденных тестов доступны в разделе "История тестов". Здесь вы найдете информацию о дате прохождения, набранных баллах и правильных ответах для каждого теста.',
    category: 'tests',
  },
  {
    id: '4',
    question: 'Как изменить пароль?',
    answer:
      'Для изменения пароля перейдите в раздел "Настройки", выберите вкладку "Безопасность". Введите текущий пароль, а затем новый пароль и его подтверждение.',
    category: 'account',
  },
  {
    id: '5',
    question: 'Что делать, если я забыл пароль?',
    answer:
      'Если вы забыли пароль, на странице входа нажмите ссылку "Забыли пароль?". Следуйте инструкциям для восстановления доступа. На указанный email будет отправлена ссылка для сброса пароля.',
    category: 'account',
  },
  {
    id: '6',
    question: 'Как настроить уведомления?',
    answer:
      'Для настройки уведомлений перейдите в раздел "Настройки", выберите вкладку "Уведомления". Здесь вы можете включить или отключить различные типы уведомлений, в том числе email-уведомления.',
    category: 'system',
  },
  {
    id: '7',
    question: 'Могу ли я пройти тест повторно?',
    answer:
      'Возможность повторного прохождения теста зависит от настроек конкретного теста. Если повторное прохождение разрешено, вы увидите соответствующую кнопку в разделе "История тестов" рядом с пройденным тестом.',
    category: 'tests',
  },
  {
    id: '8',
    question: 'Как связаться с поддержкой?',
    answer:
      'Вы можете связаться с поддержкой, используя форму обратной связи в разделе "Помощь" или отправив письмо на адрес support@nngp.ru. Также доступна горячая линия поддержки: +7 (800) 123-45-67.',
    category: 'system',
  },
  {
    id: '9',
    question: 'Как посмотреть и обновить мои навыки?',
    answer:
      'Для просмотра и обновления навыков перейдите в раздел "Мой профиль", а затем выберите вкладку "Навыки". Здесь вы можете добавить новые навыки или удалить существующие.',
    category: 'profile',
  },
  {
    id: '10',
    question: 'Сколько времени дается на прохождение теста?',
    answer:
      'Время прохождения зависит от конкретного теста. Обычно оно указано в описании теста перед началом прохождения. Во время теста отображается таймер с оставшимся временем.',
    category: 'tests',
  },
];

// Инструкции для различных разделов
const instructions = [
  {
    title: 'Профиль',
    description: 'Как заполнить и обновить информацию профиля',
    icon: <ComputerIcon />,
    steps: [
      'Перейдите в раздел "Мой профиль"',
      'Выберите нужную вкладку (Основная информация, Опыт, Образование, Навыки)',
      'Заполните соответствующие поля формы',
      'Нажмите кнопку "Сохранить"',
    ],
  },
  {
    title: 'Тестирование',
    description: 'Как проходить тесты и просматривать результаты',
    icon: <AssignmentTurnedInIcon />,
    steps: [
      'Перейдите в раздел "Доступные тесты"',
      'Выберите тест и нажмите "Начать"',
      'Ответьте на все вопросы и нажмите "Завершить"',
      'Просмотрите результаты в разделе "История тестов"',
    ],
  },
  {
    title: 'Обучение',
    description: 'Как использовать обучающие материалы',
    icon: <SchoolIcon />,
    steps: [
      'Перейдите в раздел "Учебные материалы"',
      'Выберите интересующую категорию',
      'Изучите материалы или пройдите курс',
      'Отметьте материалы как изученные',
    ],
  },
  {
    title: 'Настройки',
    description: 'Как изменить настройки аккаунта',
    icon: <BookmarkBorderIcon />,
    steps: [
      'Перейдите в раздел "Настройки"',
      'Выберите нужную вкладку (Основные, Безопасность, Уведомления)',
      'Внесите необходимые изменения',
      'Нажмите кнопку "Сохранить"',
    ],
  },
];

const Help = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Получаем данные пользователя из Redux store
  const user = useAppSelector(state => state.auth.user);

  // Состояние для вкладок
  const [tabValue, setTabValue] = useState(0);

  // Состояние для поиска
  const [searchQuery, setSearchQuery] = useState('');

  // Состояние для активных фильтров категорий FAQ
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  // Обработчик изменения вкладки
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Обработчик изменения поиска
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Обработчик фильтрации по категории
  const handleCategoryFilter = (category: string) => {
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter(cat => cat !== category));
    } else {
      setActiveCategories([...activeCategories, category]);
    }
  };

  // Фильтрация FAQ на основе поискового запроса и активных категорий
  const filteredFAQs = faqItems.filter(faq => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategories.length === 0 || activeCategories.includes(faq.category);

    return matchesSearch && matchesCategory;
  });

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
          <HelpIcon
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
            Помощь и поддержка
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />

        {/* Вкладки помощи */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? 'fullWidth' : 'standard'}
            aria-label="разделы помощи"
          >
            <Tab
              icon={<QuestionAnswerIcon />}
              iconPosition="start"
              label={isMobile ? '' : 'Часто задаваемые вопросы'}
              {...a11yProps(0)}
            />
            <Tab
              icon={<ComputerIcon />}
              iconPosition="start"
              label={isMobile ? '' : 'Инструкции'}
              {...a11yProps(1)}
            />
            <Tab
              icon={<MailIcon />}
              iconPosition="start"
              label={isMobile ? '' : 'Контакты'}
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>

        {/* Панель FAQ */}
        <TabPanel value={tabValue} index={0}>
          <TextField
            fullWidth
            label="Поиск по вопросам"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="subtitle2" sx={{ alignSelf: 'center', mr: 1 }}>
              Фильтр по категориям:
            </Typography>
            <Chip
              label="Аккаунт"
              clickable
              color={activeCategories.includes('account') ? 'primary' : 'default'}
              onClick={() => handleCategoryFilter('account')}
            />
            <Chip
              label="Тесты"
              clickable
              color={activeCategories.includes('tests') ? 'primary' : 'default'}
              onClick={() => handleCategoryFilter('tests')}
            />
            <Chip
              label="Профиль"
              clickable
              color={activeCategories.includes('profile') ? 'primary' : 'default'}
              onClick={() => handleCategoryFilter('profile')}
            />
            <Chip
              label="Система"
              clickable
              color={activeCategories.includes('system') ? 'primary' : 'default'}
              onClick={() => handleCategoryFilter('system')}
            />
          </Box>

          {filteredFAQs.length > 0 ? (
            filteredFAQs.map(faq => (
              <Accordion key={faq.id} sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${faq.id}-content`}
                  id={`panel${faq.id}-header`}
                >
                  <Typography fontWeight="medium">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="subtitle1" color="text.secondary">
                По вашему запросу ничего не найдено
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Попробуйте изменить поисковый запрос или сбросить фильтры
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategories([]);
                }}
              >
                Сбросить фильтры
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* Панель инструкций */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {instructions.map((instruction, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardHeader
                    avatar={
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: 'primary.lighter',
                          color: 'primary.main',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {instruction.icon}
                      </Box>
                    }
                    title={instruction.title}
                    subheader={instruction.description}
                  />
                  <Divider />
                  <CardContent>
                    <List dense sx={{ pl: 1 }}>
                      {instruction.steps.map((step, stepIndex) => (
                        <ListItem key={stepIndex} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                              }}
                            >
                              {stepIndex + 1}
                            </Box>
                          </ListItemIcon>
                          <ListItemText primary={step} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Панель контактов */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Служба поддержки" />
                <Divider />
                <CardContent>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <MailIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Email поддержки"
                        secondary={
                          <Link href="mailto:support@nngp.ru" color="primary">
                            support@nngp.ru
                          </Link>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Телефон горячей линии"
                        secondary={
                          <Link href="tel:+78001234567" color="primary">
                            +7 (800) 123-45-67
                          </Link>
                        }
                      />
                    </ListItem>
                  </List>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Время работы: Пн-Пт с 9:00 до 18:00 (МСК)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader title="Обратная связь" />
                <Divider />
                <CardContent>
                  <Typography variant="body1" paragraph>
                    Если у вас есть предложения по улучшению системы или вопросы, которые не
                    освещены в разделе FAQ, пожалуйста, заполните форму обратной связи.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<MailIcon />}
                    href="mailto:feedback@nngp.ru?subject=Обратная%20связь%20от%20кандидата"
                    sx={{ mt: 1 }}
                  >
                    Написать в поддержку
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default Help;
