import React, { useEffect, useState } from 'react';
import {
  ArrowBack as ArrowBackIcon,
  AssignmentTurnedIn as AssignmentIcon,
  Book as BookIcon,
  CalendarMonth as CalendarMonthIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  EmojiEvents as EmojiEventsIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Rating,
  Stack,
  SwipeableDrawer,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../../../features/employees/employeesHooks';

// Компонент детальной страницы сотрудника
const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();

  // Медиа-запросы для адаптивности
  const isXSmall = useMediaQuery('(max-width:320px)');
  const isVerySmall = useMediaQuery('(max-width:375px)');
  const isSmall = useMediaQuery('(max-width:480px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Состояния для inline-редактирования
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedNotes, setEditedNotes] = useState('');
  const [newSkill, setNewSkill] = useState('');

  // Состояние для мобильного меню действий
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  // Состояния для форм добавления
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddCertification, setShowAddCertification] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddEvaluation, setShowAddEvaluation] = useState(false);
  const [showAddTraining, setShowAddTraining] = useState(false);

  // Состояние для диалога удаления сотрудника
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Redux hooks - получаем все функции для управления данными
  const {
    selectedEmployee,
    isLoadingDetails,
    isDeleting,
    detailsError,
    loadEmployee,
    clearSelectedEmployee,
    updateEmployeeWithDetails,
    deleteEmployeeById,
    addEmployeeNote,
    updateEmployeeNote,
    deleteEmployeeNote,
    addEmployeeEvaluation,
    updateEmployeeEvaluation,
    deleteEmployeeEvaluation,
    addEmployeeTraining,
    updateEmployeeTraining,
    deleteEmployeeTraining,
  } = useEmployees();

  // Обработчик изменения вкладки
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Загрузка данных сотрудника
  useEffect(() => {
    if (id) {
      loadEmployee(id);
    }

    // Очищаем данные при размонтировании компонента
    return () => {
      clearSelectedEmployee();
    };
  }, [id, loadEmployee, clearSelectedEmployee]);

  // Обработчик возврата к списку сотрудников
  const handleBack = () => {
    navigate('/app/hr/employees');
  };

  // Обработчик перехода к редактированию
  const handleEdit = () => {
    // Перенаправление на страницу редактирования сотрудника
    navigate(`/app/hr/employees/${id}/edit`);
  };

  // Обработчик удаления сотрудника
  const handleDeleteEmployee = async () => {
    if (!id) return;

    try {
      await deleteEmployeeById(id);
      setShowDeleteDialog(false);
      // Перенаправляем на список сотрудников после успешного удаления
      navigate('/app/hr/employees');
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error);
      // Можно добавить уведомление об ошибке
    }
  };

  // Обработчики для звонка и email на мобильных
  const handlePhoneCall = (phone: string) => {
    if (phone) {
      window.location.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
    }
  };

  const handleEmailSend = (email: string) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: isMobile ? '2-digit' : 'numeric',
    });
  };

  // Определение цвета для статуса
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'работает':
        return 'success';
      case 'отпуск':
        return 'info';
      case 'больничный':
        return 'warning';
      case 'удаленная работа':
        return 'secondary';
      case 'командировка':
        return 'primary';
      case 'уволен':
        return 'error';
      default:
        return 'default';
    }
  };

  // Функции для управления навыками
  const handleAddSkill = async () => {
    if (!newSkill.trim() || !selectedEmployee || !id) return;

    const updatedEmployee = {
      ...selectedEmployee,
      skills: [...(selectedEmployee.skills || []), newSkill.trim()],
    };

    try {
      await updateEmployeeWithDetails(updatedEmployee);
      setNewSkill('');
    } catch (error) {
      console.error('Ошибка при добавлении навыка:', error);
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    if (!selectedEmployee || !id) return;

    const updatedEmployee = {
      ...selectedEmployee,
      skills: (selectedEmployee.skills || []).filter(skill => skill !== skillToRemove),
    };

    try {
      await updateEmployeeWithDetails(updatedEmployee);
    } catch (error) {
      console.error('Ошибка при удалении навыка:', error);
    }
  };

  // Функции для управления заметками
  const handleAddNote = async () => {
    if (!editedNotes.trim() || !id) return;

    try {
      await addEmployeeNote(id, editedNotes.trim(), 'Текущий пользователь');
      setEditedNotes('');
    } catch (error) {
      console.error('Ошибка при добавлении заметки:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!id) return;

    try {
      await deleteEmployeeNote(id, noteId);
    } catch (error) {
      console.error('Ошибка при удалении заметки:', error);
    }
  };

  // Функции для управления образованием
  const handleDeleteEducation = async (educationId: string) => {
    if (!selectedEmployee || !id) return;

    const updatedEmployee = {
      ...selectedEmployee,
      education: selectedEmployee.education.filter(edu => edu.id !== educationId),
    };

    try {
      await updateEmployeeWithDetails(updatedEmployee);
    } catch (error) {
      console.error('Ошибка при удалении образования:', error);
    }
  };

  // Функции для управления опытом работы
  const handleDeleteExperience = async (experienceId: string) => {
    if (!selectedEmployee || !id) return;

    const updatedEmployee = {
      ...selectedEmployee,
      workExperience: selectedEmployee.workExperience.filter(exp => exp.id !== experienceId),
    };

    try {
      await updateEmployeeWithDetails(updatedEmployee);
    } catch (error) {
      console.error('Ошибка при удалении опыта работы:', error);
    }
  };

  // Функции для управления сертификатами
  const handleDeleteCertification = async (certificationId: string) => {
    if (!selectedEmployee || !id) return;

    const updatedEmployee = {
      ...selectedEmployee,
      certifications: selectedEmployee.certifications.filter(cert => cert.id !== certificationId),
    };

    try {
      await updateEmployeeWithDetails(updatedEmployee);
    } catch (error) {
      console.error('Ошибка при удалении сертификата:', error);
    }
  };

  // Функции для управления проектами
  const handleDeleteProject = async (projectId: string) => {
    if (!selectedEmployee || !id) return;

    const updatedEmployee = {
      ...selectedEmployee,
      projects: selectedEmployee.projects.filter(project => project.id !== projectId),
    };

    try {
      await updateEmployeeWithDetails(updatedEmployee);
    } catch (error) {
      console.error('Ошибка при удалении проекта:', error);
    }
  };

  // Рендерим основной контент
  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: { xs: 1, sm: 2, md: 3 },
        mb: { xs: 7, sm: 3 }, // Увеличиваем нижний отступ на мобильных для FAB
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {isLoadingDetails ? (
        <Box sx={{ width: '100%', mt: 4, textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Загрузка данных сотрудника...</Typography>
        </Box>
      ) : detailsError ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Ошибка при загрузке данных: {detailsError}
        </Alert>
      ) : selectedEmployee ? (
        <>
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2, md: 3 },
              borderRadius: { xs: 1, sm: 2 },
              mb: { xs: 2, sm: 3 },
              boxShadow: { xs: 1, sm: 2 },
            }}
          >
            {/* Верхняя панель с кнопкой возврата */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: { xs: 1.5, sm: 2 },
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  py: { xs: 0.5, sm: 0.75 },
                }}
              >
                {isMobile ? 'Назад' : 'К списку сотрудников'}
              </Button>

              {/* Кнопки действий для десктопа */}
              {!isMobile && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Удалить
                  </Button>
                </Box>
              )}
            </Box>

            {/* Основная информация о сотруднике */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
                gap: { xs: 2, sm: 3 },
                mb: { xs: 2, sm: 3 },
              }}
            >
              {/* Аватар */}
              <Avatar
                src={selectedEmployee.avatar || undefined}
                sx={{
                  width: { xs: 100, sm: 120, md: 140 },
                  height: { xs: 100, sm: 120, md: 140 },
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  fontWeight: 'bold',
                  boxShadow: theme.shadows[3],
                  border: `3px solid ${theme.palette.background.paper}`,
                }}
              >
                {!selectedEmployee.avatar && (selectedEmployee.name?.charAt(0) || '?')}
              </Avatar>

              {/* Основная информация */}
              <Box
                sx={{
                  flex: 1,
                  textAlign: { xs: 'center', sm: 'left' },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                    fontWeight: 'bold',
                    mb: { xs: 0.5, sm: 1 },
                  }}
                >
                  {selectedEmployee.name}
                </Typography>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                    mb: { xs: 1, sm: 1.5 },
                  }}
                >
                  {selectedEmployee.position}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    gap: { xs: 1, sm: 2 },
                    mb: { xs: 1, sm: 1.5 },
                  }}
                >
                  <Chip
                    label={selectedEmployee.status || 'Статус не указан'}
                    color={getStatusColor(selectedEmployee.status || '') as any}
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      fontWeight: 'medium',
                    }}
                  />
                  <Chip
                    label={selectedEmployee.department || 'Отдел не указан'}
                    variant="outlined"
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    }}
                  />
                </Box>

                {/* Контактная информация с кликабельными элементами на мобильных */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'center', sm: 'flex-start' },
                    gap: 1,
                    mt: { xs: 1, sm: 1.5 },
                  }}
                >
                  {selectedEmployee.email && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        cursor: isMobile ? 'pointer' : 'default',
                      }}
                      onClick={isMobile ? () => handleEmailSend(selectedEmployee.email) : undefined}
                    >
                      <EmailIcon fontSize="small" color="action" />
                      <Typography variant="body2">{selectedEmployee.email}</Typography>
                    </Box>
                  )}

                  {selectedEmployee.phone && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        cursor: isMobile ? 'pointer' : 'default',
                      }}
                      onClick={isMobile ? () => handlePhoneCall(selectedEmployee.phone) : undefined}
                    >
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">{selectedEmployee.phone}</Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Вкладки с информацией */}
          <Box sx={{ mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons={isMobile ? 'auto' : false}
              allowScrollButtonsMobile
              sx={{
                '& .MuiTab-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  minWidth: { xs: 'auto', sm: 120 },
                  px: { xs: 1.5, sm: 2 },
                },
              }}
            >
              <Tab
                label={isMobile ? 'Инфо' : 'Информация'}
                icon={isMobile ? <PersonIcon /> : undefined}
                iconPosition="start"
              />
              <Tab
                label={isMobile ? 'Опыт' : 'Опыт работы'}
                icon={isMobile ? <WorkIcon /> : undefined}
                iconPosition="start"
              />
              <Tab
                label={isMobile ? 'Обр.' : 'Образование'}
                icon={isMobile ? <SchoolIcon /> : undefined}
                iconPosition="start"
              />
              <Tab
                label={isMobile ? 'Серт.' : 'Сертификаты'}
                icon={isMobile ? <EmojiEventsIcon /> : undefined}
                iconPosition="start"
              />
              <Tab
                label={isMobile ? 'Проекты' : 'Проекты'}
                icon={isMobile ? <AssignmentIcon /> : undefined}
                iconPosition="start"
              />
              <Tab
                label={isMobile ? 'Оценки' : 'Оценки'}
                icon={isMobile ? <DescriptionIcon /> : undefined}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Содержимое вкладок */}
          <Paper
            sx={{
              p: { xs: 1.5, sm: 2, md: 3 },
              borderRadius: { xs: 1, sm: 2 },
              boxShadow: { xs: 1, sm: 2 },
            }}
          >
            {/* Основная информация */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Профиль сотрудника
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                          Персональная информация
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Дата рождения
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(selectedEmployee.birthDate || '')}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Департамент
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.department || 'Не указан'}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Должность
                          </Typography>
                          <Typography variant="body1">
                            {selectedEmployee.position || 'Не указана'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={8}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography variant="h6" component="div">
                            Навыки
                          </Typography>
                        </Box>

                        {/* Существующие навыки */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          {(selectedEmployee.skills || []).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              onDelete={() => handleRemoveSkill(skill)}
                              color="primary"
                              variant="outlined"
                              size={isMobile ? 'small' : 'medium'}
                            />
                          ))}
                          {(selectedEmployee.skills || []).length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                              Навыки не указаны
                            </Typography>
                          )}
                        </Box>

                        {/* Форма добавления нового навыка */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <TextField
                            size="small"
                            placeholder="Добавить навык"
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleAddSkill()}
                            sx={{ flexGrow: 1 }}
                          />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleAddSkill}
                            disabled={!newSkill.trim()}
                          >
                            Добавить
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Опыт работы */}
            {activeTab === 1 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Опыт работы</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowAddExperience(!showAddExperience)}
                  >
                    {showAddExperience ? 'Отменить' : 'Добавить опыт работы'}
                  </Button>
                </Box>

                {selectedEmployee.workExperience && selectedEmployee.workExperience.length > 0 ? (
                  <Stack spacing={2}>
                    {selectedEmployee.workExperience.map(exp => (
                      <Card key={exp.id} variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" component="div" gutterBottom>
                                {exp.company}
                              </Typography>
                              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                {exp.position} •{' '}
                                {exp.period ||
                                  `${formatDate(exp.startDate || '')} - ${exp.endDate ? formatDate(exp.endDate) : 'По настоящее время'}`}
                              </Typography>
                              <Typography variant="body2">{exp.description}</Typography>
                            </Box>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteExperience(exp.id)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Alert severity="info">Информация об опыте работы отсутствует</Alert>
                )}
              </Box>
            )}

            {/* Образование */}
            {activeTab === 2 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Образование</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowAddEducation(!showAddEducation)}
                  >
                    {showAddEducation ? 'Отменить' : 'Добавить образование'}
                  </Button>
                </Box>

                {selectedEmployee.education && selectedEmployee.education.length > 0 ? (
                  <Stack spacing={2}>
                    {selectedEmployee.education.map(edu => (
                      <Card key={edu.id} variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" component="div" gutterBottom>
                                {edu.university || edu.institution}
                              </Typography>
                              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                {edu.degree} • {edu.specialty || edu.fieldOfStudy} •{' '}
                                {edu.year ||
                                  `${formatDate(edu.startDate || '')} - ${edu.endDate ? formatDate(edu.endDate) : 'По настоящее время'}`}
                              </Typography>
                              <Typography variant="body2">{edu.description}</Typography>
                            </Box>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteEducation(edu.id)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Alert severity="info">Информация об образовании отсутствует</Alert>
                )}
              </Box>
            )}

            {/* Сертификаты */}
            {activeTab === 3 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Сертификаты</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowAddCertification(!showAddCertification)}
                  >
                    {showAddCertification ? 'Отменить' : 'Добавить сертификат'}
                  </Button>
                </Box>

                {selectedEmployee.certifications && selectedEmployee.certifications.length > 0 ? (
                  <Grid container spacing={2}>
                    {selectedEmployee.certifications.map(cert => (
                      <Grid item xs={12} sm={6} md={4} key={cert.id}>
                        <Card variant="outlined" sx={{ height: '100%', position: 'relative' }}>
                          <CardContent>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteCertification(cert.id)}
                              sx={{ position: 'absolute', top: 8, right: 8 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                            <Typography variant="h6" component="div" gutterBottom sx={{ pr: 4 }}>
                              {cert.title}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Выдан: {cert.issuer}
                            </Typography>
                            <Box sx={{ mb: 1 }}>
                              <Chip
                                size="small"
                                label={`Получен: ${formatDate(cert.date || '')}`}
                                sx={{ mr: 1, mb: 1 }}
                              />
                              <Chip
                                size="small"
                                label={`Действует до: ${formatDate(cert.validUntil || '')}`}
                                sx={{ mb: 1 }}
                              />
                            </Box>
                            <Typography variant="body2">{cert.description}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info">Информация о сертификатах отсутствует</Alert>
                )}
              </Box>
            )}

            {/* Проекты */}
            {activeTab === 4 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Проекты</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowAddProject(!showAddProject)}
                  >
                    {showAddProject ? 'Отменить' : 'Добавить проект'}
                  </Button>
                </Box>

                {selectedEmployee.projects && selectedEmployee.projects.length > 0 ? (
                  <Stack spacing={2}>
                    {selectedEmployee.projects.map(project => (
                      <Card key={project.id} variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" component="div" gutterBottom>
                                {project.name || project.title}
                              </Typography>
                              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                {project.role && `${project.role} • `}
                                {project.period ||
                                  `${formatDate(project.startDate || '')} - ${project.endDate ? formatDate(project.endDate) : 'По настоящее время'}`}
                              </Typography>
                              <Typography variant="body2">{project.description}</Typography>
                            </Box>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteProject(project.id)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Alert severity="info">Информация о проектах отсутствует</Alert>
                )}
              </Box>
            )}

            {/* Оценки */}
            {activeTab === 5 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Оценки</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setShowAddEvaluation(!showAddEvaluation)}
                  >
                    {showAddEvaluation ? 'Отменить' : 'Добавить оценку'}
                  </Button>
                </Box>

                {selectedEmployee.evaluations && selectedEmployee.evaluations.length > 0 ? (
                  <Stack spacing={2}>
                    {selectedEmployee.evaluations.map(evaluation => (
                      <Card key={evaluation.id} variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Box sx={{ flexGrow: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" component="div">
                                  {evaluation.title}
                                </Typography>
                                <Chip
                                  label={`Оценка: ${evaluation.rating}/5`}
                                  color={evaluation.rating >= 4.5 ? 'success' : 'primary'}
                                  size={isMobile ? 'small' : 'medium'}
                                />
                              </Box>
                              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Дата: {formatDate(evaluation.date || '')} • Оценил:{' '}
                                {evaluation.evaluator}
                              </Typography>
                              <Typography variant="body2">{evaluation.description}</Typography>
                            </Box>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteEmployeeEvaluation(id!, evaluation.id)}
                              sx={{ ml: 1 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Alert severity="info">Информация об оценках отсутствует</Alert>
                )}
              </Box>
            )}
          </Paper>

          {/* Мобильное меню действий (FAB) */}
          {isMobile && (
            <>
              <Fab
                color="primary"
                sx={{
                  position: 'fixed',
                  bottom: 16,
                  right: 16,
                  zIndex: 1000,
                }}
                onClick={() => setMobileActionsOpen(true)}
              >
                <EditIcon />
              </Fab>

              <SwipeableDrawer
                anchor="bottom"
                open={mobileActionsOpen}
                onClose={() => setMobileActionsOpen(false)}
                onOpen={() => setMobileActionsOpen(true)}
                disableSwipeToOpen
                PaperProps={{
                  sx: {
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    px: 2,
                    py: 2,
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 2, textAlign: 'center' }}
                >
                  Действия
                </Typography>
                <Stack spacing={1.5}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => {
                      handleEdit();
                      setMobileActionsOpen(false);
                    }}
                  >
                    Редактировать профиль
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      setShowDeleteDialog(true);
                      setMobileActionsOpen(false);
                    }}
                  >
                    Удалить сотрудника
                  </Button>

                  {selectedEmployee.phone && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<PhoneIcon />}
                      onClick={() => {
                        handlePhoneCall(selectedEmployee.phone);
                        setMobileActionsOpen(false);
                      }}
                    >
                      Позвонить
                    </Button>
                  )}

                  {selectedEmployee.email && (
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<EmailIcon />}
                      onClick={() => {
                        handleEmailSend(selectedEmployee.email);
                        setMobileActionsOpen(false);
                      }}
                    >
                      Написать
                    </Button>
                  )}

                  <Button fullWidth variant="text" onClick={() => setMobileActionsOpen(false)}>
                    Отмена
                  </Button>
                </Stack>
              </SwipeableDrawer>
            </>
          )}

          {/* Диалог подтверждения удаления */}
          <Dialog
            open={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>Удаление сотрудника</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Вы действительно хотите удалить сотрудника {selectedEmployee.name}? Это действие
                нельзя отменить.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeleteDialog(false)}>Отмена</Button>
              <Button
                color="error"
                onClick={handleDeleteEmployee}
                disabled={isDeleting}
                startIcon={isDeleting && <CircularProgress size={16} />}
              >
                {isDeleting ? 'Удаление...' : 'Удалить'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          Сотрудник не найден или данные еще не загружены.
        </Alert>
      )}
    </Container>
  );
};

export default EmployeeDetails;
