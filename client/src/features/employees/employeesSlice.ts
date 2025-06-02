import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

// Базовая информация о сотруднике
export interface EmployeeBasicInfo {
  id: string;
  name: string;
  position: string;
  department: string;
  experience: string;
  status: string;
  hireDate: string;
  skills: string[];
  avatar?: string | null;
  email?: string;
  phone?: string;
  salary?: string;
  location?: string;
  lastActivity: string;
}

// Образование сотрудника
export interface EmployeeEducation {
  id: string;
  degree: string;
  specialty: string;
  university: string;
  year: string;
  description?: string;
}

// Опыт работы сотрудника
export interface EmployeeWorkExperience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
}

// Сертификаты сотрудника
export interface EmployeeCertification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  validUntil?: string;
  description?: string;
}

// Проекты сотрудника
export interface EmployeeProject {
  id: string;
  name: string;
  role: string;
  period: string;
  description: string;
}

// Оценки сотрудника
export interface EmployeeEvaluation {
  id: string;
  date: string;
  title: string;
  rating: number;
  description: string;
  evaluator: string;
}

// Заметки о сотруднике
export interface EmployeeNote {
  id: string;
  date: string;
  text: string;
  author: string;
}

// Обучение сотрудника
export interface EmployeeTraining {
  id: string;
  title: string;
  provider: string;
  date: string;
  duration: string;
  certificate: boolean;
  description?: string;
}

// Детальная информация о сотруднике
export interface EmployeeDetailed extends EmployeeBasicInfo {
  birthDate?: string;
  education: EmployeeEducation[];
  workExperience: EmployeeWorkExperience[];
  certifications: EmployeeCertification[];
  projects: EmployeeProject[];
  evaluations: EmployeeEvaluation[];
  notes: EmployeeNote[];
  training: EmployeeTraining[];
}

// Фильтры для сотрудников
export interface EmployeeFilters {
  status: string;
  department: string;
  position: string;
  experience: string;
  hirePeriod: string;
  skills: string[];
}

// Статистика сотрудников
export interface EmployeeStatistics {
  total: number;
  byStatus: Record<string, number>;
  byDepartment: Record<string, number>;
  byPosition: Record<string, number>;
  averageExperience: number;
  recentHires: number;
}

// Состояние slice
interface EmployeesState {
  // Данные
  employees: EmployeeBasicInfo[];
  selectedEmployee: EmployeeDetailed | null;
  statistics: EmployeeStatistics | null;

  // Состояния загрузки
  isLoading: boolean;
  isLoadingDetails: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Ошибки
  error: string | null;
  detailsError: string | null;

  // Поиск и фильтрация
  searchQuery: string;
  filters: EmployeeFilters;
  filtersOpen: boolean;

  // Метаданные
  lastUpdated: string | null;
}

// Начальное состояние
const initialState: EmployeesState = {
  // Данные
  employees: [
    {
      id: '1',
      name: 'Смирнов Дмитрий Константинович',
      position: 'Ведущий инженер-конструктор',
      department: 'Конструкторский отдел',
      experience: '5 лет',
      status: 'Работает',
      hireDate: '2020-04-15',
      skills: ['AutoCAD', 'Revit', 'ЛИРА-САПР', 'Железобетонные конструкции'],
      avatar: null,
      email: 'smirnov@example.com',
      phone: '+7 (999) 123-45-67',
      salary: '180 000 руб.',
      location: 'Москва',
      lastActivity: '2025-04-15',
    },
    {
      id: '2',
      name: 'Соловьева Мария Андреевна',
      position: 'Инженер-проектировщик ОВиК',
      department: 'Отдел инженерных систем',
      experience: '3 года',
      status: 'Работает',
      hireDate: '2022-04-10',
      skills: ['AutoCAD', 'Revit MEP', 'Расчет систем вентиляции'],
      avatar: null,
      email: 'solovyeva@example.com',
      phone: '+7 (999) 234-56-78',
      salary: '150 000 руб.',
      location: 'Москва',
      lastActivity: '2025-04-14',
    },
    {
      id: '3',
      name: 'Николаев Алексей Викторович',
      position: 'Главный инженер проекта',
      department: 'Управление проектами',
      experience: '8 лет',
      status: 'Работает',
      hireDate: '2017-11-03',
      skills: ['BIM', 'Управление проектами', 'Нормативная документация', 'Техническая экспертиза'],
      avatar: null,
      email: 'nikolaev@example.com',
      phone: '+7 (999) 345-67-89',
      salary: '250 000 руб.',
      location: 'Москва',
      lastActivity: '2025-04-13',
    },
    {
      id: '4',
      name: 'Белова Екатерина Николаевна',
      position: 'Главный архитектор',
      department: 'Архитектурный отдел',
      experience: '7 лет',
      status: 'Отпуск',
      hireDate: '2018-01-15',
      skills: ['ArchiCAD', 'Revit', '3D моделирование', 'Концептуальное проектирование'],
      avatar: null,
      email: 'belova@example.com',
      phone: '+7 (999) 456-78-90',
      salary: '220 000 руб.',
      location: 'Москва',
      lastActivity: '2025-04-10',
    },
    {
      id: '5',
      name: 'Кузнецов Виталий Александрович',
      position: 'BIM-координатор',
      department: 'BIM-отдел',
      experience: '4 года',
      status: 'Работает',
      hireDate: '2021-02-20',
      skills: ['Revit', 'Navisworks', 'BIM-координация', 'Autodesk BIM 360'],
      avatar: null,
      email: 'kuznetsov@example.com',
      phone: '+7 (999) 567-89-01',
      salary: '190 000 руб.',
      location: 'Москва',
      lastActivity: '2025-04-12',
    },
  ],
  selectedEmployee: null,
  statistics: {
    total: 5,
    byStatus: {
      Работает: 4,
      Отпуск: 1,
    },
    byDepartment: {
      'Конструкторский отдел': 1,
      'Отдел инженерных систем': 1,
      'Управление проектами': 1,
      'Архитектурный отдел': 1,
      'BIM-отдел': 1,
    },
    byPosition: {
      'Ведущий инженер-конструктор': 1,
      'Инженер-проектировщик ОВиК': 1,
      'Главный инженер проекта': 1,
      'Главный архитектор': 1,
      'BIM-координатор': 1,
    },
    averageExperience: 5.4,
    recentHires: 2,
  },

  // Состояния загрузки
  isLoading: false,
  isLoadingDetails: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  // Ошибки
  error: null,
  detailsError: null,

  // Поиск и фильтрация
  searchQuery: '',
  filters: {
    status: 'any',
    department: 'any',
    position: 'any',
    experience: 'any',
    hirePeriod: 'any',
    skills: [],
  },
  filtersOpen: false,

  // Метаданные
  lastUpdated: new Date().toISOString(),
};

// Создаем slice
const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // Управление состояниями загрузки
    setEmployeesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setSelectedEmployeeLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingDetails = action.payload;
      if (action.payload) {
        state.detailsError = null;
      }
    },
    setCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload;
    },
    setDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload;
    },

    // Управление данными
    setEmployees: (state, action: PayloadAction<EmployeeBasicInfo[]>) => {
      state.employees = action.payload;
      state.isLoading = false;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    setSelectedEmployee: (state, action: PayloadAction<EmployeeDetailed | null>) => {
      state.selectedEmployee = action.payload;
      state.isLoadingDetails = false;
      state.detailsError = null;
    },
    setStatistics: (state, action: PayloadAction<EmployeeStatistics>) => {
      state.statistics = action.payload;
    },

    // Управление ошибками
    setEmployeesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSelectedEmployeeError: (state, action: PayloadAction<string>) => {
      state.detailsError = action.payload;
      state.isLoadingDetails = false;
    },

    // CRUD операции
    addEmployee: (state, action: PayloadAction<EmployeeBasicInfo>) => {
      state.employees.unshift(action.payload);
      state.isCreating = false;
      state.lastUpdated = new Date().toISOString();

      // Обновляем статистику
      if (state.statistics) {
        state.statistics.total += 1;
        state.statistics.byStatus[action.payload.status] =
          (state.statistics.byStatus[action.payload.status] || 0) + 1;
        state.statistics.byDepartment[action.payload.department] =
          (state.statistics.byDepartment[action.payload.department] || 0) + 1;
        state.statistics.byPosition[action.payload.position] =
          (state.statistics.byPosition[action.payload.position] || 0) + 1;
      }
    },
    updateEmployee: (state, action: PayloadAction<EmployeeBasicInfo>) => {
      const index = state.employees.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        const oldEmployee = state.employees[index];
        state.employees[index] = action.payload;
        state.isUpdating = false;
        state.lastUpdated = new Date().toISOString();

        // Обновляем выбранного сотрудника, если он редактируется
        if (state.selectedEmployee && state.selectedEmployee.id === action.payload.id) {
          state.selectedEmployee = { ...state.selectedEmployee, ...action.payload };
        }

        // Обновляем статистику
        if (state.statistics) {
          // Уменьшаем счетчики для старых значений
          if (oldEmployee.status !== action.payload.status) {
            state.statistics.byStatus[oldEmployee.status] = Math.max(
              0,
              (state.statistics.byStatus[oldEmployee.status] || 0) - 1
            );
            state.statistics.byStatus[action.payload.status] =
              (state.statistics.byStatus[action.payload.status] || 0) + 1;
          }

          if (oldEmployee.department !== action.payload.department) {
            state.statistics.byDepartment[oldEmployee.department] = Math.max(
              0,
              (state.statistics.byDepartment[oldEmployee.department] || 0) - 1
            );
            state.statistics.byDepartment[action.payload.department] =
              (state.statistics.byDepartment[action.payload.department] || 0) + 1;
          }

          if (oldEmployee.position !== action.payload.position) {
            state.statistics.byPosition[oldEmployee.position] = Math.max(
              0,
              (state.statistics.byPosition[oldEmployee.position] || 0) - 1
            );
            state.statistics.byPosition[action.payload.position] =
              (state.statistics.byPosition[action.payload.position] || 0) + 1;
          }
        }
      }
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      const employeeToDelete = state.employees.find(emp => emp.id === action.payload);
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
      state.isDeleting = false;
      state.lastUpdated = new Date().toISOString();

      // Очищаем выбранного сотрудника, если он был удален
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload) {
        state.selectedEmployee = null;
      }

      // Обновляем статистику
      if (state.statistics && employeeToDelete) {
        state.statistics.total = Math.max(0, state.statistics.total - 1);
        state.statistics.byStatus[employeeToDelete.status] = Math.max(
          0,
          (state.statistics.byStatus[employeeToDelete.status] || 0) - 1
        );
        state.statistics.byDepartment[employeeToDelete.department] = Math.max(
          0,
          (state.statistics.byDepartment[employeeToDelete.department] || 0) - 1
        );
        state.statistics.byPosition[employeeToDelete.position] = Math.max(
          0,
          (state.statistics.byPosition[employeeToDelete.position] || 0) - 1
        );
      }
    },

    // Создание полного сотрудника
    createEmployeeComplete: (state, action: PayloadAction<Omit<EmployeeDetailed, 'id'>>) => {
      const newEmployee: EmployeeDetailed = {
        ...action.payload,
        id: Date.now().toString(),
        lastActivity: new Date().toISOString().split('T')[0],
      };

      // Добавляем в основной список
      const basicInfo: EmployeeBasicInfo = {
        id: newEmployee.id,
        name: newEmployee.name,
        position: newEmployee.position,
        department: newEmployee.department,
        experience: newEmployee.experience,
        status: newEmployee.status,
        hireDate: newEmployee.hireDate,
        skills: newEmployee.skills,
        avatar: newEmployee.avatar,
        email: newEmployee.email,
        phone: newEmployee.phone,
        salary: newEmployee.salary,
        location: newEmployee.location,
        lastActivity: newEmployee.lastActivity,
      };

      state.employees.unshift(basicInfo);
      state.selectedEmployee = newEmployee;
      state.isCreating = false;
      state.lastUpdated = new Date().toISOString();

      // Обновляем статистику
      if (state.statistics) {
        state.statistics.total += 1;
        state.statistics.byStatus[newEmployee.status] =
          (state.statistics.byStatus[newEmployee.status] || 0) + 1;
        state.statistics.byDepartment[newEmployee.department] =
          (state.statistics.byDepartment[newEmployee.department] || 0) + 1;
        state.statistics.byPosition[newEmployee.position] =
          (state.statistics.byPosition[newEmployee.position] || 0) + 1;
      }
    },

    // Обновление полного сотрудника
    updateEmployeeComplete: (state, action: PayloadAction<EmployeeDetailed>) => {
      const employee = action.payload;

      // Обновляем в основном списке
      const index = state.employees.findIndex(emp => emp.id === employee.id);
      if (index !== -1) {
        const oldEmployee = state.employees[index];
        const basicInfo: EmployeeBasicInfo = {
          id: employee.id,
          name: employee.name,
          position: employee.position,
          department: employee.department,
          experience: employee.experience,
          status: employee.status,
          hireDate: employee.hireDate,
          skills: employee.skills,
          avatar: employee.avatar,
          email: employee.email,
          phone: employee.phone,
          salary: employee.salary,
          location: employee.location,
          lastActivity: employee.lastActivity,
        };

        state.employees[index] = basicInfo;
        state.selectedEmployee = employee;
        state.isUpdating = false;
        state.lastUpdated = new Date().toISOString();

        // Обновляем статистику
        if (state.statistics) {
          if (oldEmployee.status !== employee.status) {
            state.statistics.byStatus[oldEmployee.status] = Math.max(
              0,
              (state.statistics.byStatus[oldEmployee.status] || 0) - 1
            );
            state.statistics.byStatus[employee.status] =
              (state.statistics.byStatus[employee.status] || 0) + 1;
          }

          if (oldEmployee.department !== employee.department) {
            state.statistics.byDepartment[oldEmployee.department] = Math.max(
              0,
              (state.statistics.byDepartment[oldEmployee.department] || 0) - 1
            );
            state.statistics.byDepartment[employee.department] =
              (state.statistics.byDepartment[employee.department] || 0) + 1;
          }

          if (oldEmployee.position !== employee.position) {
            state.statistics.byPosition[oldEmployee.position] = Math.max(
              0,
              (state.statistics.byPosition[oldEmployee.position] || 0) - 1
            );
            state.statistics.byPosition[employee.position] =
              (state.statistics.byPosition[employee.position] || 0) + 1;
          }
        }
      }
    },

    // Загрузка детальной информации о сотруднике
    loadEmployeeDetails: (state, action: PayloadAction<string>) => {
      const employeeId = action.payload;
      const basicEmployee = state.employees.find(emp => emp.id === employeeId);

      if (basicEmployee) {
        // Создаем детальную информацию на основе базовой
        const detailedEmployee: EmployeeDetailed = {
          ...basicEmployee,
          birthDate: '1990-05-15', // Моковые данные
          education: [
            {
              id: '1',
              degree: 'Магистр',
              specialty: 'Промышленное и гражданское строительство',
              university: 'Московский государственный строительный университет',
              year: '2015',
              description: 'Специализация: проектирование железобетонных конструкций.',
            },
          ],
          workExperience: [
            {
              id: '1',
              company: 'ООО "СтройПроект"',
              position: basicEmployee.position,
              period: '2020-2025',
              description: 'Основные обязанности и достижения на текущей позиции.',
            },
          ],
          certifications: [],
          projects: [],
          evaluations: [],
          notes: [],
          training: [],
        };

        state.selectedEmployee = detailedEmployee;
        state.isLoadingDetails = false;
        state.detailsError = null;
      } else {
        state.detailsError = 'Сотрудник не найден';
        state.isLoadingDetails = false;
      }
    },

    // Обновление статуса сотрудника
    updateEmployeeStatus: (
      state,
      action: PayloadAction<{ employeeId: string; status: string }>
    ) => {
      const { employeeId, status } = action.payload;
      const employee = state.employees.find(emp => emp.id === employeeId);

      if (employee) {
        const oldStatus = employee.status;
        employee.status = status;
        employee.lastActivity = new Date().toISOString().split('T')[0];

        // Обновляем выбранного сотрудника
        if (state.selectedEmployee && state.selectedEmployee.id === employeeId) {
          state.selectedEmployee.status = status;
          state.selectedEmployee.lastActivity = employee.lastActivity;
        }

        // Обновляем статистику
        if (state.statistics && oldStatus !== status) {
          state.statistics.byStatus[oldStatus] = Math.max(
            0,
            (state.statistics.byStatus[oldStatus] || 0) - 1
          );
          state.statistics.byStatus[status] = (state.statistics.byStatus[status] || 0) + 1;
        }

        state.lastUpdated = new Date().toISOString();
      }
    },

    // Управление образованием сотрудника
    updateEmployeeEducation: (
      state,
      action: PayloadAction<{ employeeId: string; education: EmployeeEducation[] }>
    ) => {
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.employeeId) {
        state.selectedEmployee.education = action.payload.education;
      }
    },

    // Управление опытом работы сотрудника
    updateEmployeeWorkExperience: (
      state,
      action: PayloadAction<{ employeeId: string; workExperience: EmployeeWorkExperience[] }>
    ) => {
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.employeeId) {
        state.selectedEmployee.workExperience = action.payload.workExperience;
      }
    },

    // Управление заметками
    addNote: (state, action: PayloadAction<{ employeeId: string; note: EmployeeNote }>) => {
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.employeeId) {
        state.selectedEmployee.notes.unshift(action.payload.note);
      }
    },
    updateNote: (state, action: PayloadAction<{ employeeId: string; note: EmployeeNote }>) => {
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.employeeId) {
        const index = state.selectedEmployee.notes.findIndex(
          note => note.id === action.payload.note.id
        );
        if (index !== -1) {
          state.selectedEmployee.notes[index] = action.payload.note;
        }
      }
    },
    deleteNote: (state, action: PayloadAction<{ employeeId: string; noteId: string }>) => {
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.employeeId) {
        state.selectedEmployee.notes = state.selectedEmployee.notes.filter(
          note => note.id !== action.payload.noteId
        );
      }
    },

    // Управление оценками
    addEvaluation: (
      state,
      action: PayloadAction<{ employeeId: string; evaluation: EmployeeEvaluation }>
    ) => {
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.employeeId) {
        state.selectedEmployee.evaluations.unshift(action.payload.evaluation);
      }
    },
    updateEvaluation: (
      state,
      action: PayloadAction<{ employeeId: string; evaluation: EmployeeEvaluation }>
    ) => {
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.employeeId) {
        const index = state.selectedEmployee.evaluations.findIndex(
          evaluation => evaluation.id === action.payload.evaluation.id
        );
        if (index !== -1) {
          state.selectedEmployee.evaluations[index] = action.payload.evaluation;
        }
      }
    },
    deleteEvaluation: (
      state,
      action: PayloadAction<{ employeeId: string; evaluationId: string }>
    ) => {
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.employeeId) {
        state.selectedEmployee.evaluations = state.selectedEmployee.evaluations.filter(
          evaluation => evaluation.id !== action.payload.evaluationId
        );
      }
    },

    // Управление обучением
    addTraining: (
      state,
      action: PayloadAction<{ employeeId: string; training: EmployeeTraining }>
    ) => {
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.employeeId) {
        state.selectedEmployee.training.unshift(action.payload.training);
      }
    },
    updateTraining: (
      state,
      action: PayloadAction<{ employeeId: string; training: EmployeeTraining }>
    ) => {
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.employeeId) {
        const index = state.selectedEmployee.training.findIndex(
          train => train.id === action.payload.training.id
        );
        if (index !== -1) {
          state.selectedEmployee.training[index] = action.payload.training;
        }
      }
    },
    deleteTraining: (state, action: PayloadAction<{ employeeId: string; trainingId: string }>) => {
      if (state.selectedEmployee && state.selectedEmployee.id === action.payload.employeeId) {
        state.selectedEmployee.training = state.selectedEmployee.training.filter(
          train => train.id !== action.payload.trainingId
        );
      }
    },

    // Поиск и фильтрация
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearch: state => {
      state.searchQuery = '';
    },
    setFilters: (state, action: PayloadAction<EmployeeFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: state => {
      state.filters = {
        status: 'any',
        department: 'any',
        position: 'any',
        experience: 'any',
        hirePeriod: 'any',
        skills: [],
      };
      state.searchQuery = '';
    },
    setFiltersOpen: (state, action: PayloadAction<boolean>) => {
      state.filtersOpen = action.payload;
    },
  },
});

// Экспортируем actions
export const {
  // Состояния загрузки
  setEmployeesLoading,
  setSelectedEmployeeLoading,
  setCreating,
  setUpdating,
  setDeleting,

  // Данные
  setEmployees,
  setSelectedEmployee,
  setStatistics,

  // Ошибки
  setEmployeesError,
  setSelectedEmployeeError,

  // CRUD операции
  addEmployee,
  updateEmployee,
  deleteEmployee,
  createEmployeeComplete,
  updateEmployeeComplete,
  loadEmployeeDetails,
  updateEmployeeStatus,

  // Управление дополнительными данными
  updateEmployeeEducation,
  updateEmployeeWorkExperience,
  addNote,
  updateNote,
  deleteNote,
  addEvaluation,
  updateEvaluation,
  deleteEvaluation,
  addTraining,
  updateTraining,
  deleteTraining,

  // Поиск и фильтрация
  setSearchQuery,
  clearSearch,
  setFilters,
  clearFilters,
  setFiltersOpen,
} = employeesSlice.actions;

// Селекторы
export const selectEmployees = (state: RootState) => state.employees.employees;
export const selectSelectedEmployee = (state: RootState) => state.employees.selectedEmployee;
export const selectStatistics = (state: RootState) => state.employees.statistics;

export const selectIsLoading = (state: RootState) => state.employees.isLoading;
export const selectIsLoadingDetails = (state: RootState) => state.employees.isLoadingDetails;
export const selectIsCreating = (state: RootState) => state.employees.isCreating;
export const selectIsUpdating = (state: RootState) => state.employees.isUpdating;
export const selectIsDeleting = (state: RootState) => state.employees.isDeleting;

export const selectError = (state: RootState) => state.employees.error;
export const selectDetailsError = (state: RootState) => state.employees.detailsError;

export const selectSearchQuery = (state: RootState) => state.employees.searchQuery;
export const selectFilters = (state: RootState) => state.employees.filters;
export const selectFiltersOpen = (state: RootState) => state.employees.filtersOpen;
export const selectLastUpdated = (state: RootState) => state.employees.lastUpdated;

// Селектор для фильтрованных сотрудников
export const selectFilteredEmployees = (state: RootState) => {
  const { employees, searchQuery, filters } = state.employees;

  let filtered = employees;

  // Применяем поиск
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      employee =>
        employee.name.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query) ||
        employee.department.toLowerCase().includes(query) ||
        employee.skills.some(skill => skill.toLowerCase().includes(query))
    );
  }

  // Применяем фильтры
  if (filters.status !== 'any') {
    filtered = filtered.filter(employee => employee.status === filters.status);
  }

  if (filters.department !== 'any') {
    filtered = filtered.filter(employee => employee.department === filters.department);
  }

  if (filters.position !== 'any') {
    filtered = filtered.filter(employee => employee.position === filters.position);
  }

  if (filters.experience !== 'any') {
    filtered = filtered.filter(employee => {
      const experience = parseInt(employee.experience);
      switch (filters.experience) {
        case '0-1':
          return experience <= 1;
        case '1-3':
          return experience > 1 && experience <= 3;
        case '3-5':
          return experience > 3 && experience <= 5;
        case '5-10':
          return experience > 5 && experience <= 10;
        case '10+':
          return experience > 10;
        default:
          return true;
      }
    });
  }

  if (filters.hirePeriod !== 'any') {
    const now = new Date();
    filtered = filtered.filter(employee => {
      const hireDate = new Date(employee.hireDate);
      const diffTime = now.getTime() - hireDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.hirePeriod) {
        case 'month':
          return diffDays <= 30;
        case 'quarter':
          return diffDays <= 90;
        case 'halfyear':
          return diffDays <= 180;
        case 'year':
          return diffDays <= 365;
        case '3years':
          return diffDays <= 1095;
        default:
          return true;
      }
    });
  }

  if (filters.skills.length > 0) {
    filtered = filtered.filter(employee =>
      filters.skills.some(skill =>
        employee.skills.some(empSkill => empSkill.toLowerCase().includes(skill.toLowerCase()))
      )
    );
  }

  return filtered;
};

// Селектор для подсчета активных фильтров
export const selectActiveFiltersCount = (state: RootState) => {
  const { filters } = state.employees;
  let count = 0;

  if (filters.status !== 'any') count++;
  if (filters.department !== 'any') count++;
  if (filters.position !== 'any') count++;
  if (filters.experience !== 'any') count++;
  if (filters.hirePeriod !== 'any') count++;
  if (filters.skills.length > 0) count++;

  return count;
};

export default employeesSlice.reducer;
