import { useEffect, useState } from 'react';
import { Add, Cancel, Code, Delete, Edit, Save, Star, StarBorder } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Rating,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

// Типы данных для навыков
interface Skill {
  id: string;
  name: string;
  level: number; // от 1 до 5
  yearsOfExperience: number;
  description?: string;
  category: string;
}

// Начальное пустое значение для нового навыка
const emptySkill: Omit<Skill, 'id'> = {
  name: '',
  level: 3,
  yearsOfExperience: 0,
  description: '',
  category: 'hard',
};

// Категории навыков
const skillCategories = [
  { value: 'hard', label: 'Технические навыки' },
  { value: 'soft', label: 'Гибкие навыки' },
  { value: 'language', label: 'Языки' },
  { value: 'other', label: 'Другое' },
];

// Популярные технические навыки для строителей и инженеров
const popularTechnicalSkills = [
  'AutoCAD',
  'Revit',
  'SCAD',
  'Lira',
  'ArchiCAD',
  'Tekla Structures',
  'КОМПАС-3D',
  'nanoCAD',
  'Renga',
  'BIM',
  'SketchUp',
  'Rhino',
  'Проектирование ЖБК',
  'Проектирование МК',
  'Сметное дело',
  'Расчет конструкций',
  'MS Office',
  'MS Project',
  'AutodeskNavisworks',
  'JavaScript',
  'Python',
  'C++',
  'C#',
  'Java',
];

// Популярные гибкие навыки
const popularSoftSkills = [
  'Работа в команде',
  'Управление проектами',
  'Коммуникативность',
  'Аналитическое мышление',
  'Лидерство',
  'Организационные навыки',
  'Решение проблем',
  'Управление временем',
  'Адаптивность',
  'Критическое мышление',
  'Клиентоориентированность',
];

// Популярные языки
const popularLanguages = [
  'Английский',
  'Немецкий',
  'Французский',
  'Китайский',
  'Испанский',
  'Итальянский',
  'Японский',
  'Арабский',
  'Португальский',
  'Корейский',
];

function CandidateProfileSkills() {
  const theme = useTheme();

  // Состояния для диалоговых окон
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Состояние для редактируемого навыка
  const [currentSkill, setCurrentSkill] = useState<Omit<Skill, 'id'>>(emptySkill);
  const [currentSkillId, setCurrentSkillId] = useState<string | null>(null);

  // Состояние для фильтрации навыков
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Временные данные о навыках, в реальном приложении будут загружаться с сервера
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      name: 'AutoCAD',
      level: 5,
      yearsOfExperience: 4,
      description: 'Проектирование чертежей, схем, разрезов. Опыт работы в 2D и 3D.',
      category: 'hard',
    },
    {
      id: '2',
      name: 'Revit',
      level: 4,
      yearsOfExperience: 2,
      description: 'BIM-моделирование, создание информационных моделей зданий.',
      category: 'hard',
    },
    {
      id: '3',
      name: 'Английский язык',
      level: 4,
      yearsOfExperience: 10,
      description:
        'Свободное чтение технической документации, уверенное общение на профессиональные темы.',
      category: 'language',
    },
    {
      id: '4',
      name: 'Управление проектами',
      level: 3,
      yearsOfExperience: 2,
      description: 'Координация команды проектировщиков, соблюдение сроков, управление ресурсами.',
      category: 'soft',
    },
    {
      id: '5',
      name: 'Расчет строительных конструкций',
      level: 5,
      yearsOfExperience: 3,
      description: 'Расчет надежности, прочности, устойчивости конструктивных элементов.',
      category: 'hard',
    },
  ]);

  // Отфильтрованные навыки
  const filteredSkills =
    filterCategory === 'all' ? skills : skills.filter(skill => skill.category === filterCategory);

  // Сортировка навыков по уровню владения (по убыванию)
  useEffect(() => {
    setSkills(prevSkills => [...prevSkills].sort((a, b) => b.level - a.level));
  }, []);

  // Получение популярных навыков в зависимости от категории
  const getPopularSkillsByCategory = (category: string): string[] => {
    switch (category) {
      case 'hard':
        return popularTechnicalSkills;
      case 'soft':
        return popularSoftSkills;
      case 'language':
        return popularLanguages;
      default:
        return [];
    }
  };

  // Обработчики для диалога добавления/редактирования
  const handleOpenAddDialog = () => {
    setCurrentSkill(emptySkill);
    setCurrentSkillId(null);
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (skill: Skill) => {
    setCurrentSkill({
      name: skill.name,
      level: skill.level,
      yearsOfExperience: skill.yearsOfExperience,
      description: skill.description || '',
      category: skill.category,
    });
    setCurrentSkillId(skill.id);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setCurrentSkill(emptySkill);
    setCurrentSkillId(null);
  };

  // Обработчики для диалога удаления
  const handleOpenDeleteDialog = (id: string) => {
    setCurrentSkillId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentSkillId(null);
  };

  // Обработчики изменения полей формы
  const handleFieldChange = (field: keyof typeof currentSkill, value: any) => {
    setCurrentSkill(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Обработчик сохранения формы
  const handleSaveSkill = () => {
    // Валидация формы
    if (!currentSkill.name) {
      alert('Пожалуйста, введите название навыка');
      return;
    }

    if (openAddDialog) {
      // Добавление нового навыка
      const newId = Date.now().toString(); // Простая генерация ID
      setSkills(prev => [
        ...prev,
        {
          id: newId,
          ...currentSkill,
        },
      ]);
    } else if (openEditDialog && currentSkillId) {
      // Редактирование существующего навыка
      setSkills(prev =>
        prev.map(skill => (skill.id === currentSkillId ? { id: skill.id, ...currentSkill } : skill))
      );
    }

    handleCloseDialog();
  };

  // Обработчик удаления навыка
  const handleDeleteSkill = () => {
    if (currentSkillId) {
      setSkills(prev => prev.filter(skill => skill.id !== currentSkillId));
      handleCloseDeleteDialog();
    }
  };

  // Получение цвета для уровня навыка
  const getLevelColor = (level: number) => {
    if (level >= 4.5) return theme.palette.success.main;
    if (level >= 3.5) return theme.palette.primary.main;
    if (level >= 2.5) return theme.palette.info.main;
    if (level >= 1.5) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  // Получение текстового описания уровня навыка
  const getLevelText = (level: number): string => {
    if (level >= 4.5) return 'Эксперт';
    if (level >= 3.5) return 'Продвинутый';
    if (level >= 2.5) return 'Средний';
    if (level >= 1.5) return 'Начальный';
    return 'Новичок';
  };

  // Отображение длительности опыта
  const formatExperienceYears = (years: number): string => {
    if (years === 0) return 'Менее года';
    return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`;
  };

  // Получение названия категории
  const getCategoryName = (category: string): string => {
    const found = skillCategories.find(cat => cat.value === category);
    return found ? found.label : 'Другое';
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Навыки</Typography>
        <Button variant="contained" startIcon={<Add />} size="small" onClick={handleOpenAddDialog}>
          Добавить навык
        </Button>
      </Box>

      {/* Фильтр по категориям */}
      <Box sx={{ mb: 3 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="skill-category-filter-label">Категория</InputLabel>
          <Select
            labelId="skill-category-filter-label"
            value={filterCategory}
            label="Категория"
            onChange={e => setFilterCategory(e.target.value)}
          >
            <MenuItem value="all">Все категории</MenuItem>
            {skillCategories.map(category => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {filteredSkills.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            {filterCategory === 'all'
              ? 'У вас пока нет добавленных навыков. Нажмите "Добавить навык" чтобы начать.'
              : 'Нет навыков в выбранной категории.'}
          </Typography>
        </Paper>
      ) : (
        <Box>
          {filteredSkills.map(skill => (
            <Card
              key={skill.id}
              sx={{
                mb: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Code color="primary" sx={{ mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                        {skill.name}
                      </Typography>
                      <Chip label={getCategoryName(skill.category)} size="small" sx={{ mb: 1 }} />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenEditDialog(skill)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(skill.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      Уровень владения:{' '}
                      <span style={{ color: getLevelColor(skill.level) }}>
                        {getLevelText(skill.level)}
                      </span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Опыт: {formatExperienceYears(skill.yearsOfExperience)}
                    </Typography>
                  </Box>
                  <Rating
                    value={skill.level}
                    readOnly
                    precision={0.5}
                    icon={<Star fontSize="inherit" sx={{ color: getLevelColor(skill.level) }} />}
                    emptyIcon={<StarBorder fontSize="inherit" />}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={skill.level * 20} // 5 -> 100%
                    sx={{
                      height: 6,
                      mt: 0.5,
                      borderRadius: 1,
                      bgcolor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getLevelColor(skill.level),
                      },
                    }}
                  />
                </Box>

                {skill.description && (
                  <Typography variant="body2" color="textSecondary">
                    {skill.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Диалог добавления/редактирования навыка */}
      <Dialog
        open={openAddDialog || openEditDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{openAddDialog ? 'Добавить навык' : 'Редактировать навык'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1, mx: -1 }}>
            <Box sx={{ width: '100%', px: 1, mb: 2 }}>
              <TextField
                label="Название навыка"
                fullWidth
                required
                value={currentSkill.name}
                onChange={e => handleFieldChange('name', e.target.value)}
              />
            </Box>

            <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }}>
              <FormControl fullWidth required>
                <InputLabel id="skill-category-label">Категория</InputLabel>
                <Select
                  labelId="skill-category-label"
                  value={currentSkill.category}
                  label="Категория"
                  onChange={e => handleFieldChange('category', e.target.value)}
                >
                  {skillCategories.map(category => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }}>
              <TextField
                label="Лет опыта"
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 0, max: 50 } }}
                value={currentSkill.yearsOfExperience}
                onChange={e =>
                  handleFieldChange('yearsOfExperience', parseInt(e.target.value, 10) || 0)
                }
              />
            </Box>

            <Box sx={{ width: '100%', px: 1, mb: 2 }}>
              <Typography gutterBottom>Уровень владения</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  value={currentSkill.level}
                  onChange={(_, newValue) => {
                    if (newValue !== null) {
                      handleFieldChange('level', newValue);
                    }
                  }}
                  precision={1}
                  size="large"
                  icon={<Star fontSize="inherit" />}
                  emptyIcon={<StarBorder fontSize="inherit" />}
                />
                <Typography sx={{ ml: 2 }} color={getLevelColor(currentSkill.level)}>
                  {getLevelText(currentSkill.level)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: '100%', px: 1, mb: 2 }}>
              <TextField
                label="Описание (необязательно)"
                fullWidth
                multiline
                rows={3}
                value={currentSkill.description}
                onChange={e => handleFieldChange('description', e.target.value)}
                placeholder="Опишите ваш опыт с этим навыком, особенности применения, достижения и т.д."
              />
            </Box>

            {/* Популярные навыки для выбранной категории */}
            {currentSkill.category &&
              getPopularSkillsByCategory(currentSkill.category).length > 0 &&
              !currentSkill.name && (
                <Box sx={{ width: '100%', px: 1, mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Популярные {getCategoryName(currentSkill.category).toLowerCase()}:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {getPopularSkillsByCategory(currentSkill.category)
                      .filter(
                        name => !skills.some(s => s.name.toLowerCase() === name.toLowerCase())
                      )
                      .map(name => (
                        <Chip
                          key={name}
                          label={name}
                          onClick={() => handleFieldChange('name', name)}
                          sx={{ margin: '2px' }}
                        />
                      ))}
                  </Box>
                </Box>
              )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<Cancel />}>
            Отмена
          </Button>
          <Button
            onClick={handleSaveSkill}
            variant="contained"
            color="primary"
            startIcon={<Save />}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Удалить навык?</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить этот навык? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Отмена</Button>
          <Button onClick={handleDeleteSkill} variant="contained" color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CandidateProfileSkills;
