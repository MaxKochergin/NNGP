import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import AssignmentModal from './AssignmentModal';
import PersonsGrid from './PersonsGrid';

// Типы для назначений
interface Person {
  id: string;
  name: string;
  position?: string;
  department?: string;
  photo?: string;
}

export type AssignmentType = 'test' | 'material';
export type PersonType = 'employee' | 'candidate';

const AssignmentDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isVerySmall = useMediaQuery('(max-width:375px)');

  // Состояние для управления активной вкладкой (сотрудники/кандидаты)
  const [activeTab, setActiveTab] = useState<PersonType>('employee');

  // Состояние для хранения выбранного человека
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Состояние для отображения модального окна назначения
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  // Состояние для выбора типа назначения (тест/материал)
  const [assignmentType, setAssignmentType] = useState<AssignmentType>('test');

  const handleTabChange = (_: React.SyntheticEvent, newValue: PersonType) => {
    setActiveTab(newValue);
  };

  const handleAssign = (person: Person, type: AssignmentType) => {
    setSelectedPerson(person);
    setAssignmentType(type);
    setAssignModalOpen(true);
  };

  const handleCloseModal = () => {
    setAssignModalOpen(false);
  };

  const handleConfirmAssignment = (assignedItems: string[]) => {
    // В реальном приложении здесь будет логика сохранения назначения в базу данных
    console.log(`Назначено для ${selectedPerson?.name}:`, assignedItems);

    // Мокап сообщения об успешном назначении
    alert(
      `Успешно назначено для ${selectedPerson?.name}: ${assignedItems.length} ${
        assignmentType === 'test' ? 'тестов' : 'учебных материалов'
      }`
    );

    setAssignModalOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: { xs: 0, sm: 1 } }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          component="h1"
          gutterBottom
          sx={{
            fontSize: {
              xs: isVerySmall ? '1.1rem' : '1.5rem',
              sm: '2rem',
            },
            mb: { xs: isVerySmall ? 1.5 : 2, sm: 2 },
          }}
        >
          Назначение материалов
        </Typography>

        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: { xs: isVerySmall ? 2 : 3, sm: 3 },
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Выбор типа пользователей"
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{
              '& .MuiTab-root': {
                minWidth: {
                  xs: isVerySmall ? 100 : 120,
                  sm: 140,
                },
                fontSize: {
                  xs: isVerySmall ? '0.8rem' : '0.875rem',
                  sm: '1rem',
                },
                fontWeight: 500,
                textTransform: 'none',
                px: {
                  xs: isVerySmall ? 1.5 : 2,
                  sm: 3,
                },
                py: {
                  xs: isVerySmall ? 1.25 : 1.5,
                  sm: 2,
                },
                '&.Mui-selected': {
                  fontWeight: 600,
                },
              },
              '& .MuiTabs-indicator': {
                height: isVerySmall ? 2 : 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab label="Сотрудники" value="employee" />
            <Tab label="Кандидаты" value="candidate" />
          </Tabs>
        </Box>

        {/* Сетка с карточками людей */}
        <PersonsGrid personType={activeTab} onAssign={handleAssign} />
      </Paper>

      {/* Модальное окно для назначения */}
      {selectedPerson && (
        <AssignmentModal
          open={assignModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmAssignment}
          person={selectedPerson}
          personType={activeTab}
          assignmentType={assignmentType}
        />
      )}
    </Container>
  );
};

export default AssignmentDashboard;
