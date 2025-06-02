import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Типы для данных кандидатов
export interface CandidateBasicInfo {
  id: string;
  name: string;
  position: string;
  experience: string;
  status: string;
  lastActivity: string;
  skills: string[];
  avatar: string | null;
  email?: string;
  phone?: string;
  resumeUrl?: string;
  salary?: string;
  location?: string;
}

export interface CandidateEducation {
  id: string;
  degree: string;
  specialty: string;
  university: string;
  year: string;
  description?: string;
}

export interface CandidateWorkExperience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
}

export interface CandidateNote {
  id: string;
  date: string;
  text: string;
  author: string;
}

export interface CandidateInterview {
  id: string;
  date: string;
  time: string;
  type: string;
  status: string;
  interviewers: string[];
  result: string | null;
  notes: string;
}

export interface CandidateDetailed extends CandidateBasicInfo {
  education: CandidateEducation[];
  workExperience: CandidateWorkExperience[];
  notes: CandidateNote[];
  interviews: CandidateInterview[];
}

export interface CandidateFilters {
  status?: string;
  position?: string;
  experience?: string;
  activity?: string;
  skills?: string[];
  onlyWithResume?: boolean;
  search?: string;
}

export interface CandidateStatistics {
  total: number;
  byStatus: { status: string; count: number }[];
  byPosition: { position: string; count: number }[];
  byActivity: { period: string; count: number }[];
}

export interface CandidatesState {
  // Список кандидатов
  candidates: CandidateBasicInfo[];
  filteredCandidates: CandidateBasicInfo[];

  // Выбранный кандидат
  selectedCandidate: CandidateDetailed | null;

  // Фильтры
  filters: CandidateFilters;
  activeFiltersCount: number;

  // Статистика
  statistics: CandidateStatistics | null;

  // Состояния загрузки
  isLoading: boolean;
  isLoadingDetails: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Ошибки
  error: string | null;
  detailsError: string | null;

  // Поиск
  searchQuery: string;

  // UI состояния
  filtersOpen: boolean;

  // Последнее обновление
  lastUpdated: string | null;
}

// Моковые данные для разработки
const mockCandidates: CandidateBasicInfo[] = [
  {
    id: '1',
    name: 'Королев Антон Павлович',
    position: 'Инженер-конструктор',
    experience: '5 лет',
    status: 'Новый',
    lastActivity: '2025-04-15',
    skills: ['AutoCAD', 'Revit', 'Железобетонные конструкции', 'ЛИРА-САПР'],
    avatar: null,
    email: 'korolev@example.com',
    phone: '+7 (999) 123-45-67',
    resumeUrl: '/documents/resume1.pdf',
    salary: '120 000 руб.',
    location: 'Москва',
  },
  {
    id: '2',
    name: 'Дмитриева Ольга Игоревна',
    position: 'Инженер-проектировщик ОВиК',
    experience: '3 года',
    status: 'На собеседовании',
    lastActivity: '2025-04-14',
    skills: ['AutoCAD', 'Revit MEP', 'Расчет систем вентиляции', 'BIM-проектирование'],
    avatar: null,
    email: 'dmitrieva@example.com',
    phone: '+7 (999) 234-56-78',
    resumeUrl: '/documents/resume2.pdf',
    salary: '110 000 руб.',
    location: 'Москва',
  },
  {
    id: '3',
    name: 'Васильев Сергей Станиславович',
    position: 'Ведущий инженер-конструктор',
    experience: '8 лет',
    status: 'Тестовое задание',
    lastActivity: '2025-04-12',
    skills: ['ЛИРА-САПР', 'AutoCAD', 'Revit', 'Расчет конструкций', 'Техническая экспертиза'],
    avatar: null,
    email: 'vasiliev@example.com',
    phone: '+7 (999) 345-67-89',
    resumeUrl: '/documents/resume3.pdf',
    salary: '150 000 руб.',
    location: 'Москва',
  },
  {
    id: '4',
    name: 'Григорьева Наталья Михайловна',
    position: 'Архитектор',
    experience: '6 лет',
    status: 'Принят',
    lastActivity: '2025-04-10',
    skills: ['ArchiCAD', 'Revit', '3D моделирование', 'Концептуальное проектирование'],
    avatar: null,
    email: 'grigorieva@example.com',
    phone: '+7 (999) 456-78-90',
    resumeUrl: '/documents/resume4.pdf',
    salary: '140 000 руб.',
    location: 'Москва',
  },
  {
    id: '5',
    name: 'Морозов Игорь Валентинович',
    position: 'BIM-координатор',
    experience: '4 года',
    status: 'Отклонен',
    lastActivity: '2025-04-08',
    skills: ['Revit', 'Navisworks', 'BIM-координация', 'Autodesk BIM 360'],
    avatar: null,
    email: 'morozov@example.com',
    phone: '+7 (999) 567-89-01',
    salary: '130 000 руб.',
    location: 'Москва',
  },
];

const mockDetailedCandidates: { [key: string]: CandidateDetailed } = {
  '1': {
    ...mockCandidates[0],
    education: [
      {
        id: '1',
        degree: 'Магистр',
        specialty: 'Промышленное и гражданское строительство',
        university: 'Московский государственный строительный университет',
        year: '2018',
        description: 'Специализация: проектирование железобетонных конструкций. Диплом с отличием.',
      },
      {
        id: '2',
        degree: 'Бакалавр',
        specialty: 'Строительство',
        university: 'Московский государственный строительный университет',
        year: '2016',
        description: 'Направление: промышленное и гражданское строительство.',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'ООО "СтройПроект"',
        position: 'Инженер-конструктор',
        period: '2020-2025',
        description:
          'Проектирование железобетонных конструкций многоквартирных жилых домов. Расчет конструкций в ЛИРА-САПР.',
      },
      {
        id: '2',
        company: 'ООО "Стройэксперт"',
        position: 'Техник-проектировщик',
        period: '2016-2020',
        description:
          'Разработка чертежей строительных конструкций. Оформление проектной документации.',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-15',
        text: 'Проведено первичное собеседование. Кандидат показал хорошие знания в области проектирования железобетонных конструкций.',
        author: 'Петрова А.С. (HR)',
      },
    ],
    interviews: [
      {
        id: '1',
        date: '2025-04-15',
        time: '14:00',
        type: 'Первичное собеседование',
        status: 'Проведено',
        interviewers: ['Петрова А.С.', 'Смирнов П.Р.'],
        result: 'Успешно',
        notes: 'Кандидат успешно прошел собеседование. Требуется техническая оценка.',
      },
    ],
  },
  '2': {
    ...mockCandidates[1],
    education: [
      {
        id: '1',
        degree: 'Магистр',
        specialty: 'Теплогазоснабжение и вентиляция',
        university: 'Московский государственный строительный университет',
        year: '2018',
        description:
          'Специализация: проектирование систем отопления, вентиляции и кондиционирования.',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'ООО "ИнженерПроект"',
        position: 'Инженер-проектировщик ОВиК',
        period: '2020-2025',
        description:
          'Проектирование систем отопления, вентиляции и кондиционирования для жилых и общественных зданий.',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-14',
        text: 'Проведено первичное собеседование. Кандидат имеет хороший опыт работы с системами ОВиК.',
        author: 'Петрова А.С. (HR)',
      },
    ],
    interviews: [
      {
        id: '1',
        date: '2025-04-14',
        time: '11:00',
        type: 'Первичное собеседование',
        status: 'Проведено',
        interviewers: ['Петрова А.С.', 'Николаев К.Р.'],
        result: 'Успешно',
        notes: 'Кандидат показал хорошие знания. Рекомендован к техническому собеседованию.',
      },
    ],
  },
};

const mockStatistics: CandidateStatistics = {
  total: 5,
  byStatus: [
    { status: 'Новый', count: 1 },
    { status: 'На собеседовании', count: 1 },
    { status: 'Тестовое задание', count: 1 },
    { status: 'Принят', count: 1 },
    { status: 'Отклонен', count: 1 },
  ],
  byPosition: [
    { position: 'Инженер-конструктор', count: 2 },
    { position: 'Инженер-проектировщик ОВиК', count: 1 },
    { position: 'Архитектор', count: 1 },
    { position: 'BIM-координатор', count: 1 },
  ],
  byActivity: [
    { period: 'Сегодня', count: 1 },
    { period: 'За неделю', count: 4 },
    { period: 'За месяц', count: 5 },
  ],
};

// Начальное состояние
const initialState: CandidatesState = {
  candidates: mockCandidates,
  filteredCandidates: mockCandidates,
  selectedCandidate: null,
  filters: {},
  activeFiltersCount: 0,
  statistics: mockStatistics,
  isLoading: false,
  isLoadingDetails: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  detailsError: null,
  searchQuery: '',
  filtersOpen: false,
  lastUpdated: new Date().toISOString(),
};

// Вспомогательные функции для фильтрации
const applyFilters = (
  candidates: CandidateBasicInfo[],
  filters: CandidateFilters,
  searchQuery: string
): CandidateBasicInfo[] => {
  let filtered = [...candidates];

  // Поиск по тексту
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      candidate =>
        candidate.name.toLowerCase().includes(query) ||
        candidate.position.toLowerCase().includes(query) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(query)) ||
        candidate.location?.toLowerCase().includes(query)
    );
  }

  // Фильтр по статусу
  if (filters.status && filters.status !== 'any') {
    filtered = filtered.filter(candidate => candidate.status === filters.status);
  }

  // Фильтр по должности
  if (filters.position && filters.position !== 'any') {
    filtered = filtered.filter(candidate => candidate.position.includes(filters.position));
  }

  // Фильтр по опыту
  if (filters.experience && filters.experience !== 'any') {
    filtered = filtered.filter(candidate => {
      const exp = candidate.experience;
      switch (filters.experience) {
        case '0-1':
          return exp.includes('1 год') || exp.includes('менее года');
        case '1-3':
          return exp.includes('2 года') || exp.includes('3 года');
        case '3-5':
          return exp.includes('4 года') || exp.includes('5 лет');
        case '5-10':
          return (
            exp.includes('6 лет') ||
            exp.includes('7 лет') ||
            exp.includes('8 лет') ||
            exp.includes('9 лет') ||
            exp.includes('10 лет')
          );
        case '10+':
          return parseInt(exp) > 10;
        default:
          return true;
      }
    });
  }

  // Фильтр по навыкам
  if (filters.skills && filters.skills.length > 0) {
    filtered = filtered.filter(candidate =>
      filters.skills!.some(skill =>
        candidate.skills.some(candidateSkill =>
          candidateSkill.toLowerCase().includes(skill.toLowerCase())
        )
      )
    );
  }

  // Фильтр по наличию резюме
  if (filters.onlyWithResume) {
    filtered = filtered.filter(candidate => candidate.resumeUrl);
  }

  // Фильтр по активности
  if (filters.activity && filters.activity !== 'any') {
    const now = new Date();
    filtered = filtered.filter(candidate => {
      const activityDate = new Date(candidate.lastActivity);
      const diffTime = now.getTime() - activityDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      switch (filters.activity) {
        case 'today':
          return diffDays === 0;
        case 'week':
          return diffDays <= 7;
        case 'month':
          return diffDays <= 30;
        case 'quarter':
          return diffDays <= 90;
        default:
          return true;
      }
    });
  }

  return filtered;
};

const countActiveFilters = (filters: CandidateFilters): number => {
  let count = 0;
  if (filters.status && filters.status !== 'any') count++;
  if (filters.position && filters.position !== 'any') count++;
  if (filters.experience && filters.experience !== 'any') count++;
  if (filters.activity && filters.activity !== 'any') count++;
  if (filters.skills && filters.skills.length > 0) count++;
  if (filters.onlyWithResume) count++;
  return count;
};

// Создаем slice
const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    // Загрузка списка кандидатов
    setCandidatesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    setCandidates: (state, action: PayloadAction<CandidateBasicInfo[]>) => {
      state.candidates = action.payload;
      state.filteredCandidates = applyFilters(action.payload, state.filters, state.searchQuery);
      state.isLoading = false;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },

    setCandidatesError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Поиск
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredCandidates = applyFilters(state.candidates, state.filters, action.payload);
    },

    clearSearch: state => {
      state.searchQuery = '';
      state.filteredCandidates = applyFilters(state.candidates, state.filters, '');
    },

    // Фильтры
    setFilters: (state, action: PayloadAction<CandidateFilters>) => {
      state.filters = action.payload;
      state.activeFiltersCount = countActiveFilters(action.payload);
      state.filteredCandidates = applyFilters(state.candidates, action.payload, state.searchQuery);
    },

    clearFilters: state => {
      state.filters = {};
      state.activeFiltersCount = 0;
      state.searchQuery = '';
      state.filteredCandidates = [...state.candidates];
    },

    setFiltersOpen: (state, action: PayloadAction<boolean>) => {
      state.filtersOpen = action.payload;
    },

    // Выбранный кандидат
    setSelectedCandidateLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoadingDetails = action.payload;
      if (action.payload) {
        state.detailsError = null;
      }
    },

    setSelectedCandidate: (state, action: PayloadAction<CandidateDetailed | null>) => {
      state.selectedCandidate = action.payload;
      state.isLoadingDetails = false;
      state.detailsError = null;
    },

    setSelectedCandidateError: (state, action: PayloadAction<string>) => {
      state.detailsError = action.payload;
      state.isLoadingDetails = false;
    },

    // CRUD операции
    setCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },

    addCandidate: (state, action: PayloadAction<CandidateBasicInfo>) => {
      state.candidates.unshift(action.payload);
      state.filteredCandidates = applyFilters(state.candidates, state.filters, state.searchQuery);
      state.isCreating = false;
      state.lastUpdated = new Date().toISOString();
    },

    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.isUpdating = action.payload;
    },

    updateCandidate: (state, action: PayloadAction<CandidateBasicInfo>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = action.payload;
        state.filteredCandidates = applyFilters(state.candidates, state.filters, state.searchQuery);
      }

      // Обновляем выбранного кандидата, если он совпадает
      if (state.selectedCandidate && state.selectedCandidate.id === action.payload.id) {
        state.selectedCandidate = { ...state.selectedCandidate, ...action.payload };
      }

      state.isUpdating = false;
      state.lastUpdated = new Date().toISOString();
    },

    setDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload;
    },

    deleteCandidate: (state, action: PayloadAction<string>) => {
      state.candidates = state.candidates.filter(c => c.id !== action.payload);
      state.filteredCandidates = applyFilters(state.candidates, state.filters, state.searchQuery);

      // Очищаем выбранного кандидата, если он был удален
      if (state.selectedCandidate && state.selectedCandidate.id === action.payload) {
        state.selectedCandidate = null;
      }

      state.isDeleting = false;
      state.lastUpdated = new Date().toISOString();
    },

    // Заметки
    addNote: (state, action: PayloadAction<{ candidateId: string; note: CandidateNote }>) => {
      if (state.selectedCandidate && state.selectedCandidate.id === action.payload.candidateId) {
        state.selectedCandidate.notes.unshift(action.payload.note);
      }
    },

    updateNote: (state, action: PayloadAction<{ candidateId: string; note: CandidateNote }>) => {
      if (state.selectedCandidate && state.selectedCandidate.id === action.payload.candidateId) {
        const index = state.selectedCandidate.notes.findIndex(n => n.id === action.payload.note.id);
        if (index !== -1) {
          state.selectedCandidate.notes[index] = action.payload.note;
        }
      }
    },

    deleteNote: (state, action: PayloadAction<{ candidateId: string; noteId: string }>) => {
      if (state.selectedCandidate && state.selectedCandidate.id === action.payload.candidateId) {
        state.selectedCandidate.notes = state.selectedCandidate.notes.filter(
          n => n.id !== action.payload.noteId
        );
      }
    },

    // Интервью
    addInterview: (
      state,
      action: PayloadAction<{ candidateId: string; interview: CandidateInterview }>
    ) => {
      if (state.selectedCandidate && state.selectedCandidate.id === action.payload.candidateId) {
        state.selectedCandidate.interviews.unshift(action.payload.interview);
      }
    },

    updateInterview: (
      state,
      action: PayloadAction<{ candidateId: string; interview: CandidateInterview }>
    ) => {
      if (state.selectedCandidate && state.selectedCandidate.id === action.payload.candidateId) {
        const index = state.selectedCandidate.interviews.findIndex(
          i => i.id === action.payload.interview.id
        );
        if (index !== -1) {
          state.selectedCandidate.interviews[index] = action.payload.interview;
        }
      }
    },

    deleteInterview: (
      state,
      action: PayloadAction<{ candidateId: string; interviewId: string }>
    ) => {
      if (state.selectedCandidate && state.selectedCandidate.id === action.payload.candidateId) {
        state.selectedCandidate.interviews = state.selectedCandidate.interviews.filter(
          i => i.id !== action.payload.interviewId
        );
      }
    },

    // Статистика
    setStatistics: (state, action: PayloadAction<CandidateStatistics>) => {
      state.statistics = action.payload;
    },

    // Обновление статуса кандидата
    updateCandidateStatus: (
      state,
      action: PayloadAction<{ candidateId: string; status: string }>
    ) => {
      const candidate = state.candidates.find(c => c.id === action.payload.candidateId);
      if (candidate) {
        candidate.status = action.payload.status;
        candidate.lastActivity = new Date().toISOString().split('T')[0];
      }

      if (state.selectedCandidate && state.selectedCandidate.id === action.payload.candidateId) {
        state.selectedCandidate.status = action.payload.status;
        state.selectedCandidate.lastActivity = new Date().toISOString().split('T')[0];
      }

      state.filteredCandidates = applyFilters(state.candidates, state.filters, state.searchQuery);
      state.lastUpdated = new Date().toISOString();
    },

    // Загрузка детальных данных из мока
    loadCandidateDetails: (state, action: PayloadAction<string>) => {
      const candidateId = action.payload;
      const detailedCandidate = mockDetailedCandidates[candidateId];

      if (detailedCandidate) {
        state.selectedCandidate = detailedCandidate;
        state.isLoadingDetails = false;
        state.detailsError = null;
      } else {
        state.detailsError = 'Кандидат не найден';
        state.isLoadingDetails = false;
      }
    },

    // Обновление полных данных кандидата (включая образование и опыт)
    updateCandidateComplete: (state, action: PayloadAction<CandidateDetailed>) => {
      const candidate = action.payload;

      // Обновляем в основном списке
      const index = state.candidates.findIndex(c => c.id === candidate.id);
      if (index !== -1) {
        // Обновляем базовую информацию
        state.candidates[index] = {
          id: candidate.id,
          name: candidate.name,
          position: candidate.position,
          experience: candidate.experience,
          status: candidate.status,
          lastActivity: candidate.lastActivity,
          skills: candidate.skills,
          avatar: candidate.avatar,
          email: candidate.email,
          phone: candidate.phone,
          resumeUrl: candidate.resumeUrl,
          salary: candidate.salary,
          location: candidate.location,
        };
      }

      // Обновляем выбранного кандидата
      if (state.selectedCandidate && state.selectedCandidate.id === candidate.id) {
        state.selectedCandidate = candidate;
      }

      // Обновляем моковые данные для детального просмотра
      mockDetailedCandidates[candidate.id] = candidate;

      state.filteredCandidates = applyFilters(state.candidates, state.filters, state.searchQuery);
      state.isUpdating = false;
      state.lastUpdated = new Date().toISOString();
    },

    // Создание полного кандидата (включая образование и опыт)
    createCandidateComplete: (state, action: PayloadAction<Omit<CandidateDetailed, 'id'>>) => {
      const candidateData = action.payload;
      const newId = Date.now().toString();

      const newCandidate: CandidateDetailed = {
        ...candidateData,
        id: newId,
        lastActivity: new Date().toISOString().split('T')[0],
      };

      // Добавляем в основной список
      const basicInfo: CandidateBasicInfo = {
        id: newCandidate.id,
        name: newCandidate.name,
        position: newCandidate.position,
        experience: newCandidate.experience,
        status: newCandidate.status,
        lastActivity: newCandidate.lastActivity,
        skills: newCandidate.skills,
        avatar: newCandidate.avatar,
        email: newCandidate.email,
        phone: newCandidate.phone,
        resumeUrl: newCandidate.resumeUrl,
        salary: newCandidate.salary,
        location: newCandidate.location,
      };

      state.candidates.unshift(basicInfo);

      // Добавляем в моковые детальные данные
      mockDetailedCandidates[newId] = newCandidate;

      state.filteredCandidates = applyFilters(state.candidates, state.filters, state.searchQuery);
      state.isCreating = false;
      state.lastUpdated = new Date().toISOString();
    },

    // Обновление образования кандидата
    updateCandidateEducation: (
      state,
      action: PayloadAction<{ candidateId: string; education: CandidateEducation[] }>
    ) => {
      if (state.selectedCandidate && state.selectedCandidate.id === action.payload.candidateId) {
        state.selectedCandidate.education = action.payload.education;
      }

      // Обновляем в моковых данных
      if (mockDetailedCandidates[action.payload.candidateId]) {
        mockDetailedCandidates[action.payload.candidateId].education = action.payload.education;
      }
    },

    // Обновление опыта работы кандидата
    updateCandidateWorkExperience: (
      state,
      action: PayloadAction<{ candidateId: string; workExperience: CandidateWorkExperience[] }>
    ) => {
      if (state.selectedCandidate && state.selectedCandidate.id === action.payload.candidateId) {
        state.selectedCandidate.workExperience = action.payload.workExperience;
      }

      // Обновляем в моковых данных
      if (mockDetailedCandidates[action.payload.candidateId]) {
        mockDetailedCandidates[action.payload.candidateId].workExperience =
          action.payload.workExperience;
      }
    },
  },
});

// Экспортируем actions
export const {
  setCandidatesLoading,
  setCandidates,
  setCandidatesError,
  setSearchQuery,
  clearSearch,
  setFilters,
  clearFilters,
  setFiltersOpen,
  setSelectedCandidateLoading,
  setSelectedCandidate,
  setSelectedCandidateError,
  setCreating,
  addCandidate,
  setUpdating,
  updateCandidate,
  updateCandidateComplete,
  createCandidateComplete,
  updateCandidateEducation,
  updateCandidateWorkExperience,
  setDeleting,
  deleteCandidate,
  addNote,
  updateNote,
  deleteNote,
  addInterview,
  updateInterview,
  deleteInterview,
  setStatistics,
  updateCandidateStatus,
  loadCandidateDetails,
} = candidatesSlice.actions;

// Селекторы
export const selectCandidates = (state: { candidates: CandidatesState }) =>
  state.candidates.candidates;
export const selectFilteredCandidates = (state: { candidates: CandidatesState }) =>
  state.candidates.filteredCandidates;
export const selectSelectedCandidate = (state: { candidates: CandidatesState }) =>
  state.candidates.selectedCandidate;
export const selectFilters = (state: { candidates: CandidatesState }) => state.candidates.filters;
export const selectActiveFiltersCount = (state: { candidates: CandidatesState }) =>
  state.candidates.activeFiltersCount;
export const selectSearchQuery = (state: { candidates: CandidatesState }) =>
  state.candidates.searchQuery;
export const selectFiltersOpen = (state: { candidates: CandidatesState }) =>
  state.candidates.filtersOpen;
export const selectStatistics = (state: { candidates: CandidatesState }) =>
  state.candidates.statistics;
export const selectIsLoading = (state: { candidates: CandidatesState }) =>
  state.candidates.isLoading;
export const selectIsLoadingDetails = (state: { candidates: CandidatesState }) =>
  state.candidates.isLoadingDetails;
export const selectIsCreating = (state: { candidates: CandidatesState }) =>
  state.candidates.isCreating;
export const selectIsUpdating = (state: { candidates: CandidatesState }) =>
  state.candidates.isUpdating;
export const selectIsDeleting = (state: { candidates: CandidatesState }) =>
  state.candidates.isDeleting;
export const selectError = (state: { candidates: CandidatesState }) => state.candidates.error;
export const selectDetailsError = (state: { candidates: CandidatesState }) =>
  state.candidates.detailsError;
export const selectLastUpdated = (state: { candidates: CandidatesState }) =>
  state.candidates.lastUpdated;

// Экспортируем reducer
export default candidatesSlice.reducer;
