import { useEffect, useState } from 'react';
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LearningMaterial,
  LearningMaterialDifficulty,
  LearningMaterialStatus,
  LearningMaterialType,
  mockLearningMaterials,
} from '../../../types/learning-material';

// Моковые данные для выпадающих списков
const departments = [
  'Конструкторский отдел',
  'Технический отдел',
  'BIM-отдел',
  'Финансовый отдел',
  'Отдел проектирования',
  'Управление проектами',
];

const positions = [
  'Инженер-конструктор',
  'Ведущий инженер',
  'Архитектор',
  'Руководитель проекта',
  'BIM-координатор',
  'Инженер-проектировщик',
  'Сметчик',
];

// Генерация уникального ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const LearningMaterialForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isEditMode = !!id;

  // Состояние формы
  const [formData, setFormData] = useState<Partial<LearningMaterial>>({
    title: '',
    description: '',
    type: 'article' as LearningMaterialType,
    difficulty: 'beginner' as LearningMaterialDifficulty,
    status: 'draft' as LearningMaterialStatus,
    department: '',
    position: '',
    author: 'Текущий пользователь', // В реальном приложении здесь будет имя текущего пользователя
    authorId: '1', // В реальном приложении здесь будет ID текущего пользователя
    url: '',
    durationMinutes: 0,
    tags: [],
    isMandatory: false,
  });

  // Состояние для обработки новых тегов
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      // В реальном приложении здесь будет API запрос
      const foundMaterial = mockLearningMaterials.find(m => m.id === id);
      if (foundMaterial) {
        setFormData(foundMaterial);
      }
    }
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setFormData(prev => ({ ...prev, [name]: numValue }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToDelete) || [],
    }));
  };

  const handleNewTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = 'Название обязательно';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Описание обязательно';
    }

    if (!formData.type) {
      newErrors.type = 'Выберите тип материала';
    }

    if (!formData.difficulty) {
      newErrors.difficulty = 'Выберите уровень сложности';
    }

    if (!formData.status) {
      newErrors.status = 'Выберите статус';
    }

    if (formData.type === 'course' || formData.type === 'video') {
      if (!formData.durationMinutes || formData.durationMinutes <= 0) {
        newErrors.durationMinutes = 'Укажите длительность';
      }
    }

    if (!formData.url?.trim()) {
      newErrors.url = 'URL материала обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Подготавливаем данные для отправки
    const dataToSubmit: LearningMaterial = {
      ...(formData as LearningMaterial),
      id: isEditMode ? id! : generateId(),
      createdAt: isEditMode ? formData.createdAt! : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: isEditMode ? formData.viewCount! : 0,
      rating: isEditMode ? formData.rating! : 0,
    };

    // В реальном приложении здесь будет API запрос
    console.log('Submitting form data:', dataToSubmit);

    // Возвращаемся к списку материалов
    navigate('/app/hr/learning');
  };

  const handleCancel = () => {
    navigate('/app/hr/learning');
  };

  return (
    <Container maxWidth="lg" sx={{ my: { xs: 2, sm: 4 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleCancel}
        sx={{ mb: 2, display: { xs: 'none', sm: 'flex' } }}
      >
        Вернуться к списку
      </Button>

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Мобильная кнопка назад */}
        <Box sx={{ display: { xs: 'flex', sm: 'none' }, mb: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={handleCancel}>
            Назад
          </Button>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Редактирование материала' : 'Создание нового материала'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {/* Основная информация */}
              <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Основная информация
                </Typography>

                <Stack spacing={3}>
                  <TextField
                    label="Название"
                    name="title"
                    value={formData.title || ''}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!errors.title}
                    helperText={errors.title}
                  />

                  <TextField
                    label="Описание"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                    required
                    error={!!errors.description}
                    helperText={errors.description}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth required error={!!errors.type}>
                        <InputLabel id="type-label">Тип материала</InputLabel>
                        <Select
                          labelId="type-label"
                          name="type"
                          value={formData.type || ''}
                          label="Тип материала"
                          onChange={handleSelectChange}
                        >
                          <MenuItem value="article">Статья</MenuItem>
                          <MenuItem value="video">Видео</MenuItem>
                          <MenuItem value="document">Документ</MenuItem>
                          <MenuItem value="presentation">Презентация</MenuItem>
                          <MenuItem value="course">Курс</MenuItem>
                        </Select>
                        {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth required error={!!errors.difficulty}>
                        <InputLabel id="difficulty-label">Уровень сложности</InputLabel>
                        <Select
                          labelId="difficulty-label"
                          name="difficulty"
                          value={formData.difficulty || ''}
                          label="Уровень сложности"
                          onChange={handleSelectChange}
                        >
                          <MenuItem value="beginner">Начальный</MenuItem>
                          <MenuItem value="intermediate">Средний</MenuItem>
                          <MenuItem value="advanced">Продвинутый</MenuItem>
                          <MenuItem value="expert">Экспертный</MenuItem>
                        </Select>
                        {errors.difficulty && <FormHelperText>{errors.difficulty}</FormHelperText>}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth required error={!!errors.status}>
                        <InputLabel id="status-label">Статус</InputLabel>
                        <Select
                          labelId="status-label"
                          name="status"
                          value={formData.status || ''}
                          label="Статус"
                          onChange={handleSelectChange}
                        >
                          <MenuItem value="draft">Черновик</MenuItem>
                          <MenuItem value="active">Активный</MenuItem>
                          <MenuItem value="archived">Архивный</MenuItem>
                        </Select>
                        {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                      </FormControl>
                    </Grid>
                  </Grid>

                  <TextField
                    label="URL материала"
                    name="url"
                    value={formData.url || ''}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!errors.url}
                    helperText={errors.url}
                    placeholder="https://example.com/material"
                  />

                  <TextField
                    label="Длительность (в минутах)"
                    name="durationMinutes"
                    type="number"
                    value={formData.durationMinutes || ''}
                    onChange={handleNumberInputChange}
                    fullWidth
                    InputProps={{
                      endAdornment: <InputAdornment position="end">мин</InputAdornment>,
                    }}
                    error={!!errors.durationMinutes}
                    helperText={errors.durationMinutes}
                  />

                  {/* Теги */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Теги
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {formData.tags?.map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          onDelete={() => handleDeleteTag(tag)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        label="Добавить тег"
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onKeyPress={handleNewTagKeyPress}
                        size="small"
                        fullWidth
                      />
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                      >
                        Добавить
                      </Button>
                    </Box>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              {/* Целевая аудитория */}
              <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Целевая аудитория
                </Typography>

                <Stack spacing={3}>
                  <FormControl fullWidth>
                    <InputLabel id="department-label">Отдел</InputLabel>
                    <Select
                      labelId="department-label"
                      name="department"
                      value={formData.department || ''}
                      label="Отдел"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="">Все отделы</MenuItem>
                      {departments.map(dept => (
                        <MenuItem key={dept} value={dept}>
                          {dept}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      Оставьте пустым, если материал предназначен для всех отделов
                    </FormHelperText>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="position-label">Должность</InputLabel>
                    <Select
                      labelId="position-label"
                      name="position"
                      value={formData.position || ''}
                      label="Должность"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="">Все должности</MenuItem>
                      {positions.map(pos => (
                        <MenuItem key={pos} value={pos}>
                          {pos}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      Оставьте пустым, если материал предназначен для всех должностей
                    </FormHelperText>
                  </FormControl>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.isMandatory || false}
                        onChange={handleCheckboxChange}
                        name="isMandatory"
                      />
                    }
                    label="Обязательный материал"
                  />
                </Stack>
              </Card>

              {/* Информация об авторе */}
              <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Автор
                </Typography>
                <Typography>{formData.author}</Typography>
                {isEditMode && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Создан: {new Date(formData.createdAt || '').toLocaleDateString('ru-RU')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Обновлен: {new Date(formData.updatedAt || '').toLocaleDateString('ru-RU')}
                      </Typography>
                    </Box>
                  </>
                )}
              </Card>

              {/* Кнопки формы */}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" fullWidth onClick={handleCancel}>
                  Отмена
                </Button>
                <Button variant="contained" fullWidth type="submit">
                  {isEditMode ? 'Сохранить' : 'Создать'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default LearningMaterialForm;
