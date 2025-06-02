import { useState } from 'react';
import { Add, DateRange, Delete, Edit, Grade, School } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addEducation,
  deleteEducation,
  Education,
  selectEducation,
  updateEducation,
} from '../../features/hr/hrProfileSlice';

function HrProfileEducation() {
  const dispatch = useAppDispatch();
  const education = useAppSelector(selectEducation);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Education, 'id'>>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    gpa: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const theme = useTheme();
  const isVerySmall = useMediaQuery('(max-width:375px)');
  const isXSmall = useMediaQuery('(max-width:320px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(name === 'isCurrent' && checked ? { endDate: '' } : {}),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOpenDialog = (edu?: Education) => {
    if (edu) {
      setFormData({
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate || '',
        isCurrent: edu.isCurrent,
        description: edu.description || '',
        gpa: edu.gpa || '',
      });
      setEditingId(edu.id);
    } else {
      setFormData({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        gpa: '',
      });
      setEditingId(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
  };

  const handleSave = () => {
    try {
      if (editingId) {
        dispatch(updateEducation({ ...formData, id: editingId }));
        setSnackbar({
          open: true,
          message: 'Образование успешно обновлено',
          severity: 'success',
        });
      } else {
        dispatch(addEducation(formData));
        setSnackbar({
          open: true,
          message: 'Образование успешно добавлено',
          severity: 'success',
        });
      }
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Ошибка при сохранении',
        severity: 'error',
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту запись об образовании?')) {
      dispatch(deleteEducation(id));
      setSnackbar({
        open: true,
        message: 'Образование удалено',
        severity: 'success',
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const [year, month] = dateString.split('-');
    const monthNames = [
      'янв',
      'фев',
      'мар',
      'апр',
      'май',
      'июн',
      'июл',
      'авг',
      'сен',
      'окт',
      'ноя',
      'дек',
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const calculateDuration = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = new Date(startDate);
    const end = isCurrent ? new Date() : new Date(endDate || '');
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;

    if (years > 0 && months > 0) {
      return `${years} г. ${months} мес.`;
    } else if (years > 0) {
      return `${years} г.`;
    } else {
      return `${months} мес.`;
    }
  };

  return (
    <Box sx={{ px: isVerySmall ? 0.5 : 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant={isVerySmall ? 'h6' : isMobile ? 'h5' : 'h4'}
          sx={{
            fontSize: isVerySmall ? '1.1rem' : undefined,
            fontWeight: 'medium',
          }}
        >
          Образование
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          size={isVerySmall ? 'small' : 'medium'}
          sx={{
            fontSize: isVerySmall ? '0.75rem' : undefined,
            px: isVerySmall ? 1.5 : undefined,
          }}
        >
          Добавить
        </Button>
      </Box>

      {education.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <School sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Образование не добавлено
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Добавьте информацию о своем образовании
          </Typography>
          <Button variant="outlined" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Добавить образование
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {education.map(edu => (
            <Card key={edu.id} sx={{ position: 'relative' }}>
              <CardContent sx={{ p: isVerySmall ? 2 : 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant={isVerySmall ? 'subtitle1' : 'h6'}
                      sx={{
                        fontWeight: 'bold',
                        fontSize: isVerySmall ? '1rem' : undefined,
                        mb: 0.5,
                      }}
                    >
                      {edu.degree} - {edu.fieldOfStudy}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <School
                        sx={{
                          fontSize: isVerySmall ? 16 : 20,
                          color: 'text.secondary',
                          mr: 1,
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        sx={{ fontSize: isVerySmall ? '0.85rem' : undefined }}
                      >
                        {edu.institution}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <DateRange
                        sx={{
                          fontSize: isVerySmall ? 16 : 20,
                          color: 'text.secondary',
                          mr: 1,
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: isVerySmall ? '0.75rem' : undefined }}
                      >
                        {formatDate(edu.startDate)} —{' '}
                        {edu.isCurrent ? 'настоящее время' : formatDate(edu.endDate || '')} (
                        {calculateDuration(edu.startDate, edu.endDate, edu.isCurrent)})
                      </Typography>
                      {edu.isCurrent && (
                        <Chip
                          label="Обучаюсь"
                          size="small"
                          color="primary"
                          sx={{
                            ml: 1,
                            fontSize: isVerySmall ? '0.65rem' : undefined,
                            height: isVerySmall ? 20 : undefined,
                          }}
                        />
                      )}
                    </Box>
                    {edu.gpa && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Grade
                          sx={{
                            fontSize: isVerySmall ? 16 : 20,
                            color: 'text.secondary',
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: isVerySmall ? '0.75rem' : undefined }}
                        >
                          Средний балл: {edu.gpa}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size={isVerySmall ? 'small' : 'medium'}
                      onClick={() => handleOpenDialog(edu)}
                      sx={{ color: 'primary.main' }}
                    >
                      <Edit sx={{ fontSize: isVerySmall ? 16 : 20 }} />
                    </IconButton>
                    <IconButton
                      size={isVerySmall ? 'small' : 'medium'}
                      onClick={() => handleDelete(edu.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <Delete sx={{ fontSize: isVerySmall ? 16 : 20 }} />
                    </IconButton>
                  </Box>
                </Box>

                {edu.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: isVerySmall ? '0.75rem' : undefined,
                      lineHeight: isVerySmall ? 1.3 : undefined,
                    }}
                  >
                    {edu.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Диалог добавления/редактирования */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontSize: isVerySmall ? '1.1rem' : undefined }}>
          {editingId ? 'Редактировать образование' : 'Добавить образование'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Учебное заведение"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              required
              size={isVerySmall ? 'small' : 'medium'}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: isVerySmall ? '0.85rem' : undefined,
                },
                '& .MuiInputLabel-root': {
                  fontSize: isVerySmall ? '0.85rem' : undefined,
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
              <TextField
                fullWidth
                label="Степень/Уровень"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                required
                placeholder="Бакалавр, Магистр, Специалист..."
                size={isVerySmall ? 'small' : 'medium'}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: isVerySmall ? '0.85rem' : undefined,
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: isVerySmall ? '0.85rem' : undefined,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Направление/Специальность"
                name="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={handleInputChange}
                required
                size={isVerySmall ? 'small' : 'medium'}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: isVerySmall ? '0.85rem' : undefined,
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: isVerySmall ? '0.85rem' : undefined,
                  },
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: isMobile ? 'column' : 'row' }}>
              <TextField
                fullWidth
                label="Дата начала"
                name="startDate"
                type="month"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
                size={isVerySmall ? 'small' : 'medium'}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: isVerySmall ? '0.85rem' : undefined,
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: isVerySmall ? '0.85rem' : undefined,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Дата окончания"
                name="endDate"
                type="month"
                value={formData.endDate}
                onChange={handleInputChange}
                disabled={formData.isCurrent}
                InputLabelProps={{ shrink: true }}
                size={isVerySmall ? 'small' : 'medium'}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: isVerySmall ? '0.85rem' : undefined,
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: isVerySmall ? '0.85rem' : undefined,
                  },
                }}
              />
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  name="isCurrent"
                  checked={formData.isCurrent}
                  onChange={handleInputChange}
                />
              }
              label={
                <Typography sx={{ fontSize: isVerySmall ? '0.85rem' : undefined }}>
                  Обучаюсь в настоящее время
                </Typography>
              }
            />
            <TextField
              fullWidth
              label="Средний балл (GPA)"
              name="gpa"
              value={formData.gpa}
              onChange={handleInputChange}
              placeholder="4.5, 4.8, отлично..."
              size={isVerySmall ? 'small' : 'medium'}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: isVerySmall ? '0.85rem' : undefined,
                },
                '& .MuiInputLabel-root': {
                  fontSize: isVerySmall ? '0.85rem' : undefined,
                },
              }}
            />
            <TextField
              fullWidth
              label="Дополнительная информация"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={isVerySmall ? 2 : 3}
              placeholder="Специализация, достижения, дипломная работа..."
              size={isVerySmall ? 'small' : 'medium'}
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: isVerySmall ? '0.85rem' : undefined,
                },
                '& .MuiInputLabel-root': {
                  fontSize: isVerySmall ? '0.85rem' : undefined,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            size={isVerySmall ? 'small' : 'medium'}
            sx={{ fontSize: isVerySmall ? '0.75rem' : undefined }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            size={isVerySmall ? 'small' : 'medium'}
            sx={{ fontSize: isVerySmall ? '0.75rem' : undefined }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Уведомления */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default HrProfileEducation;
