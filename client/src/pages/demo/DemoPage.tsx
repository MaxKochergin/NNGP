// Демо-страница для показа работы mock авторизации
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { selectMockUser } from '../../features/auth/mockAuthSlice';

export const DemoPage = () => {
  const user = useAppSelector(selectMockUser);

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Пользователь не найден. Пожалуйста, войдите в систему.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Добро пожаловать в систему ННГП!
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        Демонстрация работы с локальными данными
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Информация о пользователе */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Информация о пользователе
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Имя:
                </Typography>
                <Typography variant="body1">
                  {user.firstName} {user.lastName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Email:
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Роль:
                </Typography>
                <Chip label={user.role} color="primary" variant="outlined" sx={{ mt: 0.5 }} />
              </Box>

              {user.phone && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Телефон:
                  </Typography>
                  <Typography variant="body1">{user.phone}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Профиль пользователя */}
        {user.profile && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Профиль
                </Typography>

                {user.profile.aboutMe && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      О себе:
                    </Typography>
                    <Typography variant="body1">{user.profile.aboutMe}</Typography>
                  </Box>
                )}

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Специализация:
                  </Typography>
                  <Typography variant="body1">{user.profile.specialization}</Typography>
                </Box>

                {user.profile.specialistLevel && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Уровень:
                    </Typography>
                    <Chip
                      label={user.profile.specialistLevel}
                      color="secondary"
                      variant="outlined"
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                )}

                {user.profile.location && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Местоположение:
                    </Typography>
                    <Typography variant="body1">{user.profile.location}</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Навыки */}
        {user.profile?.skills && user.profile.skills.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Навыки
                </Typography>

                <List>
                  {user.profile.skills.map((skill, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={skill.name}
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Chip label={skill.category} size="small" variant="outlined" />
                            <Typography variant="body2" color="text.secondary">
                              Уровень: {skill.level}/10
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Информация о системе */}
        <Grid item xs={12}>
          <Alert severity="success">
            <Typography variant="body2">
              ✅ Система работает в режиме локальной авторизации
              <br />
              🔐 Данные хранятся в localStorage браузера
              <br />
              🚀 Все функции авторизации работают без backend сервера
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};
