import { Person as PersonIcon } from '@mui/icons-material';
import { Avatar, Box, Card, CardContent, Chip, Stack, Typography, useTheme } from '@mui/material';
import { Employee } from './EmployeesList';

interface EmployeeCardProps {
  employee: Employee;
  onClick: () => void;
}

const EmployeeCard = ({ employee, onClick }: EmployeeCardProps) => {
  const theme = useTheme();

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

  return (
    <Card
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
        },
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: 1, sm: 2 },
      }}
      onClick={onClick}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 3 },
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
              alignItems: 'center',
              mb: 2,
              height: { xs: 48, sm: 56 },
            }}
          >
            <Avatar
              src={employee.avatar || undefined}
              sx={{
                width: { xs: 46, sm: 52 },
                height: { xs: 46, sm: 52 },
                mr: 2,
                bgcolor: theme.palette.primary.main,
                flexShrink: 0,
              }}
            >
              {!employee.avatar && <PersonIcon />}
            </Avatar>
            <Box sx={{ flexGrow: 1, overflow: 'hidden', maxWidth: '70%' }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.4,
                  height: { xs: 22, sm: 24 },
                }}
              >
                {employee.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 0.5,
                  fontSize: { xs: '0.75rem', sm: '0.8rem' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: 1.4,
                  height: { xs: 20, sm: 22 },
                }}
              >
                {employee.position}
              </Typography>
            </Box>
          </Box>

          {/* Статус и отдел */}
          <Box sx={{ height: { xs: 28, sm: 32 }, mb: 1, minHeight: 28 }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                flexWrap: 'wrap',
                gap: 0.5,
              }}
            >
              <Chip
                label={employee.status}
                color={getStatusColor(employee.status)}
                size="small"
                sx={{ height: 24, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
              />
              <Chip
                label={employee.department}
                variant="outlined"
                size="small"
                sx={{
                  height: 24,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  maxWidth: '100%',
                  '.MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }}
              />
            </Stack>
          </Box>

          {/* Навыки */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              lineHeight: 1,
            }}
          >
            Навыки:
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              mb: 2,
              height: { xs: 56, sm: 60 },
              minHeight: { xs: 56, sm: 60 },
              overflow: 'hidden',
            }}
          >
            {employee.skills.slice(0, 3).map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: { xs: '0.65rem', sm: '0.7rem' },
                  height: 24,
                  maxWidth: '100%',
                  '.MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }}
              />
            ))}
            {employee.skills.length > 3 && (
              <Chip
                label={`+${employee.skills.length - 3}`}
                size="small"
                sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, height: 24 }}
              />
            )}
          </Box>
        </Box>

        {/* Дата приема (внизу) */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            textAlign: 'right',
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            borderTop: '1px solid',
            borderColor: 'divider',
            pt: 1,
            mt: 'auto',
            height: 24,
          }}
        >
          Дата приема: {formatDate(employee.hireDate)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
