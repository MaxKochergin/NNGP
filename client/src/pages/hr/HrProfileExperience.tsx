import { useState } from 'react';
import { Add, Business, Cancel, DateRange, Delete, Edit, Save, Work } from '@mui/icons-material';
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
  addExperience,
  deleteExperience,
  Experience,
  selectExperience,
  updateExperience,
} from '../../features/hr/hrProfileSlice';

function HrProfileExperience() {
  const dispatch = useAppDispatch();
  const experience = useAppSelector(selectExperience);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    achievements: [],
  });
  const [achievementInput, setAchievementInput] = useState('');
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

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementInput.trim()],
      }));
      setAchievementInput('');
    }
  };

  const handleRemoveAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const handleOpenDialog = (exp?: Experience) => {
    if (exp) {
      setFormData({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate || '',
        isCurrent: exp.isCurrent,
        description: exp.description,
        achievements: [...exp.achievements],
      });
      setEditingId(exp.id);
    } else {
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        achievements: [],
      });
      setEditingId(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingId(null);
    setAchievementInput('');
  };

  const handleSave = () => {
    try {
      if (editingId) {
        dispatch(updateExperience({ ...formData, id: editingId }));
        setSnackbar({
          open: true,
          message: 'Опыт работы успешно обновлен',
          severity: 'success',
        });
      } else {
        dispatch(addExperience(formData));
        setSnackbar({
          open: true,
          message: 'Опыт работы успешно добавлен',
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
    if (window.confirm('Вы уверены, что хотите удалить этот опыт работы?')) {
      dispatch(deleteExperience(id));
      setSnackbar({
        open: true,
        message: 'Опыт работы удален',
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
          Опыт работы
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

      {experience.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Work sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Опыт работы не добавлен
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Добавьте информацию о своем профессиональном опыте
          </Typography>
          <Button variant="outlined" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Добавить опыт работы
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {experience.map(exp => (
            <Card key={exp.id} sx={{ position: 'relative' }}>
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
                      {exp.position}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Business
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
                        {exp.company}
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
                        {formatDate(exp.startDate)} —{' '}
                        {exp.isCurrent ? 'настоящее время' : formatDate(exp.endDate || '')} (
                        {calculateDuration(exp.startDate, exp.endDate, exp.isCurrent)})
                      </Typography>
                      {exp.isCurrent && (
                        <Chip
                          label="Текущее место"
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
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size={isVerySmall ? 'small' : 'medium'}
                      onClick={() => handleOpenDialog(exp)}
                      sx={{ color: 'primary.main' }}
                    >
                      <Edit sx={{ fontSize: isVerySmall ? 16 : 20 }} />
                    </IconButton>
                    <IconButton
                      size={isVerySmall ? 'small' : 'medium'}
                      onClick={() => handleDelete(exp.id)}
                      sx={{ color: 'error.main' }}
                    >
                      <Delete sx={{ fontSize: isVerySmall ? 16 : 20 }} />
                    </IconButton>
                  </Box>
                </Box>

                {exp.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      fontSize: isVerySmall ? '0.75rem' : undefined,
                      lineHeight: isVerySmall ? 1.3 : undefined,
                    }}
                  >
                    {exp.description}
                  </Typography>
                )}

                {exp.achievements.length > 0 && (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mb: 1,
                        fontWeight: 'bold',
                        fontSize: isVerySmall ? '0.8rem' : undefined,
                      }}
                    >
                      Достижения:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {exp.achievements.map((achievement, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{
                            fontSize: isVerySmall ? '0.75rem' : undefined,
                            lineHeight: isVerySmall ? 1.3 : undefined,
                            '&:before': {
                              content: '"• "',
                              color: 'primary.main',
                              fontWeight: 'bold',
                            },
                          }}
                        >
                          {achievement}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
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
          {editingId ? 'Редактировать опыт работы' : 'Добавить опыт работы'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              fullWidth
              label="Должность"
              name="position"
              value={formData.position}
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
            <TextField
              fullWidth
              label="Компания"
              name="company"
              value={formData.company}
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
                  Работаю в настоящее время
                </Typography>
              }
            />
            <TextField
              fullWidth
              label="Описание"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={isVerySmall ? 2 : 3}
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

            {/* Достижения */}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontSize: isVerySmall ? '0.85rem' : undefined,
                }}
              >
                Достижения
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Добавить достижение"
                  value={achievementInput}
                  onChange={e => setAchievementInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddAchievement()}
                  size={isVerySmall ? 'small' : 'medium'}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: isVerySmall ? '0.85rem' : undefined,
                    },
                  }}
                />
                <Button
                  onClick={handleAddAchievement}
                  size={isVerySmall ? 'small' : 'medium'}
                  sx={{ fontSize: isVerySmall ? '0.75rem' : undefined }}
                >
                  Добавить
                </Button>
              </Box>
              {formData.achievements.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {formData.achievements.map((achievement, index) => (
                    <Chip
                      key={index}
                      label={achievement}
                      onDelete={() => handleRemoveAchievement(index)}
                      variant="outlined"
                      size={isVerySmall ? 'small' : 'medium'}
                      sx={{
                        justifyContent: 'space-between',
                        fontSize: isVerySmall ? '0.75rem' : undefined,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
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

export default HrProfileExperience;
