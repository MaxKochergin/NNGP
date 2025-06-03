import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Test,
  TestDifficulty,
  TestQuestion,
  TestStatus,
  TestTargetAudience,
  TestType,
} from '../../types/test';

// Константы для localStorage
const TESTS_STORAGE_KEY = 'nngp_tests';

// Функции для работы с localStorage
const saveTestsToStorage = (tests: Test[]) => {
  try {
    localStorage.setItem(TESTS_STORAGE_KEY, JSON.stringify(tests));
  } catch (error) {
    console.error('Ошибка при сохранении тестов в localStorage:', error);
  }
};

const loadTestsFromStorage = (): Test[] => {
  try {
    const stored = localStorage.getItem(TESTS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Ошибка при загрузке тестов из localStorage:', error);
  }
  return [];
};

// Интерфейс для фильтров тестов
export interface TestFilters {
  searchQuery: string;
  targetAudience: TestTargetAudience | 'all';
  status: TestStatus | 'all';
  type: TestType | 'all';
  difficulty: TestDifficulty | 'all';
  department: string;
  position: string;
}

// Интерфейс для статистики тестов
export interface TestStatistics {
  totalTests: number;
  activeTests: number;
  draftTests: number;
  archivedTests: number;
  totalQuestions: number;
  averagePassingScore: number;
}

// Состояние slice
interface TestsState {
  tests: Test[];
  filteredTests: Test[];
  selectedTest: Test | null;
  filters: TestFilters;
  statistics: TestStatistics;
  isLoading: boolean;
  isLoadingDetails: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  detailsError: string | null;
}

// Дефолтные тесты (для первого запуска)
const defaultTests: Test[] = [
    {
      id: '1',
      title: 'Тест на знание AutoCAD',
      description: 'Базовый тест для оценки навыков работы в AutoCAD',
      targetAudience: 'candidates',
      duration: 60,
      passingScore: 70,
      type: 'professional',
      difficulty: 'medium',
      status: 'active',
      department: 'Конструкторский отдел',
      position: 'Инженер-конструктор',
      questions: [
        {
          id: 'q1',
          text: 'Какая команда используется для создания окружности?',
          type: 'single',
          options: [
            { id: 'o1', text: 'CIRCLE', isCorrect: true },
            { id: 'o2', text: 'ARC', isCorrect: false },
            { id: 'o3', text: 'LINE', isCorrect: false },
            { id: 'o4', text: 'POLYGON', isCorrect: false },
          ],
          points: 5,
        },
        {
          id: 'q2',
          text: 'Как называется команда для создания массива объектов?',
          type: 'single',
          options: [
            { id: 'o5', text: 'COPY', isCorrect: false },
            { id: 'o6', text: 'ARRAY', isCorrect: true },
            { id: 'o7', text: 'MIRROR', isCorrect: false },
            { id: 'o8', text: 'MOVE', isCorrect: false },
          ],
          points: 5,
        },
      ],
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
      author: 'Иванов И.И.',
    },
    {
      id: '2',
      title: 'Тест на знание строительных норм и правил',
      description: 'Тест для проверки знаний СНиП и других нормативных документов',
      targetAudience: 'both',
      duration: 90,
      passingScore: 80,
      type: 'knowledge',
      difficulty: 'hard',
      status: 'active',
      department: 'Технический отдел',
      position: 'Ведущий инженер',
      questions: [
        {
          id: 'q3',
          text: 'Какой документ регламентирует нагрузки и воздействия на здания?',
          type: 'single',
          options: [
            { id: 'o9', text: 'СП 20.13330', isCorrect: true },
            { id: 'o10', text: 'СП 50.13330', isCorrect: false },
            { id: 'o11', text: 'СП 70.13330', isCorrect: false },
            { id: 'o12', text: 'СП 22.13330', isCorrect: false },
          ],
          points: 10,
        },
      ],
      createdAt: '2025-01-10T14:30:00Z',
      updatedAt: '2025-01-12T09:15:00Z',
      author: 'Петров П.П.',
    },
    {
      id: '3',
      title: 'Тест на знание Revit',
      description: 'Продвинутый тест для BIM-специалистов',
      targetAudience: 'employees',
      duration: 120,
      passingScore: 75,
      type: 'professional',
      difficulty: 'expert',
      status: 'draft',
      department: 'BIM отдел',
      position: 'BIM-координатор',
      questions: [
        {
          id: 'q4',
          text: 'Что такое семейство в Revit?',
          type: 'single',
          options: [
            { id: 'o13', text: 'Группа элементов', isCorrect: false },
            { id: 'o14', text: 'Параметрический объект', isCorrect: true },
            { id: 'o15', text: 'Слой чертежа', isCorrect: false },
            { id: 'o16', text: 'Вид модели', isCorrect: false },
          ],
          points: 8,
        },
      ],
      createdAt: '2025-01-08T16:45:00Z',
      updatedAt: '2025-01-08T16:45:00Z',
      author: 'Сидоров С.С.',
    },
];

// Получаем тесты из localStorage или используем дефолтные
const getInitialTests = (): Test[] => {
  const storedTests = loadTestsFromStorage();
  if (storedTests.length > 0) {
    return storedTests;
  }
  // Если localStorage пустой, сохраняем дефолтные тесты и возвращаем их
  saveTestsToStorage(defaultTests);
  return defaultTests;
};

// Начальное состояние
const initialState: TestsState = {
  tests: getInitialTests(),
  filteredTests: [],
  selectedTest: null,
  filters: {
    searchQuery: '',
    targetAudience: 'all',
    status: 'all',
    type: 'all',
    difficulty: 'all',
    department: '',
    position: '',
  },
  statistics: {
    totalTests: 0,
    activeTests: 0,
    draftTests: 0,
    archivedTests: 0,
    totalQuestions: 0,
    averagePassingScore: 0,
  },
  isLoading: false,
  isLoadingDetails: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  detailsError: null,
};

// Функция для вычисления статистики
const calculateStatistics = (tests: Test[]): TestStatistics => {
  const totalTests = tests.length;
  const activeTests = tests.filter(test => test.status === 'active').length;
  const draftTests = tests.filter(test => test.status === 'draft').length;
  const archivedTests = tests.filter(test => test.status === 'archived').length;
  const totalQuestions = tests.reduce((sum, test) => sum + test.questions.length, 0);
  const averagePassingScore =
    totalTests > 0 ? tests.reduce((sum, test) => sum + test.passingScore, 0) / totalTests : 0;

  return {
    totalTests,
    activeTests,
    draftTests,
    archivedTests,
    totalQuestions,
    averagePassingScore: Math.round(averagePassingScore * 10) / 10,
  };
};

// Функция для применения фильтров
const applyFilters = (tests: Test[], filters: TestFilters): Test[] => {
  return tests.filter(test => {
    // Поиск по тексту
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      const matchesSearch =
        test.title.toLowerCase().includes(query) ||
        test.description.toLowerCase().includes(query) ||
        (test.department && test.department.toLowerCase().includes(query)) ||
        (test.position && test.position.toLowerCase().includes(query)) ||
        test.author.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // Фильтр по целевой аудитории
    if (filters.targetAudience !== 'all') {
      if (test.targetAudience !== filters.targetAudience && test.targetAudience !== 'both') {
        return false;
      }
    }

    // Фильтр по статусу
    if (filters.status !== 'all' && test.status !== filters.status) {
      return false;
    }

    // Фильтр по типу
    if (filters.type !== 'all' && test.type !== filters.type) {
      return false;
    }

    // Фильтр по сложности
    if (filters.difficulty !== 'all' && test.difficulty !== filters.difficulty) {
      return false;
    }

    // Фильтр по отделу
    if (filters.department.trim() && test.department !== filters.department) {
      return false;
    }

    // Фильтр по должности
    if (filters.position.trim() && test.position !== filters.position) {
      return false;
    }

    return true;
  });
};

// Создание slice
const testsSlice = createSlice({
  name: 'tests',
  initialState: (() => {
    const tests = getInitialTests();
    return {
    ...initialState,
      tests,
      filteredTests: applyFilters(tests, initialState.filters),
      statistics: calculateStatistics(tests),
    };
  })(),
  reducers: {
    // Загрузка тестов
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    setLoadingDetails: (state, action: PayloadAction<boolean>) => {
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

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isCreating = false;
      state.isUpdating = false;
      state.isDeleting = false;
    },

    setDetailsError: (state, action: PayloadAction<string>) => {
      state.detailsError = action.payload;
      state.isLoadingDetails = false;
    },

    // CRUD операции
    setTests: (state, action: PayloadAction<Test[]>) => {
      state.tests = action.payload;
      saveTestsToStorage(state.tests);
      state.filteredTests = applyFilters(action.payload, state.filters);
      state.statistics = calculateStatistics(action.payload);
      state.isLoading = false;
      state.error = null;
    },

    addTest: (state, action: PayloadAction<Test>) => {
      state.tests.push(action.payload);
      saveTestsToStorage(state.tests);
      state.filteredTests = applyFilters(state.tests, state.filters);
      state.statistics = calculateStatistics(state.tests);
      state.isCreating = false;
    },

    updateTest: (state, action: PayloadAction<Test>) => {
      const index = state.tests.findIndex(test => test.id === action.payload.id);
      if (index !== -1) {
        state.tests[index] = action.payload;
        saveTestsToStorage(state.tests);
        state.filteredTests = applyFilters(state.tests, state.filters);
        state.statistics = calculateStatistics(state.tests);

        // Обновляем выбранный тест, если он совпадает
        if (state.selectedTest?.id === action.payload.id) {
          state.selectedTest = action.payload;
        }
      }
      state.isUpdating = false;
    },

    deleteTest: (state, action: PayloadAction<string>) => {
      state.tests = state.tests.filter(test => test.id !== action.payload);
      saveTestsToStorage(state.tests);
      state.filteredTests = applyFilters(state.tests, state.filters);
      state.statistics = calculateStatistics(state.tests);

      // Очищаем выбранный тест, если он был удален
      if (state.selectedTest?.id === action.payload) {
        state.selectedTest = null;
      }
      state.isDeleting = false;
    },

    // Управление выбранным тестом
    setSelectedTest: (state, action: PayloadAction<Test | null>) => {
      state.selectedTest = action.payload;
      state.isLoadingDetails = false;
      state.detailsError = null;
    },

    clearSelectedTest: state => {
      state.selectedTest = null;
      state.detailsError = null;
    },

    // Управление фильтрами
    setFilters: (state, action: PayloadAction<Partial<TestFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredTests = applyFilters(state.tests, state.filters);
    },

    clearFilters: state => {
      state.filters = {
        searchQuery: '',
        targetAudience: 'all',
        status: 'all',
        type: 'all',
        difficulty: 'all',
        department: '',
        position: '',
      };
      state.filteredTests = state.tests;
    },

    // Управление вопросами
    addQuestion: (state, action: PayloadAction<{ testId: string; question: TestQuestion }>) => {
      const { testId, question } = action.payload;
      const testIndex = state.tests.findIndex(test => test.id === testId);

      if (testIndex !== -1) {
        state.tests[testIndex].questions.push(question);
        state.tests[testIndex].updatedAt = new Date().toISOString();
        saveTestsToStorage(state.tests);
        state.filteredTests = applyFilters(state.tests, state.filters);
        state.statistics = calculateStatistics(state.tests);

        // Обновляем выбранный тест
        if (state.selectedTest?.id === testId) {
          state.selectedTest = state.tests[testIndex];
        }
      }
    },

    updateQuestion: (state, action: PayloadAction<{ testId: string; question: TestQuestion }>) => {
      const { testId, question } = action.payload;
      const testIndex = state.tests.findIndex(test => test.id === testId);

      if (testIndex !== -1) {
        const questionIndex = state.tests[testIndex].questions.findIndex(q => q.id === question.id);
        if (questionIndex !== -1) {
          state.tests[testIndex].questions[questionIndex] = question;
          state.tests[testIndex].updatedAt = new Date().toISOString();
          saveTestsToStorage(state.tests);
          state.filteredTests = applyFilters(state.tests, state.filters);

          // Обновляем выбранный тест
          if (state.selectedTest?.id === testId) {
            state.selectedTest = state.tests[testIndex];
          }
        }
      }
    },

    deleteQuestion: (state, action: PayloadAction<{ testId: string; questionId: string }>) => {
      const { testId, questionId } = action.payload;
      const testIndex = state.tests.findIndex(test => test.id === testId);

      if (testIndex !== -1) {
        state.tests[testIndex].questions = state.tests[testIndex].questions.filter(
          q => q.id !== questionId
        );
        state.tests[testIndex].updatedAt = new Date().toISOString();
        saveTestsToStorage(state.tests);
        state.filteredTests = applyFilters(state.tests, state.filters);
        state.statistics = calculateStatistics(state.tests);

        // Обновляем выбранный тест
        if (state.selectedTest?.id === testId) {
          state.selectedTest = state.tests[testIndex];
        }
      }
    },
  },
});

export const {
  setLoading,
  setLoadingDetails,
  setCreating,
  setUpdating,
  setDeleting,
  setError,
  setDetailsError,
  setTests,
  addTest,
  updateTest,
  deleteTest,
  setSelectedTest,
  clearSelectedTest,
  setFilters,
  clearFilters,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} = testsSlice.actions;

export default testsSlice.reducer;
