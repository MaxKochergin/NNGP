import { useEffect, useState } from 'react';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCandidateDetails,
  useCandidateNotes,
} from '../../../features/candidates/candidatesHooks';

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
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const CandidateDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Redux hooks
  const {
    selectedCandidate: candidate,
    isLoadingDetails: loading,
    detailsError: error,
    isDeleting,
    loadCandidate,
    clearSelectedCandidate,
    updateStatus,
    deleteCandidateById,
  } = useCandidateDetails();

  const { addCandidateNote } = useCandidateNotes();

  // Локальное состояние
  const [tabValue, setTabValue] = useState(0);
  const [newNote, setNewNote] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Загружаем кандидата при монтировании компонента
  useEffect(() => {
    if (id) {
      loadCandidate(id);
    }

    // Очищаем выбранного кандидата при размонтировании
    return () => {
      clearSelectedCandidate();
    };
  }, [id, loadCandidate, clearSelectedCandidate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBack = () => {
    navigate('/app/hr/candidates');
  };

  const handleEdit = () => {
    navigate(`/app/hr/candidates/${id}/edit`);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (id) {
      try {
        await deleteCandidateById(id);
        setDeleteDialogOpen(false);
        // Перенаправляем на список кандидатов после успешного удаления
        navigate('/app/hr/candidates');
      } catch (error) {
        console.error('Ошибка при удалении кандидата:', error);
        // Здесь можно добавить уведомление об ошибке
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleAddNote = () => {
    if (newNote.trim() && id) {
      addCandidateNote(id, newNote.trim(), 'HR Специалист');
      setNewNote('');
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (id) {
      updateStatus(id, newStatus);
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
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

  // Если кандидат не найден
  if (!candidate) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Alert severity="warning">Кандидат не найден</Alert>
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <IconButton onClick={handleBack} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem' },
                fontWeight: 'bold',
                color: 'primary.main',
              }}
            >
              Профиль кандидата
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={isDeleting}
              color="error"
              size={isMobile ? 'medium' : 'large'}
              sx={{ flex: { xs: 1, sm: 'none' } }}
            >
              {isDeleting ? <CircularProgress size={20} /> : 'Удалить'}
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              size={isMobile ? 'medium' : 'large'}
              sx={{ flex: { xs: 1, sm: 'none' } }}
            >
              Редактировать
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Основная информация */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3, height: 'fit-content' }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={candidate.avatar || undefined}
                    sx={{
                      width: { xs: 100, sm: 120 },
                      height: { xs: 100, sm: 120 },
                      mb: 2,
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    {!candidate.avatar && getInitials(candidate.name)}
                  </Avatar>
                  <Typography
                    variant="h5"
                    component="div"
                    align="center"
                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                  >
                    {candidate.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    align="center"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
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
                    {candidate.email && (
                      <Typography
                        variant="body2"
                        sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                      >
                        <EmailIcon sx={{ mr: 1, fontSize: '1rem' }} />
                        {candidate.email}
                      </Typography>
                    )}
                    {candidate.phone && (
                      <Typography
                        variant="body2"
                        sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                      >
                        <PhoneIcon sx={{ mr: 1, fontSize: '1rem' }} />
                        {candidate.phone}
                      </Typography>
                    )}
                    {candidate.location && (
                      <Typography
                        variant="body2"
                        sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                      >
                        <LocationIcon sx={{ mr: 1, fontSize: '1rem' }} />
                        {candidate.location}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Основная информация
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                      <WorkIcon sx={{ mr: 1, fontSize: '1rem' }} />
                      Опыт: {candidate.experience}
                    </Typography>
                    {candidate.salary && (
                      <Typography
                        variant="body2"
                        sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                      >
                        <MoneyIcon sx={{ mr: 1, fontSize: '1rem' }} />
                        {candidate.salary}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                    >
                      <CalendarIcon sx={{ mr: 1, fontSize: '1rem' }} />
                      Активность: {formatDate(candidate.lastActivity)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Навыки
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {candidate.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {candidate.resumeUrl && (
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      fullWidth
                      onClick={() => window.open(candidate.resumeUrl, '_blank')}
                    >
                      Скачать резюме
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab label="Образование" />
                <Tab label="Опыт работы" />
                <Tab label="Интервью" />
                <Tab label="Заметки" />
              </Tabs>
            </Box>

            {/* Вкладка "Образование" */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Образование
              </Typography>
              {candidate.education && candidate.education.length > 0 ? (
                <Stack spacing={2}>
                  {candidate.education.map(edu => (
                    <Card key={edu.id} variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {edu.degree} - {edu.specialty}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                          {edu.university} • {edu.year}
                        </Typography>
                        {edu.description && (
                          <Typography variant="body2">{edu.description}</Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">Информация об образовании не указана</Typography>
              )}
            </TabPanel>

            {/* Вкладка "Опыт работы" */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Опыт работы
              </Typography>
              {candidate.workExperience && candidate.workExperience.length > 0 ? (
                <Stack spacing={2}>
                  {candidate.workExperience.map(work => (
                    <Card key={work.id} variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="div">
                          {work.position}
                        </Typography>
                        <Typography color="text.secondary" gutterBottom>
                          {work.company} • {work.period}
                        </Typography>
                        <Typography variant="body2">{work.description}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  Информация об опыте работы не указана
                </Typography>
              )}
            </TabPanel>

            {/* Вкладка "Интервью" */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                История интервью
              </Typography>
              {candidate.interviews && candidate.interviews.length > 0 ? (
                <Stack spacing={2}>
                  {candidate.interviews.map(interview => (
                    <Card key={interview.id} variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1,
                          }}
                        >
                          <Typography variant="h6" component="div">
                            {interview.type}
                          </Typography>
                          <Chip
                            label={interview.status}
                            color={
                              interview.status === 'Пройдено'
                                ? 'success'
                                : interview.status === 'Запланировано'
                                  ? 'warning'
                                  : 'default'
                            }
                            size="small"
                          />
                        </Box>
                        <Typography color="text.secondary" gutterBottom>
                          {formatDate(interview.date)} • {interview.interviewer}
                        </Typography>
                        {interview.feedback && (
                          <Typography variant="body2">
                            <strong>Обратная связь:</strong> {interview.feedback}
                          </Typography>
                        )}
                        {interview.rating && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              Оценка:
                            </Typography>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                sx={{
                                  color: i < interview.rating! ? 'warning.main' : 'action.disabled',
                                  fontSize: '1rem',
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">Интервью еще не проводились</Typography>
              )}
            </TabPanel>

            {/* Вкладка "Заметки" */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" gutterBottom>
                Заметки
              </Typography>

              {/* Форма добавления заметки */}
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Добавить заметку
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Введите заметку о кандидате..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                  >
                    Добавить заметку
                  </Button>
                </CardContent>
              </Card>

              {/* Список заметок */}
              {candidate.notes && candidate.notes.length > 0 ? (
                <Stack spacing={2}>
                  {candidate.notes.map(note => (
                    <Card key={note.id} variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle2" color="text.secondary">
                            {note.author}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(note.date)}
                          </Typography>
                        </Box>
                        <Typography variant="body2">{note.text}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">Заметок пока нет</Typography>
              )}
            </TabPanel>
          </Grid>
        </Grid>
      </Paper>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Вы уверены, что хотите удалить кандидата <strong>{candidate?.name}</strong>? Это
            действие нельзя отменить. Все данные кандидата, включая заметки и интервью, будут
            удалены.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            Отмена
          </Button>
          <Button
            onClick={handleDeleteConfirm}
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

export default CandidateDetails;
