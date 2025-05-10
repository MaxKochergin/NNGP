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

// Тестовые данные для редактирования сотрудника
const mockEmployeeDetails = {
  id: '1',
  name: 'Иванов Иван Иванович',
  position: 'Ведущий инженер-конструктор',
  department: 'Конструкторский отдел',
  experience: '5 лет',
  status: 'Работает',
  hireDate: '2025-04-15',
  skills: [
    'AutoCAD',
    'Revit',
    'ЛИРА-САПР',
    'Железобетонные конструкции',
    'Нормативная документация',
  ],
  email: 'ivanov@example.com',
  phone: '+7 (999) 123-45-67',
  salary: '180000',
  location: 'Москва',
  birthDate: '1990-05-15',
  education: [
    {
      id: '1',
      degree: 'Магистр',
      specialty: 'Промышленное и гражданское строительство',
      university: 'Московский государственный строительный университет',
      year: '2015',
      description: 'Специализация: проектирование железобетонных конструкций. Диплом с отличием.',
    },
  ],
  workExperience: [
    {
      id: '1',
      company: 'ООО "СтройПроект"',
      position: 'Инженер-конструктор 1 категории',
      period: '2020-2025',
      description:
        'Проектирование железобетонных конструкций многоквартирных жилых домов. Расчет конструкций в ЛИРА-САПР. Разработка рабочей документации.',
    },
  ],
};

// Пустые данные для нового сотрудника
const emptyEmployee = {
  id: '',
  name: '',
  position: '',
  department: '',
  experience: '',
  status: 'Работает',
  hireDate: new Date().toISOString().split('T')[0],
  skills: [],
  email: '',
  phone: '',
  salary: '',
  location: '',
  birthDate: '',
  education: [],
  workExperience: [],
};

// Доступные статусы сотрудников
const statuses = ['Работает', 'В отпуске', 'На больничном', 'Уволен'];

// Доступные должности
const positions = [
  'Инженер-конструктор',
  'Ведущий инженер-конструктор',
  'Главный инженер-конструктор',
  'Инженер-проектировщик',
  'Ведущий инженер-проектировщик',
  'Главный инженер-проектировщик',
  'Инженер-проектировщик ОВиК',
  'Архитектор',
  'Главный архитектор',
  'BIM-координатор',
  'BIM-менеджер',
  'Руководитель проекта',
];

// Доступные отделы
const departments = [
  'Конструкторский отдел',
  'Проектный отдел',
  'Архитектурный отдел',
  'BIM-отдел',
  'Отдел инженерных систем',
  'Управление проектами',
  'Административный отдел',
];

interface Education {
  id: string;
  degree: string;
  specialty: string;
  university: string;
  year: string;
  description: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
}

interface EmployeeFormData {
  id: string;
  name: string;
  position: string;
  department: string;
  experience: string;
  status: string;
  hireDate: string;
  skills: string[];
  email: string;
  phone: string;
  salary: string;
  location: string;
  birthDate: string;
  education: Education[];
  workExperience: WorkExperience[];
}

const EmployeeForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewEmployee = !id || id === 'new';

  const [employee, setEmployee] = useState<EmployeeFormData>(
    isNewEmployee ? emptyEmployee : mockEmployeeDetails
  );
  const [loading, setLoading] = useState(!isNewEmployee);
  const [saving, setSaving] = useState(false);
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

  // Загрузка данных сотрудника при редактировании
  useEffect(() => {
    if (!isNewEmployee) {
      setLoading(true);
      // Имитация запроса к API
      setTimeout(() => {
        setEmployee(mockEmployeeDetails);
        setLoading(false);
      }, 1000);
    }
  }, [id, isNewEmployee]);

  // Обработчики изменения полей формы
  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEmployee({
        ...employee,
        [field]: e.target.value,
      });
    };

  const handleStatusChange = (e: any) => {
    setEmployee({
      ...employee,
      status: e.target.value,
    });
  };

  const handleDepartmentChange = (e: any) => {
    setEmployee({
      ...employee,
      department: e.target.value,
    });
  };

  // Обработчик добавления навыка
  const handleAddSkill = () => {
    if (newSkill && !employee.skills.includes(newSkill)) {
      setEmployee({
        ...employee,
        skills: [...employee.skills, newSkill],
      });
      setNewSkill('');
    }
  };

  // Обработчик удаления навыка
  const handleRemoveSkill = (skillToRemove: string) => {
    setEmployee({
      ...employee,
      skills: employee.skills.filter(skill => skill !== skillToRemove),
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
      const education = {
        id: Date.now().toString(),
        ...newEducation,
      };

      setEmployee({
        ...employee,
        education: [...employee.education, education],
      });

      // Сброс формы образования
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
    setEmployee({
      ...employee,
      education: employee.education.filter(edu => edu.id !== id),
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
      const experience = {
        id: Date.now().toString(),
        ...newWorkExperience,
      };

      setEmployee({
        ...employee,
        workExperience: [...employee.workExperience, experience],
      });

      // Сброс формы опыта работы
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
    setEmployee({
      ...employee,
      workExperience: employee.workExperience.filter(exp => exp.id !== id),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Валидация обязательных полей
    if (!employee.name || !employee.position || !employee.department) {
      setError('Пожалуйста, заполните все обязательные поля');
      setSaving(false);
      return;
    }

    // Имитация отправки данных на сервер
    setTimeout(() => {
      console.log('Сохраняемые данные:', employee);
      setSaving(false);
      setSuccess(true);

      // Перенаправление на страницу сотрудника после успешного сохранения
      setTimeout(() => {
        navigate(`/app/hr/employees/${employee.id || 'new'}`);
      }, 1500);
    }, 1500);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 0, sm: 1 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleCancel} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" component="h1">
            {isNewEmployee ? 'Добавление нового сотрудника' : 'Редактирование данных сотрудника'}
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <Typography>Загрузка данных...</Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Основные данные */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Основные данные
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="ФИО"
                  value={employee.name}
                  onChange={handleChange('name')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Должность</InputLabel>
                  <Select
                    value={employee.position}
                    onChange={handleChange('position')}
                    label="Должность"
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
                <FormControl fullWidth required>
                  <InputLabel>Отдел</InputLabel>
                  <Select
                    value={employee.department}
                    onChange={handleDepartmentChange}
                    label="Отдел"
                  >
                    {departments.map(dept => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Статус</InputLabel>
                  <Select value={employee.status} onChange={handleStatusChange} label="Статус">
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
                  fullWidth
                  label="Опыт работы"
                  value={employee.experience}
                  onChange={handleChange('experience')}
                  placeholder="Например: 5 лет"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Дата приема на работу"
                  value={employee.hireDate}
                  onChange={handleChange('hireDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={employee.email}
                  onChange={handleChange('email')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Телефон"
                  value={employee.phone}
                  onChange={handleChange('phone')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Заработная плата"
                  value={employee.salary}
                  onChange={handleChange('salary')}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">руб.</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Город"
                  value={employee.location}
                  onChange={handleChange('location')}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Дата рождения"
                  value={employee.birthDate}
                  onChange={handleChange('birthDate')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Навыки */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Навыки и компетенции
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Добавить навык"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleAddSkill()}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddSkill}
                    disabled={!newSkill}
                    sx={{ ml: 1 }}
                  >
                    <AddIcon />
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {employee.skills.map(skill => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              {/* Образование */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="h6" gutterBottom>
                    Образование
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setShowEducationForm(!showEducationForm)}
                  >
                    {showEducationForm ? 'Отменить' : 'Добавить образование'}
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {showEducationForm && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="Уровень образования"
                            value={newEducation.degree}
                            onChange={handleEducationChange('degree')}
                            placeholder="Например: Бакалавр, Магистр, Специалист"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="Учебное заведение"
                            value={newEducation.university}
                            onChange={handleEducationChange('university')}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Специальность"
                            value={newEducation.specialty}
                            onChange={handleEducationChange('specialty')}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Год окончания"
                            value={newEducation.year}
                            onChange={handleEducationChange('year')}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Дополнительная информация"
                            value={newEducation.description}
                            onChange={handleEducationChange('description')}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'right' }}>
                          <Button
                            variant="contained"
                            onClick={handleAddEducation}
                            disabled={!newEducation.degree || !newEducation.university}
                          >
                            Добавить
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12}>
                {employee.education.length === 0 ? (
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Нет данных об образовании
                  </Typography>
                ) : (
                  employee.education.map(edu => (
                    <Card key={edu.id} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {edu.degree}, {edu.year}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveEducation(edu.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body1">{edu.university}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {edu.specialty}
                        </Typography>
                        {edu.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {edu.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </Grid>

              {/* Опыт работы */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography variant="h6" gutterBottom>
                    Опыт работы
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setShowWorkExperienceForm(!showWorkExperienceForm)}
                  >
                    {showWorkExperienceForm ? 'Отменить' : 'Добавить опыт работы'}
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              {showWorkExperienceForm && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="Компания"
                            value={newWorkExperience.company}
                            onChange={handleWorkExperienceChange('company')}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            required
                            label="Должность"
                            value={newWorkExperience.position}
                            onChange={handleWorkExperienceChange('position')}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Период работы"
                            value={newWorkExperience.period}
                            onChange={handleWorkExperienceChange('period')}
                            placeholder="Например: 2019-2023"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Обязанности и достижения"
                            value={newWorkExperience.description}
                            onChange={handleWorkExperienceChange('description')}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'right' }}>
                          <Button
                            variant="contained"
                            onClick={handleAddWorkExperience}
                            disabled={!newWorkExperience.company || !newWorkExperience.position}
                          >
                            Добавить
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              <Grid item xs={12}>
                {employee.workExperience.length === 0 ? (
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Нет данных об опыте работы
                  </Typography>
                ) : (
                  employee.workExperience.map(exp => (
                    <Card key={exp.id} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {exp.position}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveWorkExperience(exp.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body1">{exp.company}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {exp.period}
                        </Typography>
                        {exp.description && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {exp.description}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </Grid>

              {/* Кнопки действий */}
              <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" onClick={handleCancel}>
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        {/* Сообщения об ошибках и успешном сохранении */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Данные сотрудника успешно сохранены
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default EmployeeForm;
