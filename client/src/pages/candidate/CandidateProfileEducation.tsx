import { useEffect, useState } from 'react';
import { Add, Cancel, Delete, Edit, Save, School } from '@mui/icons-material';
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
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ru } from 'date-fns/locale/ru';

// Типы данных для образования
interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  description?: string;
  startDate: Date;
  endDate: Date | null;
  isCurrentlyStudying: boolean;
}

// Начальное пустое значение для новой записи
const emptyEducation: Omit<Education, 'id'> = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  description: '',
  startDate: new Date(),
  endDate: null,
  isCurrentlyStudying: false,
};

// Доступные степени образования
const availableDegrees = [
  'Среднее общее',
  'Среднее профессиональное',
  'Бакалавр',
  'Специалист',
  'Магистр',
  'Аспирантура',
  'Кандидат наук',
  'Доктор наук',
  'Профессиональная переподготовка',
  'Повышение квалификации',
];

function CandidateProfileEducation() {
  // Состояния для диалоговых окон
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Состояние для редактируемого образования
  const [currentEducation, setCurrentEducation] = useState<Omit<Education, 'id'>>(emptyEducation);
  const [currentEducationId, setCurrentEducationId] = useState<string | null>(null);

  // Временные данные об образовании, в реальном приложении будут загружаться с сервера
  const [educations, setEducations] = useState<Education[]>([
    {
      id: '1',
      institution: 'Московский государственный строительный университет',
      degree: 'Магистр',
      fieldOfStudy: 'Промышленное и гражданское строительство',
      description:
        'Специализация: проектирование строительных конструкций. Дипломная работа: "Проектирование многоэтажного офисного здания с применением BIM технологий"',
      startDate: new Date('2018-09-01'),
      endDate: new Date('2020-06-30'),
      isCurrentlyStudying: false,
    },
    {
      id: '2',
      institution: 'Московский государственный строительный университет',
      degree: 'Бакалавр',
      fieldOfStudy: 'Строительство',
      description:
        'Основные дисциплины: теория расчета строительных конструкций, технология строительного производства, строительные материалы. Дипломная работа: "Расчет и проектирование железобетонных конструкций промышленного здания"',
      startDate: new Date('2014-09-01'),
      endDate: new Date('2018-06-30'),
      isCurrentlyStudying: false,
    },
  ]);

  // Сортировка образования по дате начала (самое свежее сверху)
  useEffect(() => {
    setEducations(prevEducations =>
      [...prevEducations].sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
    );
  }, []);

  // Функция форматирования даты
  const formatDate = (date: Date | null): string => {
    if (!date) return 'по настоящее время';
    return new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(date);
  };

  // Функция для расчета продолжительности обучения
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
    setCurrentEducation(emptyEducation);
    setCurrentEducationId(null);
    setOpenAddDialog(true);
  };

  const handleOpenEditDialog = (edu: Education) => {
    setCurrentEducation({
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      description: edu.description || '',
      startDate: edu.startDate,
      endDate: edu.endDate,
      isCurrentlyStudying: edu.isCurrentlyStudying,
    });
    setCurrentEducationId(edu.id);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setCurrentEducation(emptyEducation);
    setCurrentEducationId(null);
  };

  // Обработчики для диалога удаления
  const handleOpenDeleteDialog = (id: string) => {
    setCurrentEducationId(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentEducationId(null);
  };

  // Обработчики изменения полей формы
  const handleFieldChange = (field: keyof typeof currentEducation, value: any) => {
    setCurrentEducation(prev => ({
      ...prev,
      [field]: value,
    }));

    // Если пользователь отметил, что сейчас учится, установить endDate в null
    if (field === 'isCurrentlyStudying' && value === true) {
      setCurrentEducation(prev => ({
        ...prev,
        endDate: null,
      }));
    }
  };

  // Обработчики сохранения форм
  const handleSaveEducation = () => {
    // Валидация формы
    if (
      !currentEducation.institution ||
      !currentEducation.degree ||
      !currentEducation.fieldOfStudy
    ) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    if (openAddDialog) {
      // Добавление нового образования
      const newId = Date.now().toString(); // Простая генерация ID
      setEducations(prev => [
        ...prev,
        {
          id: newId,
          ...currentEducation,
        },
      ]);
    } else if (openEditDialog && currentEducationId) {
      // Редактирование существующего образования
      setEducations(prev =>
        prev.map(edu => (edu.id === currentEducationId ? { id: edu.id, ...currentEducation } : edu))
      );
    }

    handleCloseDialog();
  };

  // Обработчик удаления образования
  const handleDeleteEducation = () => {
    if (currentEducationId) {
      setEducations(prev => prev.filter(edu => edu.id !== currentEducationId));
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Образование</Typography>
        <Button variant="contained" startIcon={<Add />} size="small" onClick={handleOpenAddDialog}>
          Добавить образование
        </Button>
      </Box>

      {educations.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            У вас пока нет добавленного образования. Нажмите "Добавить образование" чтобы начать.
          </Typography>
        </Paper>
      ) : (
        <Box>
          {educations.map((edu, index) => (
            <Card
              key={edu.id}
              sx={{
                mb: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <School color="primary" fontSize="small" />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {edu.degree}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" color="primary">
                      {edu.institution}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                      {edu.fieldOfStudy}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                      {' · '}
                      {getDuration(edu.startDate, edu.endDate)}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpenEditDialog(edu)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(edu.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {edu.description && (
                  <Typography variant="body2" paragraph>
                    {edu.description}
                  </Typography>
                )}
              </CardContent>

              {index < educations.length - 1 && <Divider />}
            </Card>
          ))}
        </Box>
      )}

      {/* Диалог добавления/редактирования образования */}
      <Dialog
        open={openAddDialog || openEditDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {openAddDialog ? 'Добавить образование' : 'Редактировать образование'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1, mx: -1 }}>
              <Box sx={{ width: '100%', px: 1, mb: 2 }}>
                <TextField
                  label="Учебное заведение"
                  fullWidth
                  required
                  value={currentEducation.institution}
                  onChange={e => handleFieldChange('institution', e.target.value)}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }}>
                <FormControl fullWidth required>
                  <InputLabel id="degree-select-label">Степень/Уровень образования</InputLabel>
                  <Select
                    labelId="degree-select-label"
                    value={currentEducation.degree}
                    label="Степень/Уровень образования"
                    onChange={e => handleFieldChange('degree', e.target.value)}
                  >
                    {availableDegrees.map(degree => (
                      <MenuItem key={degree} value={degree}>
                        {degree}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }}>
                <TextField
                  label="Специальность/Направление"
                  fullWidth
                  required
                  value={currentEducation.fieldOfStudy}
                  onChange={e => handleFieldChange('fieldOfStudy', e.target.value)}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }}>
                <DatePicker
                  label="Дата начала"
                  value={currentEducation.startDate}
                  onChange={(date: Date | null) => handleFieldChange('startDate', date)}
                  sx={{ width: '100%' }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, px: 1, mb: 2 }}>
                <DatePicker
                  label="Дата окончания"
                  value={currentEducation.endDate}
                  onChange={(date: Date | null) => handleFieldChange('endDate', date)}
                  disabled={currentEducation.isCurrentlyStudying}
                  sx={{ width: '100%' }}
                />
              </Box>
              <Box sx={{ width: '100%', px: 1, mb: 2 }}>
                <FormControl sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Typography component="label" htmlFor="currently-studying" sx={{ mr: 2 }}>
                    Обучаюсь в настоящее время
                  </Typography>
                  <input
                    id="currently-studying"
                    type="checkbox"
                    checked={currentEducation.isCurrentlyStudying}
                    onChange={e => handleFieldChange('isCurrentlyStudying', e.target.checked)}
                  />
                </FormControl>
              </Box>
              <Box sx={{ width: '100%', px: 1, mb: 2 }}>
                <TextField
                  label="Описание (необязательно)"
                  fullWidth
                  multiline
                  rows={3}
                  value={currentEducation.description}
                  onChange={e => handleFieldChange('description', e.target.value)}
                  placeholder="Дополнительная информация об образовании, специализации, дипломной работе и т.д."
                />
              </Box>
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<Cancel />}>
            Отмена
          </Button>
          <Button
            onClick={handleSaveEducation}
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
            Вы уверены, что хотите удалить эту запись об образовании? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Отмена</Button>
          <Button onClick={handleDeleteEducation} variant="contained" color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CandidateProfileEducation;
