import { useEffect, useState } from 'react';
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
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ru } from 'date-fns/locale/ru';

// Типы данных для опыта работы
interface WorkExperience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate: Date | null;
  skills: string[];
}

// Начальное пустое значение для новой записи
const emptyExperience: Omit<WorkExperience, 'id'> = {
  company: '',
  position: '',
  description: '',
  startDate: new Date(),
  endDate: null,
  skills: [],
};

// Список общих навыков для выбора
const availableSkills = [
  'AutoCAD',
  'Revit',
  'SCAD',
  'Lira',
  'ArchiCAD',
  'Tekla Structures',
  'КОМПАС-3D',
  'nanoCAD',
  'Renga',
  'Железобетонные конструкции',
  'Металлические конструкции',
  'Проектная документация',
  'Авторский надзор',
  'BIM',
  'Проектирование фундаментов',
  'Расчет конструкций',
  'Проектирование каркасов зданий',
  'Руководство группой',
  'Проектирование усиления',
  'Обследование зданий',
];

function CandidateProfileExperience() {
  // Состояния для диалоговых окон
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Состояние для редактируемого опыта работы
  const [currentExperience, setCurrentExperience] =
    useState<Omit<WorkExperience, 'id'>>(emptyExperience);
  const [currentExperienceId, setCurrentExperienceId] = useState<string | null>(null);

  // Состояние для нового навыка
  const [newSkill, setNewSkill] = useState<string>('');

  // Временные данные о трудовом опыте, в реальном приложении будут загружаться с сервера
  const [experiences, setExperiences] = useState<WorkExperience[]>([
    {
      id: '1',
      company: 'ООО "СтройПроект"',
      position: 'Инженер-проектировщик ПГС',
      description:
        'Проектирование железобетонных конструкций для промышленных зданий. Расчет нагрузок согласно СП 20.13330. Разработка и оформление проектной документации стадий "П" и "Р". Согласование проектных решений с заказчиком и смежными отделами.',
      startDate: new Date('2020-03-01'),
      endDate: new Date('2022-06-30'),
      skills: ['Железобетонные конструкции', 'AutoCAD', 'SCAD', 'Проектная документация'],
    },
    {
      id: '2',
      company: 'АО "Институт Промстройпроект"',
      position: 'Ведущий инженер ПГС',
      description:
        'Руководство группой из 3 инженеров. Проектирование несущих конструкций зданий и сооружений. Разработка конструктивных решений фундаментов, каркасов, перекрытий. Проверка расчетов и документации. Авторский надзор за строительством.',
      startDate: new Date('2022-07-01'),
      endDate: null,
      skills: [
        'Руководство группой',
        'Revit',
        'Lira',
        'Авторский надзор',
        'Проектирование фундаментов',
      ],
    },
  ]);

  // Сортировка опыта работы по дате начала (самый недавний сверху)
  useEffect(() => {
    setExperiences(prev => [...prev].sort((a, b) => b.startDate.getTime() - a.startDate.getTime()));
  }, []);

  // Функция форматирования даты
  const formatDate = (date: Date | null): string => {
    if (!date) return 'по настоящее время';
    return new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(date);
  };

  // Функция для расчета продолжительности работы
  const getDuration = (startDate: Date, endDate: Date | null): string => {
    const end = endDate || new Date();
    const diffYears = end.getFullYear() - startDate.getFullYear();
    const diffMonths = end.getMonth() - startDate.getMonth();

    let years = diffYears;
    let months = diffMonths;

    if (diffMonths < 0) {
      years -= 1;
      months += 12;
    }

    let result = '';
    if (years > 0) {
      result += `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`;
    }
    if (months > 0) {
      if (result) result += ' ';
      result += `${months} ${months === 1 ? 'месяц' : months < 5 ? 'месяца' : 'месяцев'}`;
    }
    if (!result) return 'Менее месяца';
    return result;
  };

  // Обработчики для диалога добавления/редактирования
  const handleOpenAddDialog = () => {
    setCurrentExperience(emptyExperience);
    setCurrentExperienceId(null);
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (exp: WorkExperience) => {
    setCurrentExperience({
      company: exp.company,
      position: exp.position,
      description: exp.description,
      startDate: exp.startDate,
      endDate: exp.endDate,
      skills: [...exp.skills],
    });
    setCurrentExperienceId(exp.id);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setCurrentExperience(emptyExperience);
    setCurrentExperienceId(null);
    setNewSkill('');
  };

  // Обработчики для диалога удаления
  const handleOpenDeleteDialog = (id: string) => {
    setCurrentExperienceId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentExperienceId(null);
  };

  // Обработчики изменения полей формы
  const handleFieldChange = (field: keyof typeof currentExperience, value: any) => {
    setCurrentExperience(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Обработчики навыков
  const handleAddSkill = () => {
    if (newSkill && !currentExperience.skills.includes(newSkill)) {
      setCurrentExperience(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setCurrentExperience(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  // Обработчики сохранения форм
  const handleSaveExperience = () => {
    // Валидация формы
    if (
      !currentExperience.company ||
      !currentExperience.position ||
      !currentExperience.description
    ) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    if (openAddDialog) {
      // Добавление нового опыта работы
      const newId = Date.now().toString(); // Простая генерация ID
      setExperiences(prev => [
        ...prev,
        {
          id: newId,
          ...currentExperience,
        },
      ]);
    } else if (openEditDialog && currentExperienceId) {
      // Редактирование существующего опыта работы
      setExperiences(prev =>
        prev.map(exp =>
          exp.id === currentExperienceId ? { id: exp.id, ...currentExperience } : exp
        )
      );
    }

    handleCloseDialog();
  };

  // Обработчик удаления опыта работы
  const handleDeleteExperience = () => {
    if (currentExperienceId) {
      setExperiences(prev => prev.filter(exp => exp.id !== currentExperienceId));
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Опыт работы</Typography>
        <Button variant="contained" startIcon={<Add />} size="small" onClick={handleOpenAddDialog}>
          Добавить место работы
        </Button>
      </Box>

      {experiences.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            У вас пока нет добавленных мест работы. Нажмите "Добавить место работы" чтобы начать.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {experiences.map((exp, index) => (
            <Card
              key={exp.id}
              sx={{
                mb: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {exp.position}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                      {exp.company}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                      {' · '}
                      {getDuration(exp.startDate, exp.endDate)}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenEditDialog(exp)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(exp.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" paragraph>
                  {exp.description}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Навыки:
                  </Typography>
                  <Box>
                    {exp.skills.map(skill => (
                      <Chip key={skill} label={skill} size="small" sx={{ mr: 1, mb: 1 }} />
                    ))}
                  </Box>
                </Box>
              </CardContent>

              {index < experiences.length - 1 && <Divider />}
            </Card>
          ))}
        </Box>
      )}

      {/* Диалог добавления/редактирования опыта работы */}
      <Dialog
        open={openAddDialog || openEditDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {openAddDialog ? 'Добавить место работы' : 'Редактировать место работы'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1, mx: -1 }}>
              <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }}>
                <TextField
                  label="Компания"
                  fullWidth
                  required
                  value={currentExperience.company}
                  onChange={e => handleFieldChange('company', e.target.value)}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }}>
                <TextField
                  label="Должность"
                  fullWidth
                  required
                  value={currentExperience.position}
                  onChange={e => handleFieldChange('position', e.target.value)}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }}>
                <DatePicker
                  label="Дата начала"
                  value={currentExperience.startDate}
                  onChange={(date: Date | null) => handleFieldChange('startDate', date)}
                  sx={{ width: '100%' }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }}>
                <DatePicker
                  label="Дата окончания"
                  value={currentExperience.endDate}
                  onChange={(date: Date | null) => handleFieldChange('endDate', date)}
                  sx={{ width: '100%' }}
                />
              </Box>
              <Box sx={{ width: '100%', px: 1, mb: 2 }}>
                <TextField
                  label="Описание опыта работы"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  value={currentExperience.description}
                  onChange={e => handleFieldChange('description', e.target.value)}
                />
              </Box>
              <Box sx={{ width: '100%', px: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Навыки
                </Typography>
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
                  {currentExperience.skills.map(skill => (
                    <Chip
                      key={skill}
                      label={skill}
                      onDelete={() => handleRemoveSkill(skill)}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl fullWidth>
                    <InputLabel id="skill-select-label">Добавить навык</InputLabel>
                    <Select
                      labelId="skill-select-label"
                      value={newSkill}
                      label="Добавить навык"
                      onChange={e => setNewSkill(e.target.value)}
                    >
                      {availableSkills
                        .filter(skill => !currentExperience.skills.includes(skill))
                        .map(skill => (
                          <MenuItem key={skill} value={skill}>
                            {skill}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" onClick={handleAddSkill} disabled={!newSkill}>
                    Добавить
                  </Button>
                </Box>
              </Box>
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<Cancel />}>
            Отмена
          </Button>
          <Button
            onClick={handleSaveExperience}
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
        <DialogTitle>Удалить запись?</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить эту запись об опыте работы? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Отмена</Button>
          <Button onClick={handleDeleteExperience} variant="contained" color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CandidateProfileExperience;
