import { useState } from 'react';
import { Cancel, Edit, Email, LocationOn, Phone, Save } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectBasicInfo, updateBasicInfo, type BasicInfo } from '../../features/hr/hrProfileSlice';

function BasicInfoHr() {
  const dispatch = useAppDispatch();
  const basicInfo = useAppSelector(selectBasicInfo);

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<BasicInfo>(basicInfo);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const theme = useTheme();
  const isXSmall = useMediaQuery('(max-width:320px)');
  const isVerySmall = useMediaQuery('(max-width:375px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditing(!editing);
    if (!editing) {
      // При включении режима редактирования копируем данные в форму
      setFormData({ ...basicInfo });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({ ...basicInfo });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Имитируем запрос к серверу с задержкой
      await new Promise(resolve => setTimeout(resolve, 800));

      // Обновляем данные в Redux store
      dispatch(updateBasicInfo(formData));
      setEditing(false);

      // Показываем уведомление об успехе
      setSnackbar({
        open: true,
        message: 'Профиль успешно обновлен',
        severity: 'success',
      });
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при обновлении профиля',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ px: isVerySmall ? 0.5 : isXSmall ? 0.5 : 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: 0,
          ml: 0,
          gap: isVerySmall ? 1.5 : 2,
        }}
      >
        {/* На мобильных устройствах - одна колонка, на планшетах и десктопах - две */}
        <Box sx={{ width: '100%' }}>
          <Paper
            sx={{
              p: {
                xs: isVerySmall ? 1 : isXSmall ? 1 : 1.5,
                sm: 2,
              },
              display: 'flex',
              flexDirection: isVerySmall || isXSmall ? 'column' : isMobile ? 'row' : 'column',
              alignItems: isVerySmall || isXSmall ? 'center' : isMobile ? 'flex-start' : 'center',
              gap: isVerySmall ? 1 : isXSmall ? 1 : 2,
            }}
          >
            <Avatar
              sx={{
                width: isVerySmall ? 50 : isXSmall ? 60 : isMobile ? 80 : isTablet ? 100 : 120,
                height: isVerySmall ? 50 : isXSmall ? 60 : isMobile ? 80 : isTablet ? 100 : 120,
                mb: isVerySmall || isXSmall || isMobile ? 0 : 2,
                bgcolor: 'primary.main',
                fontSize: isVerySmall ? 20 : isXSmall ? 24 : isMobile ? 28 : 36,
              }}
              alt={`${basicInfo.firstName} ${basicInfo.lastName}`}
              src={basicInfo.avatar} // Используем avatar из store
            >
              {basicInfo.firstName.charAt(0)}
              {basicInfo.lastName.charAt(0)}
            </Avatar>

            <Box
              sx={{
                flex: 1,
                width: isVerySmall || isXSmall ? '100%' : isMobile ? 'auto' : '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isVerySmall || isXSmall ? 'center' : 'flex-start',
              }}
            >
              {editing ? (
                <Box sx={{ mb: 2, width: '100%' }}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Имя"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    size="small"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: isVerySmall ? '0.8rem' : undefined,
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: isVerySmall ? '0.8rem' : undefined,
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Фамилия"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    size="small"
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: isVerySmall ? '0.8rem' : undefined,
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: isVerySmall ? '0.8rem' : undefined,
                      },
                    }}
                  />
                </Box>
              ) : (
                <Typography
                  variant={isVerySmall ? 'subtitle1' : isXSmall ? 'h6' : isMobile ? 'h6' : 'h5'}
                  gutterBottom
                  align={isVerySmall || isXSmall ? 'center' : isMobile ? 'left' : 'center'}
                  sx={{
                    wordBreak: 'break-word',
                    fontSize: isVerySmall ? '1rem' : isXSmall ? '1.1rem' : undefined,
                    lineHeight: isVerySmall ? 1.2 : undefined,
                  }}
                >
                  {basicInfo.firstName} {basicInfo.lastName}
                </Typography>
              )}

              <Box sx={{ width: '100%', mt: isVerySmall ? 0.5 : isXSmall ? 1 : isMobile ? 0 : 2 }}>
                {editing ? (
                  <>
                    <TextField
                      fullWidth
                      margin="dense"
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <Email color="action" sx={{ mr: 1, fontSize: isVerySmall ? 16 : 18 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: isVerySmall ? '0.8rem' : undefined,
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: isVerySmall ? '0.8rem' : undefined,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      margin="dense"
                      label="Телефон"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <Phone color="action" sx={{ mr: 1, fontSize: isVerySmall ? 16 : 18 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: isVerySmall ? '0.8rem' : undefined,
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: isVerySmall ? '0.8rem' : undefined,
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      margin="dense"
                      label="Местоположение"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <LocationOn
                            color="action"
                            sx={{ mr: 1, fontSize: isVerySmall ? 16 : 18 }}
                          />
                        ),
                      }}
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: isVerySmall ? '0.8rem' : undefined,
                        },
                        '& .MuiInputLabel-root': {
                          fontSize: isVerySmall ? '0.8rem' : undefined,
                        },
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isVerySmall || isXSmall ? 'column' : 'row',
                        alignItems: isVerySmall || isXSmall ? 'center' : 'flex-start',
                        mb: isVerySmall ? 0.5 : 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: isVerySmall || isXSmall ? 0.5 : 0,
                        }}
                      >
                        <Email
                          color="action"
                          sx={{
                            mr: 1,
                            fontSize: isVerySmall ? 14 : isXSmall ? 16 : isMobile ? 18 : 24,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: isVerySmall ? '0.7rem' : isXSmall ? '0.75rem' : undefined,
                            wordBreak: 'break-word',
                            maxWidth: isVerySmall ? '250px' : isXSmall ? '270px' : 'none',
                          }}
                        >
                          {basicInfo.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isVerySmall || isXSmall ? 'column' : 'row',
                        alignItems: isVerySmall || isXSmall ? 'center' : 'flex-start',
                        mb: isVerySmall ? 0.5 : 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: isVerySmall || isXSmall ? 0.5 : 0,
                        }}
                      >
                        <Phone
                          color="action"
                          sx={{
                            mr: 1,
                            fontSize: isVerySmall ? 14 : isXSmall ? 16 : isMobile ? 18 : 24,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: isVerySmall ? '0.7rem' : isXSmall ? '0.75rem' : undefined,
                          }}
                        >
                          {basicInfo.phone}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: isVerySmall || isXSmall ? 'column' : 'row',
                        alignItems: isVerySmall || isXSmall ? 'center' : 'flex-start',
                        mb: isVerySmall ? 0.5 : 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: isVerySmall || isXSmall ? 0.5 : 0,
                        }}
                      >
                        <LocationOn
                          color="action"
                          sx={{
                            mr: 1,
                            fontSize: isVerySmall ? 14 : isXSmall ? 16 : isMobile ? 18 : 24,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: isVerySmall ? '0.7rem' : isXSmall ? '0.75rem' : undefined,
                          }}
                        >
                          {basicInfo.location}
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>

              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  sx={{
                    mt: isVerySmall ? 1.5 : 2,
                    display: isVerySmall || isXSmall || isMobile ? 'none' : 'flex',
                    width: isVerySmall || isXSmall || isMobile ? 'auto' : '100%',
                    fontSize: isVerySmall ? '0.65rem' : isXSmall ? '0.7rem' : undefined,
                  }}
                  onClick={handleEdit}
                >
                  Редактировать
                </Button>
              ) : (
                <Box
                  sx={{
                    mt: isVerySmall ? 1.5 : 2,
                    display: isVerySmall || isXSmall || isMobile ? 'none' : 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    width: '100%',
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                    sx={{ fontSize: isVerySmall ? '0.65rem' : isXSmall ? '0.7rem' : undefined }}
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={loading}
                    sx={{ fontSize: isVerySmall ? '0.65rem' : isXSmall ? '0.7rem' : undefined }}
                  >
                    Отмена
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Кнопки для мобильных устройств - отдельно от карточки */}
          {(isVerySmall || isXSmall || isMobile) && (
            <Box
              sx={{ mt: isVerySmall ? 1.5 : 2, display: 'flex', flexDirection: 'column', gap: 1 }}
            >
              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  size={isVerySmall || isXSmall ? 'small' : 'medium'}
                  sx={{
                    width: '100%',
                    fontSize: isVerySmall ? '0.65rem' : isXSmall ? '0.7rem' : undefined,
                    py: isVerySmall ? 0.75 : undefined,
                  }}
                  onClick={handleEdit}
                >
                  Редактировать
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                    size={isVerySmall || isXSmall ? 'small' : 'medium'}
                    sx={{
                      width: '100%',
                      fontSize: isVerySmall ? '0.65rem' : isXSmall ? '0.7rem' : undefined,
                      py: isVerySmall ? 0.75 : undefined,
                    }}
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={loading}
                    size={isVerySmall || isXSmall ? 'small' : 'medium'}
                    sx={{
                      width: '100%',
                      fontSize: isVerySmall ? '0.65rem' : isXSmall ? '0.7rem' : undefined,
                      py: isVerySmall ? 0.75 : undefined,
                    }}
                  >
                    Отмена
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ width: '100%' }}>
          <Paper sx={{ p: { xs: isVerySmall ? 0.75 : isXSmall ? 1 : 1.5, sm: 2 } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: isVerySmall ? 0.75 : isXSmall ? 1 : 2,
              }}
            >
              <Typography
                variant={
                  isVerySmall ? 'subtitle2' : isXSmall ? 'body1' : isMobile ? 'subtitle1' : 'h6'
                }
                sx={{
                  fontWeight: isVerySmall || isXSmall ? 'bold' : undefined,
                  fontSize: isVerySmall ? '0.85rem' : undefined,
                }}
              >
                О себе
              </Typography>
            </Box>

            {editing ? (
              <TextField
                fullWidth
                multiline
                rows={isVerySmall ? 2 : isXSmall ? 2 : isMobile ? 3 : 4}
                variant="outlined"
                placeholder="Расскажите о себе"
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleInputChange}
                sx={{
                  mb: isVerySmall ? 0.75 : isXSmall ? 1 : 2,
                  '& .MuiInputBase-input': {
                    fontSize: isVerySmall ? '0.75rem' : isXSmall ? '0.8rem' : undefined,
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: isVerySmall ? '0.75rem' : isXSmall ? '0.8rem' : undefined,
                  },
                }}
              />
            ) : (
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: isVerySmall
                    ? '0.7rem'
                    : isXSmall
                      ? '0.75rem'
                      : isMobile
                        ? '0.9rem'
                        : '1rem',
                  lineHeight: isVerySmall ? 1.2 : isXSmall ? 1.3 : isMobile ? 1.5 : 1.7,
                  mb: isVerySmall ? 0.5 : undefined,
                }}
              >
                {basicInfo.aboutMe}
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Уведомление о результате сохранения */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BasicInfoHr;
