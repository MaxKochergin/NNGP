import { useEffect, useState } from 'react';
import { Cancel, Edit, Email, LocationOn, Phone, Save } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  aboutMe: string;
}

function BasicInfo() {
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    aboutMe: '',
  });
  const [formData, setFormData] = useState<ProfileData>(profileData);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const user = useAppSelector(state => state.auth.user);

  // Загрузка данных профиля
  useEffect(() => {
    // В реальном приложении здесь был бы API запрос
    // Имитируем получение данных с сервера
    const fetchProfileData = async () => {
      // Для демо используем заглушку
      const mockData = {
        firstName: user?.firstName || 'Иван',
        lastName: user?.lastName || 'Иванов',
        email: user?.email || 'candidate1@example.com',
        phone: '+7 999 123-45-67',
        location: 'Москва',
        aboutMe:
          'Опытный специалист в области строительного проектирования с фокусом на конструкции промышленного и гражданского строительства. Активно развиваю навыки в BIM моделировании и программировании.',
      };

      setProfileData(mockData);
      setFormData(mockData);
    };

    fetchProfileData();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setEditing(!editing);
    if (!editing) {
      // При включении режима редактирования копируем данные в форму
      setFormData({ ...profileData });
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({ ...profileData });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // В реальном приложении здесь был бы API запрос для сохранения
      // Имитируем запрос к серверу с задержкой
      await new Promise(resolve => setTimeout(resolve, 800));

      // Обновляем данные профиля
      setProfileData({ ...formData });
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
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          mt: 0,
          ml: 0,
          gap: 2,
        }}
      >
        {/* На мобильных устройствах - одна колонка, на планшетах и десктопах - две */}
        <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 16px)' } }}>
          <Paper
            sx={{
              p: { xs: 1, sm: 2 },
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: isMobile ? 80 : isTablet ? 100 : 120,
                height: isMobile ? 80 : isTablet ? 100 : 120,
                mb: isMobile ? 0 : 2,
                bgcolor: 'primary.main',
                fontSize: isMobile ? 28 : 36,
              }}
              alt={`${profileData.firstName} ${profileData.lastName}`}
              src="/path-to-avatar.jpg" // Замените на реальный путь к аватару
            >
              {profileData.firstName.charAt(0)}
              {profileData.lastName.charAt(0)}
            </Avatar>

            <Box sx={{ flex: 1, width: isMobile ? 'auto' : '100%' }}>
              {editing ? (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Имя"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    size="small"
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Фамилия"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    size="small"
                  />
                </Box>
              ) : (
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  gutterBottom
                  align={isMobile ? 'left' : 'center'}
                >
                  {profileData.firstName} {profileData.lastName}
                </Typography>
              )}

              <Box sx={{ width: '100%', mt: isMobile ? 0 : 2 }}>
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
                        startAdornment: <Email color="action" sx={{ mr: 1, fontSize: 18 }} />,
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
                        startAdornment: <Phone color="action" sx={{ mr: 1, fontSize: 18 }} />,
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
                        startAdornment: <LocationOn color="action" sx={{ mr: 1, fontSize: 18 }} />,
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email color="action" sx={{ mr: 1, fontSize: isMobile ? 18 : 24 }} />
                      <Typography variant="body2">{profileData.email}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone color="action" sx={{ mr: 1, fontSize: isMobile ? 18 : 24 }} />
                      <Typography variant="body2">{profileData.phone}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn color="action" sx={{ mr: 1, fontSize: isMobile ? 18 : 24 }} />
                      <Typography variant="body2">{profileData.location}</Typography>
                    </Box>
                  </>
                )}
              </Box>

              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  sx={{
                    mt: 2,
                    display: isMobile ? 'none' : 'flex',
                    width: isMobile ? 'auto' : '100%',
                  }}
                  onClick={handleEdit}
                >
                  Редактировать
                </Button>
              ) : (
                <Box
                  sx={{
                    mt: 2,
                    display: isMobile ? 'none' : 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Отмена
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Кнопки для мобильных устройств - отдельно от карточки */}
          {isMobile && (
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {!editing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  sx={{ width: '100%' }}
                  onClick={handleEdit}
                >
                  Редактировать
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    sx={{ width: '100%' }}
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    sx={{ width: '100%' }}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Отмена
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>

        <Box sx={{ width: { xs: '100%', md: 'calc(66.67% - 16px)' } }}>
          <Paper sx={{ p: { xs: 1, sm: 2 } }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant={isMobile ? 'subtitle1' : 'h6'}>О себе</Typography>
            </Box>

            {editing ? (
              <TextField
                fullWidth
                multiline
                rows={isMobile ? 3 : 4}
                variant="outlined"
                placeholder="Расскажите о себе"
                name="aboutMe"
                value={formData.aboutMe}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: isMobile ? '0.9rem' : '1rem',
                  lineHeight: isMobile ? 1.5 : 1.7,
                }}
              >
                {profileData.aboutMe}
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

export default BasicInfo;
