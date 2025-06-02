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
  EmojiEvents as EmojiEventsIcon,
  EventNote as EventNoteIcon,
  Person as PersonIcon,
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
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Rating,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../../../features/employees/employeesHooks';

// Компонент детальной страницы сотрудника
const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState(0);

  // Состояния для inline-редактирования
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedNotes, setEditedNotes] = useState('');
  const [newSkill, setNewSkill] = useState('');

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

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Определение цвета для статуса
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
      skills: [...selectedEmployee.skills, newSkill.trim()],
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
      skills: selectedEmployee.skills.filter(skill => skill !== skillToRemove),
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

  // Если данные загружаются, показываем индикатор загрузки
  if (isLoadingDetails) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress sx={{ mt: 3, mb: 3 }} />
          <Typography>Загрузка данных сотрудника...</Typography>
        </Paper>
      </Container>
    );
  }

  // Если сотрудник не найден или произошла ошибка, показываем сообщение об ошибке
  if (detailsError || (!isLoadingDetails && !selectedEmployee)) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Alert severity="error">{detailsError || 'Сотрудник не найден'}</Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
            Вернуться к списку
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      {/* Верхняя панель с информацией и действиями */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar
            src={selectedEmployee.avatar || undefined}
            sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}
          >
            {!selectedEmployee.avatar && <PersonIcon sx={{ fontSize: 40 }} />}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {selectedEmployee.name}
              <Chip
                label={selectedEmployee.status}
                color={getStatusColor(selectedEmployee.status)}
                size="small"
                sx={{ ml: 2, verticalAlign: 'middle' }}
              />
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {selectedEmployee.position} • {selectedEmployee.department}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Chip
                icon={<CalendarMonthIcon fontSize="small" />}
                label={`Дата приёма: ${formatDate(selectedEmployee.hireDate)}`}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<WorkIcon fontSize="small" />}
                label={`Опыт: ${selectedEmployee.experience}`}
                variant="outlined"
                size="small"
              />
            </Stack>
          </Box>
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit} sx={{ ml: 2 }}>
            Редактировать
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setShowDeleteDialog(true)}
            sx={{ ml: 1 }}
          >
            Удалить
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{selectedEmployee.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="body2" color="text.secondary">
              Телефон
            </Typography>
            <Typography variant="body1">{selectedEmployee.phone}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="body2" color="text.secondary">
              Зарплата
            </Typography>
            <Typography variant="body1">{selectedEmployee.salary}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="body2" color="text.secondary">
              Местоположение
            </Typography>
            <Typography variant="body1">{selectedEmployee.location}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Вкладки с дополнительной информацией */}
      <Paper sx={{ p: 0, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Основная информация" />
          <Tab icon={<SchoolIcon />} label="Образование" />
          <Tab icon={<WorkIcon />} label="Опыт работы" />
          <Tab icon={<EmojiEventsIcon />} label="Сертификаты" />
          <Tab icon={<AssignmentIcon />} label="Проекты" />
          <Tab icon={<DescriptionIcon />} label="Оценки" />
          <Tab icon={<EventNoteIcon />} label="Заметки" />
          <Tab icon={<BookIcon />} label="Обучение" />
        </Tabs>

        <Box sx={{ p: 3 }}>
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
                          {formatDate(selectedEmployee.birthDate)}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Департамент
                        </Typography>
                        <Typography variant="body1">{selectedEmployee.department}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Должность
                        </Typography>
                        <Typography variant="body1">{selectedEmployee.position}</Typography>
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
                        {selectedEmployee.skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            onDelete={() => handleRemoveSkill(skill)}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
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

          {/* Образование */}
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
                <Typography variant="h6">Образование</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAddEducation(!showAddEducation)}
                >
                  {showAddEducation ? 'Отменить' : 'Добавить образование'}
                </Button>
              </Box>

              {selectedEmployee.education.length > 0 ? (
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
                              {edu.university}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                              {edu.degree} • {edu.specialty} • {edu.year} г.
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

          {/* Опыт работы */}
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
                <Typography variant="h6">Опыт работы</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAddExperience(!showAddExperience)}
                >
                  {showAddExperience ? 'Отменить' : 'Добавить опыт работы'}
                </Button>
              </Box>

              {selectedEmployee.workExperience.length > 0 ? (
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
                              {exp.position} • {exp.period}
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

              {selectedEmployee.certifications.length > 0 ? (
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
                              label={`Получен: ${formatDate(cert.date)}`}
                              sx={{ mr: 1, mb: 1 }}
                            />
                            <Chip
                              size="small"
                              label={`Действует до: ${formatDate(cert.validUntil)}`}
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

              {selectedEmployee.projects.length > 0 ? (
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
                              {project.name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                              {project.role} • {project.period}
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

              {selectedEmployee.evaluations.length > 0 ? (
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
                              />
                            </Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Дата: {formatDate(evaluation.date)} • Оценил: {evaluation.evaluator}
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

          {/* Заметки */}
          {activeTab === 6 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Заметки
              </Typography>
              {selectedEmployee.notes.length > 0 ? (
                <Stack spacing={2} sx={{ mb: 3 }}>
                  {selectedEmployee.notes.map(note => (
                    <Card key={note.id} variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              {formatDate(note.date)} • {note.author}
                            </Typography>
                            <Typography variant="body1">{note.text}</Typography>
                          </Box>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteNote(note.id)}
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
                <Alert severity="info" sx={{ mb: 3 }}>
                  Заметки отсутствуют
                </Alert>
              )}

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Добавить заметку
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Введите текст заметки..."
                  value={editedNotes}
                  onChange={e => setEditedNotes(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" disabled={!editedNotes.trim()} onClick={handleAddNote}>
                  Сохранить заметку
                </Button>
              </Box>
            </Box>
          )}

          {/* Обучение */}
          {activeTab === 7 && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Обучение</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAddTraining(!showAddTraining)}
                >
                  {showAddTraining ? 'Отменить' : 'Добавить обучение'}
                </Button>
              </Box>

              {selectedEmployee.training.length > 0 ? (
                <Grid container spacing={2}>
                  {selectedEmployee.training.map(train => (
                    <Grid item xs={12} sm={6} md={4} key={train.id}>
                      <Card variant="outlined" sx={{ height: '100%', position: 'relative' }}>
                        <CardContent>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => deleteEmployeeTraining(id!, train.id)}
                            sx={{ position: 'absolute', top: 8, right: 8 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <Typography variant="h6" component="div" gutterBottom sx={{ pr: 4 }}>
                            {train.title}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Провайдер: {train.provider}
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            <Chip
                              size="small"
                              label={`Дата: ${formatDate(train.date)}`}
                              sx={{ mr: 1, mb: 1 }}
                            />
                            <Chip
                              size="small"
                              label={`Длительность: ${train.duration}`}
                              sx={{ mb: 1 }}
                            />
                            {train.certificate && (
                              <Chip
                                size="small"
                                icon={<DownloadIcon />}
                                label="Сертификат"
                                color="primary"
                                sx={{ mb: 1, ml: 1 }}
                              />
                            )}
                          </Box>
                          <Typography variant="body2">{train.description}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">Информация об обучении отсутствует</Alert>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* Диалог подтверждения удаления сотрудника */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Вы уверены, что хотите удалить сотрудника <strong>{selectedEmployee?.name}</strong>?
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'error.main' }}>
            Это действие нельзя отменить. Все данные сотрудника будут безвозвратно удалены.
          </DialogContentText>

          {selectedEmployee && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Информация о сотруднике:
              </Typography>
              <Typography variant="body2">
                <strong>Должность:</strong> {selectedEmployee.position}
              </Typography>
              <Typography variant="body2">
                <strong>Отдел:</strong> {selectedEmployee.department}
              </Typography>
              <Typography variant="body2">
                <strong>Дата приема:</strong> {formatDate(selectedEmployee.hireDate)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
            Отмена
          </Button>
          <Button
            onClick={handleDeleteEmployee}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeDetails;
