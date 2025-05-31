import { useState } from 'react';
import {
  Add as AddIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Save as SaveIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';

// Типы пользователей
type UserRole = 'admin' | 'hr' | 'employee' | 'candidate';

// Интерфейс для пользователя
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  status: 'active' | 'inactive' | 'blocked';
  lastLogin?: string;
}

// Интерфейс для формы пользователя
interface UserFormData {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'inactive' | 'blocked';
  password?: string;
  confirmPassword?: string;
}

// Интерфейс для уведомления
interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

// Моковые данные пользователей
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Смирнов Дмитрий Константинович',
    email: 'smirnov@example.com',
    role: 'employee',
    department: 'Конструкторский отдел',
    status: 'active',
    lastLogin: '2025-04-10 14:32',
  },
  {
    id: '2',
    name: 'Петрова Анна Сергеевна',
    email: 'petrova@example.com',
    role: 'hr',
    department: 'HR-отдел',
    status: 'active',
    lastLogin: '2025-04-11 09:15',
  },
  {
    id: '3',
    name: 'Сидоров Алексей Петрович',
    email: 'sidorov@example.com',
    role: 'employee',
    department: 'Управление проектами',
    status: 'active',
    lastLogin: '2025-04-09 16:45',
  },
  {
    id: '4',
    name: 'Козлова Екатерина Владимировна',
    email: 'kozlova@example.com',
    role: 'employee',
    department: 'Архитектурный отдел',
    status: 'inactive',
    lastLogin: '2025-03-28 11:20',
  },
  {
    id: '5',
    name: 'Соколов Дмитрий Александрович',
    email: 'sokolov@example.com',
    role: 'employee',
    department: 'BIM-отдел',
    status: 'active',
    lastLogin: '2025-04-10 10:05',
  },
  {
    id: '6',
    name: 'Смирнов Максим Алексеевич',
    email: 'smirnov@example.com',
    role: 'candidate',
    status: 'active',
    lastLogin: '2025-04-05 15:30',
  },
  {
    id: '7',
    name: 'Новикова Екатерина Владимировна',
    email: 'novikova@example.com',
    role: 'candidate',
    status: 'inactive',
    lastLogin: '2025-03-25 12:10',
  },
  {
    id: '8',
    name: 'Кузнецов Андрей Сергеевич',
    email: 'kuznetsov@example.com',
    role: 'employee',
    department: 'BIM-отдел',
    status: 'blocked',
    lastLogin: '2025-02-15 09:45',
  },
  {
    id: '9',
    name: 'Васильев Павел Михайлович',
    email: 'vasiliev@example.com',
    role: 'admin',
    department: 'IT-отдел',
    status: 'active',
    lastLogin: '2025-04-11 08:30',
  },
  {
    id: '10',
    name: 'Михайлова Ольга Сергеевна',
    email: 'mikhailova@example.com',
    role: 'hr',
    department: 'HR-отдел',
    status: 'active',
    lastLogin: '2025-04-10 16:20',
  },
  {
    id: '11',
    name: 'Королев Сергей Алексеевич',
    email: 'korolev@example.com',
    role: 'admin',
    department: 'Руководство',
    status: 'active',
    lastLogin: '2025-04-12 10:45',
  },
];

// Функция для получения цвета на основе роли пользователя
const getRoleColor = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'error';
    case 'hr':
      return 'secondary';
    case 'employee':
      return 'primary';
    case 'candidate':
      return 'info';
    default:
      return 'default';
  }
};

// Функция для получения названия роли на русском
const getRoleName = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'Администратор';
    case 'hr':
      return 'HR-специалист';
    case 'employee':
      return 'Сотрудник';
    case 'candidate':
      return 'Кандидат';
    default:
      return role;
  }
};

// Функция для получения цвета на основе статуса пользователя
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'warning';
    case 'blocked':
      return 'error';
    default:
      return 'default';
  }
};

// Функция для получения названия статуса на русском
const getStatusName = (status: string) => {
  switch (status) {
    case 'active':
      return 'Активен';
    case 'inactive':
      return 'Неактивен';
    case 'blocked':
      return 'Заблокирован';
    default:
      return status;
  }
};

const UsersList = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Новые состояния
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'employee',
    department: '',
    status: 'active',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof UserFormData, string>>>({});
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Обработчик закрытия уведомления
  const handleCloseNotification = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({ ...notification, open: false });
  };

  // Обработчик изменения страницы
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Обработчик изменения количества строк на странице
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Обработчики для диалога удаления
  const handleOpenDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      // В реальном приложении здесь был бы API-запрос
      setUsers(users.filter(user => user.id !== selectedUser.id));

      // Показать уведомление
      setNotification({
        open: true,
        message: `Пользователь ${selectedUser.name} успешно удален`,
        severity: 'success',
      });
    }
    handleCloseDeleteDialog();
  };

  // Обработчик для открытия диалога добавления пользователя
  const handleOpenAddDialog = () => {
    setFormData({
      name: '',
      email: '',
      role: 'employee',
      department: '',
      status: 'active',
      password: '',
      confirmPassword: '',
    });
    setFormErrors({});
    setAddDialogOpen(true);
  };

  // Обработчик для закрытия диалога добавления пользователя
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  // Обработчик для редактирования пользователя
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
      status: user.status,
    });
    setFormErrors({});
    setEditDialogOpen(true);
  };

  // Обработчик для закрытия диалога редактирования
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  // Обработчик изменения полей формы
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Очистить ошибку поля при изменении
    if (formErrors[name as keyof UserFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Обработчик изменения выпадающего списка
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Валидация формы
  const validateForm = (isAdd: boolean): boolean => {
    const errors: Partial<Record<keyof UserFormData, string>> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Укажите ФИО';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Укажите email';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Некорректный формат email';
      isValid = false;
    }

    if (isAdd) {
      if (!formData.password) {
        errors.password = 'Введите пароль';
        isValid = false;
      } else if (formData.password.length < 6) {
        errors.password = 'Пароль должен содержать минимум 6 символов';
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Пароли не совпадают';
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  // Обработчик сохранения нового пользователя
  const handleAddUser = () => {
    if (validateForm(true)) {
      // Генерируем уникальный ID
      const newId = (Math.max(...users.map(user => parseInt(user.id))) + 1).toString();

      // Создаем нового пользователя
      const newUser: User = {
        id: newId,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department || undefined,
        status: formData.status,
        lastLogin: new Date().toLocaleString('ru-RU'),
      };

      // Добавляем пользователя в список
      setUsers([...users, newUser]);

      // Закрываем диалог
      handleCloseAddDialog();

      // Показываем уведомление
      setNotification({
        open: true,
        message: `Пользователь ${newUser.name} успешно добавлен`,
        severity: 'success',
      });
    }
  };

  // Обработчик сохранения изменений пользователя
  const handleSaveUser = () => {
    if (validateForm(false)) {
      // Обновляем пользователя в списке
      setUsers(
        users.map(user =>
          user.id === formData.id
            ? {
                ...user,
                name: formData.name,
                email: formData.email,
                role: formData.role,
                department: formData.department || undefined,
                status: formData.status,
              }
            : user
        )
      );

      // Закрываем диалог
      handleCloseEditDialog();

      // Показываем уведомление
      setNotification({
        open: true,
        message: `Пользователь ${formData.name} успешно обновлен`,
        severity: 'success',
      });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Управление пользователями системы
      </Typography>

      <Paper sx={{ width: '100%', overflow: 'hidden', mt: 3 }}>
        <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
            <TextField
              variant="outlined"
              placeholder="Поиск по имени, email или отделу"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              size="small"
              sx={{ flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Роль</InputLabel>
              <Select value={roleFilter} label="Роль" onChange={e => setRoleFilter(e.target.value)}>
                <MenuItem value="all">Все роли</MenuItem>
                <MenuItem value="admin">Администраторы</MenuItem>
                <MenuItem value="hr">HR-специалисты</MenuItem>
                <MenuItem value="employee">Сотрудники</MenuItem>
                <MenuItem value="candidate">Кандидаты</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Статус</InputLabel>
              <Select
                value={statusFilter}
                label="Статус"
                onChange={e => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Все статусы</MenuItem>
                <MenuItem value="active">Активные</MenuItem>
                <MenuItem value="inactive">Неактивные</MenuItem>
                <MenuItem value="blocked">Заблокированные</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ whiteSpace: 'nowrap' }}
              onClick={handleOpenAddDialog}
            >
              Добавить пользователя
            </Button>
          </Stack>
        </Toolbar>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="Таблица пользователей">
            <TableHead>
              <TableRow>
                <TableCell>Имя</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Роль</TableCell>
                <TableCell>Отдел</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Последний вход</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(user => (
                  <TableRow hover key={user.id}>
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={getRoleName(user.role)}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.department || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusName(user.status)}
                        color={getStatusColor(user.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{user.lastLogin || '—'}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Редактировать">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditUser(user)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDeleteDialog(user)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Пользователи не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
        />
      </Paper>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы уверены, что хотите удалить пользователя {selectedUser?.name}? Это действие нельзя
            будет отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог добавления пользователя */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AddIcon sx={{ mr: 1 }} />
            Добавление нового пользователя
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="ФИО"
                fullWidth
                value={formData.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleFormChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Роль</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Роль"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="admin">Администратор</MenuItem>
                  <MenuItem value="hr">HR-специалист</MenuItem>
                  <MenuItem value="employee">Сотрудник</MenuItem>
                  <MenuItem value="candidate">Кандидат</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Статус"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="active">Активен</MenuItem>
                  <MenuItem value="inactive">Неактивен</MenuItem>
                  <MenuItem value="blocked">Заблокирован</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="department"
                label="Отдел"
                fullWidth
                value={formData.department}
                onChange={handleFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Пароль"
                type="password"
                fullWidth
                value={formData.password}
                onChange={handleFormChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="confirmPassword"
                label="Подтверждение пароля"
                type="password"
                fullWidth
                value={formData.confirmPassword}
                onChange={handleFormChange}
                error={!!formErrors.confirmPassword}
                helperText={formErrors.confirmPassword}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Отмена</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleAddUser}
          >
            Создать пользователя
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования пользователя */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EditIcon sx={{ mr: 1 }} />
            Редактирование пользователя
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="ФИО"
                fullWidth
                value={formData.name}
                onChange={handleFormChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleFormChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Роль</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Роль"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="admin">Администратор</MenuItem>
                  <MenuItem value="hr">HR-специалист</MenuItem>
                  <MenuItem value="employee">Сотрудник</MenuItem>
                  <MenuItem value="candidate">Кандидат</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Статус"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="active">Активен</MenuItem>
                  <MenuItem value="inactive">Неактивен</MenuItem>
                  <MenuItem value="blocked">Заблокирован</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="department"
                label="Отдел"
                fullWidth
                value={formData.department}
                onChange={handleFormChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Отмена</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveUser}
          >
            Сохранить изменения
          </Button>
        </DialogActions>
      </Dialog>

      {/* Снэкбар для уведомлений */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersList;
