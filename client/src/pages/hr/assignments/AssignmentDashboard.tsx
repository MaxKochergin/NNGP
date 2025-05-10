import { useState } from 'react';
import { Box, Button, Container, Paper, Tab, Tabs, Typography, useTheme } from '@mui/material';
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
        <Typography variant="h4" component="h1" gutterBottom>
          Назначение материалов
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="Выбор типа пользователей">
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
