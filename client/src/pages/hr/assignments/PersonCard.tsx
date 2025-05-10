import AssignmentIcon from '@mui/icons-material/Assignment';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { AssignmentType, PersonType } from './AssignmentDashboard';

interface Person {
  id: string;
  name: string;
  position?: string;
  department?: string;
  photo?: string;
}

interface PersonCardProps {
  person: Person;
  personType: PersonType;
  onAssign: (person: Person, type: AssignmentType) => void;
}

const PersonCard = ({ person, personType, onAssign }: PersonCardProps) => {
  const theme = useTheme();

  // Получаем инициалы для аватара, если нет фото
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={person.photo}
            alt={person.name}
            sx={{
              width: 56,
              height: 56,
              bgcolor: person.photo ? 'transparent' : theme.palette.primary.main,
            }}
          >
            {!person.photo && getInitials(person.name)}
          </Avatar>
        }
        title={
          <Typography variant="h6" component="div" noWrap>
            {person.name}
          </Typography>
        }
        subheader={person.position}
      />

      <Divider />

      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          {person.department && (
            <Typography variant="body2" color="text.secondary">
              <strong>Отдел:</strong> {person.department}
            </Typography>
          )}
          {personType === 'employee' && (
            <Typography variant="body2" color="text.secondary">
              <strong>Статус:</strong> Активный
            </Typography>
          )}
          {personType === 'candidate' && (
            <Typography variant="body2" color="text.secondary">
              <strong>Статус:</strong> В процессе рассмотрения
            </Typography>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Stack spacing={1} width="100%">
          <Button
            variant="outlined"
            startIcon={<AssignmentIcon />}
            fullWidth
            onClick={() => onAssign(person, 'test')}
          >
            Назначить тест
          </Button>

          {personType === 'employee' && (
            <Button
              variant="outlined"
              startIcon={<MenuBookIcon />}
              fullWidth
              onClick={() => onAssign(person, 'material')}
              color="secondary"
            >
              Назначить материал
            </Button>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default PersonCard;
