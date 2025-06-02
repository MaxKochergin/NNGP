import { useEffect, useState } from 'react';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  UploadFile as UploadFileIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCandidateDetails,
  useCandidatesCRUD,
} from '../../../features/candidates/candidatesHooks';
import {
  CandidateDetailed,
  CandidateEducation,
  CandidateWorkExperience,
} from '../../../features/candidates/candidatesSlice';

// Пустые данные для нового кандидата
const emptyCandidate: Omit<CandidateDetailed, 'id'> = {
  name: '',
  position: '',
  experience: '',
  status: 'Новый',
  lastActivity: new Date().toISOString().split('T')[0],
  skills: [],
  avatar: null,
  email: '',
  phone: '',
  resumeUrl: '',
  salary: '',
  location: '',
  education: [],
  workExperience: [],
  notes: [],
  interviews: [],
};

// Доступные статусы кандидатов
const statuses = ['Новый', 'На собеседовании', 'Тестовое задание', 'Принят', 'Отклонен'];

// Доступные должности
const positions = [
  'Инженер-конструктор',
  'Ведущий инженер-конструктор',
  'Инженер-проектировщик',
  'Инженер-проектировщик ОВиК',
  'Архитектор',
  'BIM-координатор',
];

const CandidateForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewCandidate = !id || id === 'new';

  // Redux hooks
  const {
    selectedCandidate,
    isLoadingDetails,
    detailsError,
    loadCandidate,
    clearSelectedCandidate,
  } = useCandidateDetails();

  const { isCreating, isUpdating, createCandidateWithDetails, updateCandidateWithDetails } =
    useCandidatesCRUD();

  // Локальное состояние формы
  const [candidate, setCandidate] = useState<Omit<CandidateDetailed, 'id'>>(emptyCandidate);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  // Временные состояния для образования и опыта работы
  const [newEducation, setNewEducation] = useState({
    degree: '',
    specialty: '',
    university: '',
    year: '',
    description: '',
  });

  const [newWorkExperience, setNewWorkExperience] = useState({
    company: '',
    position: '',
    period: '',
    description: '',
  });

  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showWorkExperienceForm, setShowWorkExperienceForm] = useState(false);

  // Загрузка данных кандидата при редактировании
  useEffect(() => {
    if (!isNewCandidate && id) {
      loadCandidate(id);
    }

    return () => {
      clearSelectedCandidate();
    };
  }, [id, isNewCandidate, loadCandidate, clearSelectedCandidate]);

  // Синхронизация данных из Redux с локальным состоянием
  useEffect(() => {
    if (selectedCandidate && !isNewCandidate) {
      setCandidate({
        name: selectedCandidate.name,
        position: selectedCandidate.position,
        experience: selectedCandidate.experience,
        status: selectedCandidate.status,
        lastActivity: selectedCandidate.lastActivity,
        skills: selectedCandidate.skills,
        avatar: selectedCandidate.avatar,
        email: selectedCandidate.email || '',
        phone: selectedCandidate.phone || '',
        resumeUrl: selectedCandidate.resumeUrl || '',
        salary: selectedCandidate.salary || '',
        location: selectedCandidate.location || '',
        education: selectedCandidate.education || [],
        workExperience: selectedCandidate.workExperience || [],
        notes: selectedCandidate.notes || [],
        interviews: selectedCandidate.interviews || [],
      });
    }
  }, [selectedCandidate, isNewCandidate]);

  // Обработчики изменения полей формы
  const handleChange =
    (field: keyof typeof candidate) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setCandidate({
        ...candidate,
        [field]: e.target.value,
      });
    };

  const handleSelectChange = (field: keyof typeof candidate) => (e: any) => {
    setCandidate({
      ...candidate,
      [field]: e.target.value,
    });
  };

  // Обработчик добавления навыка
  const handleAddSkill = () => {
    if (newSkill && !candidate.skills.includes(newSkill)) {
      setCandidate({
        ...candidate,
        skills: [...candidate.skills, newSkill],
      });
      setNewSkill('');
    }
  };

  // Обработчик удаления навыка
  const handleRemoveSkill = (skillToRemove: string) => {
    setCandidate({
      ...candidate,
      skills: candidate.skills.filter(skill => skill !== skillToRemove),
    });
  };

  // Обработчики для образования
  const handleEducationChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewEducation({
        ...newEducation,
        [field]: e.target.value,
      });
    };

  const handleAddEducation = () => {
    if (newEducation.degree && newEducation.university) {
      const educationItem: CandidateEducation = {
        id: Date.now().toString(),
        ...newEducation,
      };

      setCandidate({
        ...candidate,
        education: [...candidate.education, educationItem],
      });

      // Сброс формы
      setNewEducation({
        degree: '',
        specialty: '',
        university: '',
        year: '',
        description: '',
      });
      setShowEducationForm(false);
    }
  };

  const handleRemoveEducation = (id: string) => {
    setCandidate({
      ...candidate,
      education: candidate.education.filter(edu => edu.id !== id),
    });
  };

  // Обработчики для опыта работы
  const handleWorkExperienceChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setNewWorkExperience({
        ...newWorkExperience,
        [field]: e.target.value,
      });
    };

  const handleAddWorkExperience = () => {
    if (newWorkExperience.company && newWorkExperience.position) {
      const experienceItem: CandidateWorkExperience = {
        id: Date.now().toString(),
        ...newWorkExperience,
      };

      setCandidate({
        ...candidate,
        workExperience: [...candidate.workExperience, experienceItem],
      });

      // Сброс формы
      setNewWorkExperience({
        company: '',
        position: '',
        period: '',
        description: '',
      });
      setShowWorkExperienceForm(false);
    }
  };

  const handleRemoveWorkExperience = (id: string) => {
    setCandidate({
      ...candidate,
      workExperience: candidate.workExperience.filter(exp => exp.id !== id),
    });
  };

  // Обработчик сохранения формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация формы
    if (!candidate.name.trim()) {
      setError('Укажите ФИО кандидата');
      return;
    }

    if (!candidate.position.trim()) {
      setError('Укажите должность кандидата');
      return;
    }

    try {
      if (isNewCandidate) {
        // Создание нового кандидата
        await createCandidateWithDetails(candidate);
      } else {
        // Обновление существующего кандидата
        const updatedCandidate: CandidateDetailed = {
          id: id!,
          ...candidate,
        };
        await updateCandidateWithDetails(updatedCandidate);
      }

      setSuccess(true);

      // Перенаправление после успешного сохранения
      setTimeout(() => {
        navigate('/app/hr/candidates');
      }, 1500);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка при сохранении кандидата');
    }
  };

  // Обработчик отмены и возврата к списку
  const handleCancel = () => {
    navigate('/app/hr/candidates');
  };

  const saving = isCreating || isUpdating;

  // Отображение индикатора загрузки
  if (isLoadingDetails && !isNewCandidate) {
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

  // Отображение ошибки загрузки
  if (detailsError && !isNewCandidate) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Alert severity="error">{detailsError}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={handleCancel} sx={{ mt: 2 }}>
          Вернуться к списку кандидатов
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Заголовок и кнопки */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleCancel} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            {isNewCandidate ? 'Добавление кандидата' : 'Редактирование кандидата'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSubmit}
            disabled={saving}
            sx={{ mr: 1 }}
          >
            {saving ? <CircularProgress size={20} /> : 'Сохранить'}
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Форма кандидата */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Основная информация */}
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Основная информация
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="ФИО кандидата"
                        fullWidth
                        required
                        value={candidate.name}
                        onChange={handleChange('name')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Должность</InputLabel>
                        <Select
                          value={candidate.position}
                          label="Должность"
                          onChange={handleSelectChange('position')}
                        >
                          {positions.map(pos => (
                            <MenuItem key={pos} value={pos}>
                              {pos}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Опыт работы"
                        fullWidth
                        value={candidate.experience}
                        onChange={handleChange('experience')}
                        placeholder="Например: 5 лет"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Статус</InputLabel>
                        <Select
                          value={candidate.status}
                          label="Статус"
                          onChange={handleSelectChange('status')}
                        >
                          {statuses.map(status => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        value={candidate.email}
                        onChange={handleChange('email')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Телефон"
                        fullWidth
                        value={candidate.phone}
                        onChange={handleChange('phone')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Город"
                        fullWidth
                        value={candidate.location}
                        onChange={handleChange('location')}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Зарплатные ожидания"
                        fullWidth
                        value={candidate.salary}
                        onChange={handleChange('salary')}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileIcon />}
                        fullWidth
                      >
                        Загрузить резюме
                        <input type="file" hidden />
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Навыки */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Навыки
                  </Typography>

                  <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Введите навык"
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          handleAddSkill();
                          e.preventDefault();
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddSkill}
                      disabled={!newSkill}
                      sx={{ minWidth: 'auto', px: 2 }}
                    >
                      <AddIcon />
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, minHeight: 32 }}>
                    {candidate.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveSkill(skill)}
                        size="small"
                      />
                    ))}
                    {candidate.skills.length === 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                        Навыки не добавлены
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Образование */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
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
                      startIcon={<AddIcon />}
                      onClick={() => setShowEducationForm(true)}
                      disabled={showEducationForm}
                    >
                      Добавить
                    </Button>
                  </Box>

                  {showEducationForm && (
                    <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Уровень образования"
                            fullWidth
                            required
                            value={newEducation.degree}
                            onChange={handleEducationChange('degree')}
                            placeholder="Например: Магистр"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Специальность"
                            fullWidth
                            value={newEducation.specialty}
                            onChange={handleEducationChange('specialty')}
                          />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <TextField
                            label="Учебное заведение"
                            fullWidth
                            required
                            value={newEducation.university}
                            onChange={handleEducationChange('university')}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Год окончания"
                            fullWidth
                            value={newEducation.year}
                            onChange={handleEducationChange('year')}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Дополнительная информация"
                            fullWidth
                            multiline
                            rows={2}
                            value={newEducation.description}
                            onChange={handleEducationChange('description')}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}
                        >
                          <Button onClick={() => setShowEducationForm(false)}>Отмена</Button>
                          <Button
                            variant="contained"
                            onClick={handleAddEducation}
                            disabled={!newEducation.degree || !newEducation.university}
                          >
                            Добавить
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  <Stack spacing={2}>
                    {candidate.education.map(edu => (
                      <Box
                        key={edu.id}
                        sx={{
                          p: 2,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          position: 'relative',
                        }}
                      >
                        <IconButton
                          size="small"
                          color="error"
                          sx={{ position: 'absolute', top: 5, right: 5 }}
                          onClick={() => handleRemoveEducation(edu.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>

                        <Typography variant="subtitle1">
                          {edu.degree}, {edu.specialty}
                        </Typography>
                        <Typography variant="body2">
                          {edu.university}, {edu.year}
                        </Typography>
                        {edu.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {edu.description}
                          </Typography>
                        )}
                      </Box>
                    ))}
                    {candidate.education.length === 0 && !showEducationForm && (
                      <Typography variant="body2" color="text.secondary">
                        Нет данных об образовании
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              {/* Опыт работы */}
              <Card>
                <CardContent>
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
                      startIcon={<AddIcon />}
                      onClick={() => setShowWorkExperienceForm(true)}
                      disabled={showWorkExperienceForm}
                    >
                      Добавить
                    </Button>
                  </Box>

                  {showWorkExperienceForm && (
                    <Box sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Компания"
                            fullWidth
                            required
                            value={newWorkExperience.company}
                            onChange={handleWorkExperienceChange('company')}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Должность"
                            fullWidth
                            required
                            value={newWorkExperience.position}
                            onChange={handleWorkExperienceChange('position')}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Период работы"
                            fullWidth
                            value={newWorkExperience.period}
                            onChange={handleWorkExperienceChange('period')}
                            placeholder="Например: 2018-2023"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Обязанности и достижения"
                            fullWidth
                            multiline
                            rows={3}
                            value={newWorkExperience.description}
                            onChange={handleWorkExperienceChange('description')}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}
                        >
                          <Button onClick={() => setShowWorkExperienceForm(false)}>Отмена</Button>
                          <Button
                            variant="contained"
                            onClick={handleAddWorkExperience}
                            disabled={!newWorkExperience.company || !newWorkExperience.position}
                          >
                            Добавить
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  )}

                  <Stack spacing={2}>
                    {candidate.workExperience.map(exp => (
                      <Box
                        key={exp.id}
                        sx={{
                          p: 2,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          position: 'relative',
                        }}
                      >
                        <IconButton
                          size="small"
                          color="error"
                          sx={{ position: 'absolute', top: 5, right: 5 }}
                          onClick={() => handleRemoveWorkExperience(exp.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>

                        <Typography variant="subtitle1">
                          {exp.position} в {exp.company}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {exp.period}
                        </Typography>
                        {exp.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {exp.description}
                          </Typography>
                        )}
                      </Box>
                    ))}
                    {candidate.workExperience.length === 0 && !showWorkExperienceForm && (
                      <Typography variant="body2" color="text.secondary">
                        Нет данных об опыте работы
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleCancel} disabled={saving}>
              Отмена
            </Button>
            <Button variant="contained" type="submit" startIcon={<SaveIcon />} disabled={saving}>
              {saving ? <CircularProgress size={20} /> : 'Сохранить'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Уведомление об успешном сохранении */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success">
          Кандидат успешно {isNewCandidate ? 'добавлен' : 'обновлен'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CandidateForm;
