import { useState } from 'react';
import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material';
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
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Rating,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material';

// Типы данных для навыков
interface Skill {
  id: string;
  name: string;
  rating: number;
  category: string;
}

// Категории навыков для HR-специалиста
const categories = [
  'Подбор персонала',
  'Оценка персонала',
  'Адаптация',
  'Обучение',
  'Мотивация',
  'HR-аналитика',
  'Программное обеспечение',
  'Личностные качества',
  'Законодательство',
  'Другое',
];

function HrProfileSkills() {
  // Состояние для навыков
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      name: 'Подбор технических специалистов в строительстве',
      rating: 5,
      category: 'Подбор персонала',
    },
    {
      id: '2',
      name: 'Проведение технических интервью инженеров',
      rating: 5,
      category: 'Оценка персонала',
    },
    {
      id: '3',
      name: 'Оценка инженерных компетенций',
      rating: 5,
      category: 'Оценка персонала',
    },
    {
      id: '4',
      name: 'HeadHunter/Superjob/Хабр Карьера',
      rating: 5,
      category: 'Программное обеспечение',
    },
    {
      id: '5',
      name: 'Программы адаптации для технических специалистов',
      rating: 4,
      category: 'Адаптация',
    },
    {
      id: '6',
      name: 'Трудовое законодательство в строительстве',
      rating: 4,
      category: 'Законодательство',
    },
    {
      id: '7',
      name: 'HR-метрики и KPI',
      rating: 4,
      category: 'HR-аналитика',
    },
    {
      id: '8',
      name: 'Управление командой HR-специалистов',
      rating: 4,
      category: 'Мотивация',
    },
    {
      id: '9',
      name: 'Разработка обучающих программ для инженеров',
      rating: 4,
      category: 'Обучение',
    },
    {
      id: '10',
      name: 'Система грейдов для технических должностей',
      rating: 4,
      category: 'Мотивация',
    },
    {
      id: '11',
      name: 'Работа с конфликтами в техническом коллективе',
      rating: 5,
      category: 'Личностные качества',
    },
    {
      id: '12',
      name: 'Power BI и продвинутый Excel для HR-аналитики',
      rating: 4,
      category: 'Программное обеспечение',
    },
    {
      id: '13',
      name: 'Стратегическое планирование в HR',
      rating: 4,
      category: 'HR-аналитика',
    },
    {
      id: '14',
      name: 'Деловые переговоры',
      rating: 5,
      category: 'Личностные качества',
    },
    {
      id: '15',
      name: 'ATS-системы (Talantix, Huntflow)',
      rating: 4,
      category: 'Программное обеспечение',
    },
    {
      id: '16',
      name: 'Международные стандарты в области HR',
      rating: 3,
      category: 'Законодательство',
    },
    {
      id: '17',
      name: 'Talent management в технических отраслях',
      rating: 4,
      category: 'Обучение',
    },
  ]);

  // Состояния для диалоговых окон и форм
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    rating: 3,
    category: categories[0],
  });
  const [currentSkillId, setCurrentSkillId] = useState<string | null>(null);

  // Обработчики для диалога добавления/редактирования
  const handleOpenAddDialog = () => {
    setCurrentSkill({
      name: '',
      rating: 3,
      category: categories[0],
    });
    setCurrentSkillId(null);
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (skill: Skill) => {
    setCurrentSkill({
      name: skill.name,
      rating: skill.rating,
      category: skill.category,
    });
    setCurrentSkillId(skill.id);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setCurrentSkill({
      name: '',
      rating: 3,
      category: categories[0],
    });
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

  // Обработчики сохранения форм
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

  // Группировка навыков по категориям
  const groupedSkills = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Профессиональные навыки</Typography>
        <Button variant="contained" startIcon={<Add />} size="small" onClick={handleOpenAddDialog}>
          Добавить навык
        </Button>
      </Box>

      {skills.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            У вас пока нет добавленных навыков. Нажмите "Добавить навык" чтобы начать.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <Paper key={category} sx={{ mb: 3, p: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}
              >
                {category}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {categorySkills.map(skill => {
                  return (
                    <Box
                      key={skill.id}
                      sx={{
                        width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 16px)' },
                      }}
                    >
                      <Card
                        variant="outlined"
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <CardContent sx={{ pb: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                              {skill.name}
                            </Typography>
                            <Box>
                              <Button
                                size="small"
                                color="primary"
                                onClick={() => handleOpenEditDialog(skill)}
                                sx={{ minWidth: 'auto', p: 0.5 }}
                              >
                                <Edit fontSize="small" />
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleOpenDeleteDialog(skill.id)}
                                sx={{ minWidth: 'auto', p: 0.5 }}
                              >
                                <Delete fontSize="small" />
                              </Button>
                            </Box>
                          </Box>

                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ mr: 1, minWidth: 60 }}>
                                Уровень:
                              </Typography>
                              <Rating
                                value={skill.rating}
                                readOnly
                                size="small"
                                sx={{ color: 'primary.main' }}
                              />
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={(skill.rating / 5) * 100}
                              sx={{ height: 6, borderRadius: 1 }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>
                  );
                })}
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Диалог добавления/редактирования навыка */}
      <Dialog
        open={openAddDialog || openEditDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{openAddDialog ? 'Добавить навык' : 'Редактировать навык'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Название навыка"
              fullWidth
              required
              value={currentSkill.name}
              onChange={e => handleFieldChange('name', e.target.value)}
              sx={{ mb: 3 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="category-select-label">Категория</InputLabel>
              <Select
                labelId="category-select-label"
                value={currentSkill.category}
                label="Категория"
                onChange={e => handleFieldChange('category', e.target.value)}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <Typography gutterBottom>Уровень владения</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Slider
                  value={currentSkill.rating}
                  onChange={(_, value) => handleFieldChange('rating', value as number)}
                  step={1}
                  marks
                  min={1}
                  max={5}
                  sx={{ flexGrow: 1, mr: 2 }}
                />
                <Rating
                  value={currentSkill.rating}
                  onChange={(_, value) => handleFieldChange('rating', value as number)}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Начинающий
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Средний
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Эксперт
                </Typography>
              </Box>
            </Box>
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

export default HrProfileSkills;
