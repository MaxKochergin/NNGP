import { CalendarToday, Email, Person as PersonIcon, Phone, Work } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Fade,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Employee } from './EmployeesList';

interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
  onDelete?: (employeeId: string) => void;
}

const EmployeeCard = ({ employee, onClick, onDelete }: EmployeeCardProps) => {
  const theme = useTheme();

  // Расширенные breakpoints для лучшей адаптивности
  const isXSmall = useMediaQuery('(max-width:320px)');
  const isVerySmall = useMediaQuery('(max-width:375px)');
  const isSmall = useMediaQuery('(max-width:480px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'работает':
        return 'success';
      case 'отпуск':
        return 'info';
      case 'больничный':
        return 'warning';
      case 'удаленная работа':
        return 'secondary';
      case 'командировка':
        return 'primary';
      case 'уволен':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isMobile) {
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    }
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Получаем инициалы для аватара
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
    }
    return name.charAt(0);
  };

  // Сокращаем длинные названия для маленьких экранов
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  // Сокращаем имя для мобильных
  const getDisplayName = (name: string) => {
    if (!name) return '';
    if (!isMobile) return name;

    const parts = name.split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1].charAt(0)}.${parts[2] ? ` ${parts[2].charAt(0)}.` : ''}`;
    } else if (parts.length === 2 && isXSmall) {
      return `${parts[0]} ${parts[1].charAt(0)}.`;
    }
    return name;
  };

  // Добавляем обработчик для быстрого звонка на мобильных
  const handlePhoneClick = (event: React.MouseEvent, phone: string) => {
    if (isMobile) {
      event.stopPropagation();
      window.location.href = `tel:${phone.replace(/[^\d+]/g, '')}`;
    }
  };

  // Добавляем обработчик для быстрой отправки email на мобильных
  const handleEmailClick = (event: React.MouseEvent, email: string) => {
    if (isMobile) {
      event.stopPropagation();
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'translateY(0)',
          '&:hover': {
            transform: { xs: 'translateY(-2px)', sm: 'translateY(-4px)' },
            boxShadow: { xs: theme.shadows[4], sm: theme.shadows[8] },
            '& .employee-avatar': {
              transform: 'scale(1.05)',
            },
            '& .employee-name': {
              color: theme.palette.primary.main,
            },
          },
          '&:active': {
            transform: 'translateY(-1px)',
            transition: 'all 0.1s ease',
          },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: {
            xs: 2,
            sm: 2,
            md: 3,
          },
          border: `1px solid ${theme.palette.divider}`,
          minHeight: {
            xs: 150, // Уменьшаем минимальную высоту для мобильных
            sm: 220,
            md: 260,
            lg: 280,
          },
          // Touch-friendly минимальный размер
          minWidth: { xs: '100%', sm: 'auto' }, // На мобильных занимаем всю ширину
          // Градиентная тень для более современного вида
          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          boxShadow: {
            xs: theme.shadows[2],
            sm: theme.shadows[3],
          },
        }}
        onClick={onClick}
      >
        <CardContent
          sx={{
            p: {
              xs: isXSmall ? 1.25 : 1.75, // Уменьшаем отступы для очень маленьких экранов
              sm: 2.5,
              md: 3,
            },
            pb: '16px !important',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          {/* Верхняя часть с аватаром и именем */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                mb: { xs: 1, sm: 2 }, // Уменьшаем отступ для мобильных
                minHeight: {
                  xs: 45, // Уменьшаем для мобильных
                  sm: 60,
                  md: 65,
                },
              }}
            >
              <Avatar
                src={employee.avatar || undefined}
                className="employee-avatar"
                sx={{
                  width: {
                    xs: isXSmall ? 36 : 40, // Меньший размер для очень маленьких экранов
                    sm: 50,
                    md: 56,
                  },
                  height: {
                    xs: isXSmall ? 36 : 40,
                    sm: 50,
                    md: 56,
                  },
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  fontSize: {
                    xs: isXSmall ? '0.9rem' : '1rem',
                    sm: '1.25rem',
                    md: '1.5rem',
                  },
                  fontWeight: 'bold',
                  transition: 'transform 0.3s ease',
                  flexShrink: 0,
                  mr: { xs: 1.5, sm: 2 },
                  border: `2px solid ${theme.palette.background.paper}`,
                  boxShadow: theme.shadows[2],
                }}
              >
                {!employee.avatar && getInitials(employee.name || '')}
              </Avatar>

              <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Typography
                  variant="h6"
                  className="employee-name"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: {
                      xs: isXSmall ? '0.85rem' : '0.95rem',
                      sm: '1.1rem',
                      md: '1.25rem',
                    },
                    lineHeight: {
                      xs: 1.2,
                      sm: 1.3,
                    },
                    mb: { xs: 0.5, sm: 0.75 },
                    transition: 'color 0.3s ease',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getDisplayName(employee.name || '')}
                </Typography>

                <Chip
                  label={employee.status || 'Статус не указан'}
                  color={getStatusColor(employee.status || '') as any}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    fontSize: {
                      xs: isXSmall ? '0.65rem' : '0.7rem',
                      sm: '0.75rem',
                    },
                    height: {
                      xs: isXSmall ? 20 : 24,
                      sm: 28,
                    },
                    '& .MuiChip-label': {
                      px: { xs: 0.75, sm: 1 },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Статус и отдел */}
            <Box sx={{ mb: { xs: 1, sm: 2 } }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 0.5, sm: 1 }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
              >
                <Tooltip title={employee.department} placement="top" arrow>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: 'text.secondary',
                    }}
                  >
                    <Work sx={{ fontSize: { xs: isXSmall ? 10 : 12, sm: 14 } }} />
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: {
                          xs: isXSmall ? '0.6rem' : '0.65rem',
                          sm: '0.7rem',
                          md: '0.75rem',
                        },
                        fontWeight: 'medium',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: { xs: isXSmall ? 100 : 120, sm: 'none' },
                      }}
                    >
                      {isMobile
                        ? truncateText(employee.department, isXSmall ? 12 : 15)
                        : employee.department}
                    </Typography>
                  </Box>
                </Tooltip>
              </Stack>
            </Box>

            {/* Контактная информация для мобильных */}
            {isMobile && employee.phone && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  gap: 0.5,
                  color: theme.palette.primary.main,
                  '&:active': {
                    opacity: 0.7,
                  },
                }}
                onClick={e => handlePhoneClick(e, employee.phone)}
              >
                <Phone sx={{ fontSize: isXSmall ? 14 : 16 }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: isXSmall ? '0.65rem' : '0.7rem',
                    fontWeight: 'medium',
                  }}
                >
                  {employee.phone}
                </Typography>
              </Box>
            )}

            {/* Навыки - показываем меньше на мобильных */}
            {employee.skills && employee.skills.length > 0 && (
              <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
                {!isXSmall && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      mb: 0.5,
                      fontSize: {
                        xs: '0.65rem',
                        sm: '0.7rem',
                        md: '0.75rem',
                      },
                      fontWeight: 'medium',
                      display: 'block',
                    }}
                  >
                    Навыки:
                  </Typography>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 0.5,
                    minHeight: {
                      xs: isXSmall ? 20 : 30, // Уменьшаем для мобильных
                      sm: 45,
                      md: 50,
                    },
                    overflow: 'hidden',
                  }}
                >
                  {employee.skills.slice(0, isXSmall ? 2 : isMobile ? 3 : 4).map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: {
                          xs: isXSmall ? '0.55rem' : '0.6rem',
                          sm: '0.65rem',
                          md: '0.7rem',
                        },
                        height: { xs: isXSmall ? 16 : 18, sm: 20, md: 22 },
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.primary.light,
                        color: theme.palette.primary.main,
                        '& .MuiChip-label': {
                          px: { xs: 0.5, sm: 1 },
                        },
                      }}
                    />
                  ))}

                  {employee.skills.length > (isXSmall ? 2 : isMobile ? 3 : 4) && (
                    <Chip
                      label={`+${employee.skills.length - (isXSmall ? 2 : isMobile ? 3 : 4)}`}
                      size="small"
                      sx={{
                        fontSize: {
                          xs: isXSmall ? '0.55rem' : '0.6rem',
                          sm: '0.65rem',
                          md: '0.7rem',
                        },
                        height: { xs: isXSmall ? 16 : 18, sm: 20, md: 22 },
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        fontWeight: 'bold',
                        '& .MuiChip-label': {
                          px: { xs: 0.5, sm: 1 },
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>

          {/* Дата приема (внизу) */}
          <Box
            sx={{
              mt: 'auto',
              pt: { xs: 0.5, sm: 1.5 },
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday
                sx={{
                  fontSize: { xs: isXSmall ? 10 : 12, sm: 14, md: 16 },
                  color: 'text.secondary',
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: isXSmall ? '0.6rem' : '0.65rem',
                    sm: '0.7rem',
                    md: '0.75rem',
                  },
                  fontWeight: 'medium',
                }}
              >
                {isXSmall
                  ? formatDate(employee.hireDate).substring(0, 5)
                  : formatDate(employee.hireDate)}
              </Typography>
            </Box>

            {/* Добавляем индикатор свайпа для мобильных */}
            {isMobile && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: isXSmall ? '0.55rem' : '0.6rem',
                  color: 'text.disabled',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                нажмите для деталей
              </Typography>
            )}
          </Box>
        </CardContent>

        {/* Индикатор активности */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 12, sm: 16 },
            right: { xs: 12, sm: 16 },
            width: { xs: isXSmall ? 6 : 8, sm: 10 },
            height: { xs: isXSmall ? 6 : 8, sm: 10 },
            borderRadius: '50%',
            bgcolor:
              employee.status.toLowerCase() === 'работает'
                ? 'success.main'
                : employee.status.toLowerCase() === 'отпуск'
                  ? 'info.main'
                  : employee.status.toLowerCase() === 'больничный'
                    ? 'warning.main'
                    : 'grey.400',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            animation: employee.status.toLowerCase() === 'работает' ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.7,
              },
              '100%': {
                opacity: 1,
              },
            },
          }}
        />
      </Card>
    </Fade>
  );
};

export default EmployeeCard;
