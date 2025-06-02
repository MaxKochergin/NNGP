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
}

const EmployeeCard = ({ employee, onClick }: EmployeeCardProps) => {
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
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
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
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
            '& .employee-avatar': {
              transform: 'scale(1.05)',
            },
            '& .employee-name': {
              color: theme.palette.primary.main,
            },
          },
          '&:active': {
            transform: 'translateY(-2px)',
            transition: 'all 0.1s ease',
          },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: {
            xs: isXSmall ? 1 : isVerySmall ? 1.5 : 2,
            sm: 2,
            md: 3,
          },
          border: `1px solid ${theme.palette.divider}`,
          minHeight: {
            xs: isXSmall ? 200 : isVerySmall ? 220 : 240,
            sm: 260,
            md: 280,
            lg: 300,
          },
          // Touch-friendly минимальный размер
          minWidth: { xs: 280, sm: 'auto' },
        }}
        onClick={onClick}
      >
        <CardContent
          sx={{
            p: {
              xs: isXSmall ? 1.5 : isVerySmall ? 2 : 2.5,
              sm: 3,
              md: 3.5,
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
                mb: { xs: 1.5, sm: 2 },
                minHeight: {
                  xs: isXSmall ? 50 : isVerySmall ? 55 : 60,
                  sm: 65,
                  md: 70,
                },
              }}
            >
              <Avatar
                src={employee.avatar || undefined}
                className="employee-avatar"
                sx={{
                  width: {
                    xs: isXSmall ? 40 : isVerySmall ? 45 : 50,
                    sm: 55,
                    md: 60,
                  },
                  height: {
                    xs: isXSmall ? 40 : isVerySmall ? 45 : 50,
                    sm: 55,
                    md: 60,
                  },
                  mr: { xs: 1.5, sm: 2 },
                  bgcolor: theme.palette.primary.main,
                  flexShrink: 0,
                  fontSize: {
                    xs: isXSmall ? '0.9rem' : isVerySmall ? '1rem' : '1.1rem',
                    sm: '1.2rem',
                    md: '1.3rem',
                  },
                  fontWeight: 'bold',
                  transition: 'transform 0.3s ease',
                  boxShadow: theme.shadows[2],
                }}
              >
                {!employee.avatar && getInitials(employee.name)}
              </Avatar>

              <Box sx={{ flexGrow: 1, overflow: 'hidden', minWidth: 0 }}>
                <Tooltip title={employee.name} placement="top" arrow>
                  <Typography
                    variant="h6"
                    component="div"
                    className="employee-name"
                    sx={{
                      fontSize: {
                        xs: isXSmall ? '0.85rem' : isVerySmall ? '0.9rem' : '0.95rem',
                        sm: '1rem',
                        md: '1.1rem',
                      },
                      fontWeight: 'bold',
                      lineHeight: 1.3,
                      mb: 0.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      transition: 'color 0.3s ease',
                      wordBreak: 'break-word',
                    }}
                  >
                    {isXSmall ? truncateText(employee.name, 20) : employee.name}
                  </Typography>
                </Tooltip>

                <Tooltip title={employee.position} placement="top" arrow>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontSize: {
                        xs: isXSmall ? '0.7rem' : isVerySmall ? '0.75rem' : '0.8rem',
                        sm: '0.85rem',
                        md: '0.9rem',
                      },
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      wordBreak: 'break-word',
                    }}
                  >
                    {isXSmall ? truncateText(employee.position, 25) : employee.position}
                  </Typography>
                </Tooltip>
              </Box>
            </Box>

            {/* Статус и отдел */}
            <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
              <Stack
                direction={isXSmall ? 'column' : 'row'}
                spacing={isXSmall ? 0.5 : 1}
                sx={{
                  flexWrap: 'wrap',
                  gap: 0.5,
                  alignItems: isXSmall ? 'flex-start' : 'center',
                }}
              >
                <Chip
                  label={employee.status}
                  color={getStatusColor(employee.status)}
                  size="small"
                  sx={{
                    height: { xs: 22, sm: 24, md: 26 },
                    fontSize: {
                      xs: isXSmall ? '0.65rem' : '0.7rem',
                      sm: '0.75rem',
                      md: '0.8rem',
                    },
                    fontWeight: 'medium',
                    '& .MuiChip-label': {
                      px: { xs: 1, sm: 1.5 },
                    },
                  }}
                />
                <Tooltip title={employee.department} placement="top" arrow>
                  <Chip
                    label={
                      isXSmall
                        ? truncateText(employee.department, 15)
                        : isVerySmall
                          ? truncateText(employee.department, 20)
                          : employee.department
                    }
                    variant="outlined"
                    size="small"
                    sx={{
                      height: { xs: 22, sm: 24, md: 26 },
                      fontSize: {
                        xs: isXSmall ? '0.65rem' : '0.7rem',
                        sm: '0.75rem',
                        md: '0.8rem',
                      },
                      maxWidth: '100%',
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        px: { xs: 1, sm: 1.5 },
                      },
                    }}
                  />
                </Tooltip>
              </Stack>
            </Box>

            {/* Опыт работы */}
            <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Work
                  sx={{
                    fontSize: { xs: 14, sm: 16, md: 18 },
                    color: 'text.secondary',
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: {
                      xs: isXSmall ? '0.7rem' : '0.75rem',
                      sm: '0.8rem',
                      md: '0.85rem',
                    },
                    fontWeight: 'medium',
                  }}
                >
                  Опыт: {employee.experience}
                </Typography>
              </Box>
            </Box>

            {/* Навыки */}
            <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontSize: {
                    xs: isXSmall ? '0.7rem' : '0.75rem',
                    sm: '0.8rem',
                    md: '0.85rem',
                  },
                  fontWeight: 'medium',
                }}
              >
                Навыки:
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  minHeight: {
                    xs: isXSmall ? 45 : 50,
                    sm: 55,
                    md: 60,
                  },
                  overflow: 'hidden',
                }}
              >
                {employee.skills
                  .slice(0, isXSmall ? 2 : isVerySmall ? 3 : 4)
                  .map((skill, index) => (
                    <Tooltip key={index} title={skill} placement="top" arrow>
                      <Chip
                        label={
                          isXSmall
                            ? truncateText(skill, 8)
                            : isVerySmall
                              ? truncateText(skill, 12)
                              : skill
                        }
                        size="small"
                        variant="outlined"
                        sx={{
                          fontSize: {
                            xs: isXSmall ? '0.6rem' : '0.65rem',
                            sm: '0.7rem',
                            md: '0.75rem',
                          },
                          height: { xs: 20, sm: 22, md: 24 },
                          maxWidth: '100%',
                          '& .MuiChip-label': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            px: { xs: 0.5, sm: 1 },
                          },
                          bgcolor: 'background.paper',
                          borderColor: 'primary.light',
                          '&:hover': {
                            bgcolor: 'primary.lighter',
                            borderColor: 'primary.main',
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                {employee.skills.length > (isXSmall ? 2 : isVerySmall ? 3 : 4) && (
                  <Chip
                    label={`+${employee.skills.length - (isXSmall ? 2 : isVerySmall ? 3 : 4)}`}
                    size="small"
                    sx={{
                      fontSize: {
                        xs: isXSmall ? '0.6rem' : '0.65rem',
                        sm: '0.7rem',
                        md: '0.75rem',
                      },
                      height: { xs: 20, sm: 22, md: 24 },
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '& .MuiChip-label': {
                        px: { xs: 0.5, sm: 1 },
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Дата приема (внизу) */}
          <Box
            sx={{
              mt: 'auto',
              pt: { xs: 1, sm: 1.5 },
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday
                sx={{
                  fontSize: { xs: 12, sm: 14, md: 16 },
                  color: 'text.secondary',
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: {
                    xs: isXSmall ? '0.65rem' : '0.7rem',
                    sm: '0.75rem',
                    md: '0.8rem',
                  },
                  fontWeight: 'medium',
                }}
              >
                Принят: {formatDate(employee.hireDate)}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        {/* Индикатор активности */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 8, sm: 12 },
            right: { xs: 8, sm: 12 },
            width: { xs: 8, sm: 10 },
            height: { xs: 8, sm: 10 },
            borderRadius: '50%',
            bgcolor:
              employee.status === 'Работает'
                ? 'success.main'
                : employee.status === 'Отпуск'
                  ? 'info.main'
                  : employee.status === 'Больничный'
                    ? 'warning.main'
                    : 'grey.400',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
          }}
        />
      </Card>
    </Fade>
  );
};

export default EmployeeCard;
