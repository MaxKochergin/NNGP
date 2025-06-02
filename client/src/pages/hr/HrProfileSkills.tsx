import { useState } from 'react';
import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Rating,
  Select,
  Slider,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addSkill,
  deleteSkill,
  selectSkills,
  Skill,
  updateSkill,
} from '../../features/hr/hrProfileSlice';

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
  const dispatch = useAppDispatch();
  const skills = useAppSelector(selectSkills);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Omit<Skill, 'id'>>({
    name: '',
    rating: 3,
    category: categories[0],
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

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpenDialog = (skill?: Skill) => {
    if (skill) {
      setFormData({
        name: skill.name,
        rating: skill.rating,
        category: skill.category,
      });
      setEditingId(skill.id);
    } else {
      setFormData({
        name: '',
        rating: 3,
        category: categories[0],
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
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Пожалуйста, введите название навыка',
        severity: 'error',
      });
      return;
    }

    try {
      if (editingId) {
        dispatch(updateSkill({ ...formData, id: editingId }));
        setSnackbar({
          open: true,
          message: 'Навык успешно обновлен',
          severity: 'success',
        });
      } else {
        dispatch(addSkill(formData));
        setSnackbar({
          open: true,
          message: 'Навык успешно добавлен',
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
    if (window.confirm('Вы уверены, что хотите удалить этот навык?')) {
      dispatch(deleteSkill(id));
      setSnackbar({
        open: true,
        message: 'Навык удален',
        severity: 'success',
      });
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
    <Box sx={{ px: isVerySmall ? 0.5 : 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant={isVerySmall ? 'h6' : isMobile ? 'h5' : 'h4'}
          sx={{
            fontSize: isVerySmall ? '1.1rem' : undefined,
            fontWeight: 'medium',
          }}
        >
          Профессиональные навыки
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

      {skills.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Навыки не добавлены
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Добавьте информацию о своих профессиональных навыках
          </Typography>
          <Button variant="outlined" startIcon={<Add />} onClick={() => handleOpenDialog()}>
            Добавить навык
          </Button>
        </Paper>
      ) : (
        <Box>
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <Paper key={category} sx={{ mb: 3, p: isVerySmall ? 2 : 3 }}>
              <Typography
                variant={isVerySmall ? 'subtitle1' : 'h6'}
                sx={{
                  mb: 2,
                  pb: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  fontSize: isVerySmall ? '1rem' : undefined,
                  fontWeight: 'bold',
                }}
              >
                {category}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {categorySkills.map(skill => (
                  <Box
                    key={skill.id}
                    sx={{
                      width: {
                        xs: '100%',
                        sm: 'calc(50% - 8px)',
                        md: 'calc(33.33% - 11px)',
                        lg: 'calc(25% - 12px)',
                      },
                    }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: isVerySmall ? 1.5 : 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 1.5,
                          }}
                        >
                          <Typography
                            variant={isVerySmall ? 'body2' : 'subtitle1'}
                            sx={{
                              fontWeight: 'medium',
                              fontSize: isVerySmall ? '0.85rem' : undefined,
                              lineHeight: isVerySmall ? 1.3 : undefined,
                              flex: 1,
                              mr: 1,
                            }}
                          >
                            {skill.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <Button
                              size="small"
                              color="primary"
                              onClick={() => handleOpenDialog(skill)}
                              sx={{
                                minWidth: 'auto',
                                p: isVerySmall ? 0.25 : 0.5,
                              }}
                            >
                              <Edit sx={{ fontSize: isVerySmall ? 14 : 16 }} />
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDelete(skill.id)}
                              sx={{
                                minWidth: 'auto',
                                p: isVerySmall ? 0.25 : 0.5,
                              }}
                            >
                              <Delete sx={{ fontSize: isVerySmall ? 14 : 16 }} />
                            </Button>
                          </Box>
                        </Box>

                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                mr: 1,
                                minWidth: isVerySmall ? 50 : 60,
                                fontSize: isVerySmall ? '0.75rem' : undefined,
                              }}
                            >
                              Уровень:
                            </Typography>
                            <Rating
                              value={skill.rating}
                              readOnly
                              size={isVerySmall ? 'small' : 'medium'}
                              sx={{ color: 'primary.main' }}
                            />
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(skill.rating / 5) * 100}
                            sx={{
                              height: isVerySmall ? 4 : 6,
                              borderRadius: 1,
                              backgroundColor: 'grey.200',
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Диалог добавления/редактирования навыка */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ fontSize: isVerySmall ? '1.1rem' : undefined }}>
          {editingId ? 'Редактировать навык' : 'Добавить навык'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Название навыка"
              fullWidth
              required
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
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

            <FormControl fullWidth size={isVerySmall ? 'small' : 'medium'}>
              <InputLabel
                id="category-select-label"
                sx={{ fontSize: isVerySmall ? '0.85rem' : undefined }}
              >
                Категория
              </InputLabel>
              <Select
                labelId="category-select-label"
                value={formData.category}
                label="Категория"
                onChange={e => handleInputChange('category', e.target.value)}
                sx={{
                  '& .MuiSelect-select': {
                    fontSize: isVerySmall ? '0.85rem' : undefined,
                  },
                }}
              >
                {categories.map(category => (
                  <MenuItem
                    key={category}
                    value={category}
                    sx={{ fontSize: isVerySmall ? '0.85rem' : undefined }}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box>
              <Typography gutterBottom sx={{ fontSize: isVerySmall ? '0.85rem' : undefined }}>
                Уровень владения
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Slider
                  value={formData.rating}
                  onChange={(_, value) => handleInputChange('rating', value as number)}
                  step={1}
                  marks
                  min={1}
                  max={5}
                  sx={{ flexGrow: 1 }}
                />
                <Rating
                  value={formData.rating}
                  onChange={(_, value) => handleInputChange('rating', value as number)}
                  size={isVerySmall ? 'small' : 'medium'}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: isVerySmall ? '0.65rem' : undefined }}
                >
                  Начинающий
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: isVerySmall ? '0.65rem' : undefined }}
                >
                  Средний
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: isVerySmall ? '0.65rem' : undefined }}
                >
                  Эксперт
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            startIcon={<Cancel />}
            size={isVerySmall ? 'small' : 'medium'}
            sx={{ fontSize: isVerySmall ? '0.75rem' : undefined }}
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            startIcon={<Save />}
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

export default HrProfileSkills;
