import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Типы для данных профиля
export interface BasicInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  aboutMe: string;
  avatar?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  rating: number;
  category: string;
}

export interface HrProfileState {
  basicInfo: BasicInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Начальное состояние с тестовыми данными
const initialState: HrProfileState = {
  basicInfo: {
    firstName: 'Елена',
    lastName: 'Смирнова',
    email: 'hr1@example.com',
    phone: '+7 999 123-45-67',
    location: 'Москва',
    aboutMe:
      'HR-специалист с 5-летним опытом работы в подборе технических специалистов для строительных компаний. Специализируюсь на найме инженеров ПГС, проектировщиков и BIM-специалистов. Провожу собеседования, оцениваю профессиональные навыки кандидатов, разрабатываю программы адаптации новых сотрудников.',
  },
  experience: [
    {
      id: '1',
      company: 'ООО "СтройТех"',
      position: 'Ведущий HR-специалист',
      startDate: '2021-03',
      isCurrent: true,
      description: 'Подбор технических специалистов для строительных проектов',
      achievements: [
        'Сократил время закрытия вакансий на 30%',
        'Внедрил систему оценки технических компетенций',
        'Организовал программу адаптации для 50+ новых сотрудников',
      ],
    },
    {
      id: '2',
      company: 'ГК "Мосстрой"',
      position: 'HR-специалист',
      startDate: '2019-06',
      endDate: '2021-02',
      isCurrent: false,
      description: 'Подбор персонала и развитие HR-процессов',
      achievements: [
        'Разработал систему грейдов для технических должностей',
        'Провел более 200 собеседований',
        'Снизил текучесть кадров на 25%',
      ],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'МГУ им. М.В. Ломоносова',
      degree: 'Магистр',
      fieldOfStudy: 'Управление персоналом',
      startDate: '2017-09',
      endDate: '2019-06',
      isCurrent: false,
      description: 'Специализация: HR-аналитика и управление талантами',
      gpa: '4.8',
    },
    {
      id: '2',
      institution: 'РУДН',
      degree: 'Бакалавр',
      fieldOfStudy: 'Психология',
      startDate: '2013-09',
      endDate: '2017-06',
      isCurrent: false,
      gpa: '4.5',
    },
  ],
  skills: [
    {
      id: '1',
      name: 'Подбор технических специалистов в строительстве',
      rating: 5,
      category: 'Подбор персонала',
    },
    {
      id: '2',
      name: 'Проведение технических интервью инженеров',
      rating: 5,
      category: 'Оценка персонала',
    },
    {
      id: '3',
      name: 'Оценка инженерных компетенций',
      rating: 5,
      category: 'Оценка персонала',
    },
    {
      id: '4',
      name: 'HeadHunter/Superjob/Хабр Карьера',
      rating: 5,
      category: 'Программное обеспечение',
    },
    {
      id: '5',
      name: 'Программы адаптации для технических специалистов',
      rating: 4,
      category: 'Адаптация',
    },
    {
      id: '6',
      name: 'Трудовое законодательство в строительстве',
      rating: 4,
      category: 'Законодательство',
    },
    {
      id: '7',
      name: 'HR-метрики и KPI',
      rating: 4,
      category: 'HR-аналитика',
    },
    {
      id: '8',
      name: 'Управление командой HR-специалистов',
      rating: 4,
      category: 'Мотивация',
    },
    {
      id: '9',
      name: 'Разработка обучающих программ для инженеров',
      rating: 4,
      category: 'Обучение',
    },
    {
      id: '10',
      name: 'Система грейдов для технических должностей',
      rating: 4,
      category: 'Мотивация',
    },
    {
      id: '11',
      name: 'Работа с конфликтами в техническом коллективе',
      rating: 5,
      category: 'Личностные качества',
    },
    {
      id: '12',
      name: 'Power BI и продвинутый Excel для HR-аналитики',
      rating: 4,
      category: 'Программное обеспечение',
    },
    {
      id: '13',
      name: 'Стратегическое планирование в HR',
      rating: 4,
      category: 'HR-аналитика',
    },
    {
      id: '14',
      name: 'Деловые переговоры',
      rating: 5,
      category: 'Личностные качества',
    },
    {
      id: '15',
      name: 'ATS-системы (Talantix, Huntflow)',
      rating: 4,
      category: 'Программное обеспечение',
    },
    {
      id: '16',
      name: 'Международные стандарты в области HR',
      rating: 3,
      category: 'Законодательство',
    },
    {
      id: '17',
      name: 'Talent management в технических отраслях',
      rating: 4,
      category: 'Обучение',
    },
  ],
  isLoading: false,
  error: null,
  lastUpdated: null,
};

const hrProfileSlice = createSlice({
  name: 'hrProfile',
  initialState,
  reducers: {
    // Основная информация
    updateBasicInfo: (state, action: PayloadAction<Partial<BasicInfo>>) => {
      state.basicInfo = { ...state.basicInfo, ...action.payload };
      state.lastUpdated = new Date().toISOString();
    },

    // Опыт работы
    addExperience: (state, action: PayloadAction<Omit<Experience, 'id'>>) => {
      const newExperience: Experience = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.experience.unshift(newExperience);
      state.lastUpdated = new Date().toISOString();
    },

    updateExperience: (state, action: PayloadAction<Experience>) => {
      const index = state.experience.findIndex(exp => exp.id === action.payload.id);
      if (index !== -1) {
        state.experience[index] = action.payload;
        state.lastUpdated = new Date().toISOString();
      }
    },

    deleteExperience: (state, action: PayloadAction<string>) => {
      state.experience = state.experience.filter(exp => exp.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Образование
    addEducation: (state, action: PayloadAction<Omit<Education, 'id'>>) => {
      const newEducation: Education = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.education.unshift(newEducation);
      state.lastUpdated = new Date().toISOString();
    },

    updateEducation: (state, action: PayloadAction<Education>) => {
      const index = state.education.findIndex(edu => edu.id === action.payload.id);
      if (index !== -1) {
        state.education[index] = action.payload;
        state.lastUpdated = new Date().toISOString();
      }
    },

    deleteEducation: (state, action: PayloadAction<string>) => {
      state.education = state.education.filter(edu => edu.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Навыки
    addSkill: (state, action: PayloadAction<Omit<Skill, 'id'>>) => {
      const newSkill: Skill = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.skills.push(newSkill);
      state.lastUpdated = new Date().toISOString();
    },

    updateSkill: (state, action: PayloadAction<Skill>) => {
      const index = state.skills.findIndex(skill => skill.id === action.payload.id);
      if (index !== -1) {
        state.skills[index] = action.payload;
        state.lastUpdated = new Date().toISOString();
      }
    },

    deleteSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter(skill => skill.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },

    // Состояние загрузки и ошибки
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Сброс всех данных
    resetProfile: state => {
      return initialState;
    },

    // Загрузка полного профиля (например, с сервера)
    loadProfile: (state, action: PayloadAction<Omit<HrProfileState, 'isLoading' | 'error'>>) => {
      state.basicInfo = action.payload.basicInfo;
      state.experience = action.payload.experience;
      state.education = action.payload.education;
      state.skills = action.payload.skills;
      state.lastUpdated = action.payload.lastUpdated;
    },
  },
});

export const {
  updateBasicInfo,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  updateSkill,
  deleteSkill,
  setLoading,
  setError,
  resetProfile,
  loadProfile,
} = hrProfileSlice.actions;

export default hrProfileSlice.reducer;

// Селекторы
export const selectHrProfile = (state: { hrProfile: HrProfileState }) => state.hrProfile;
export const selectBasicInfo = (state: { hrProfile: HrProfileState }) => state.hrProfile.basicInfo;
export const selectExperience = (state: { hrProfile: HrProfileState }) =>
  state.hrProfile.experience;
export const selectEducation = (state: { hrProfile: HrProfileState }) => state.hrProfile.education;
export const selectSkills = (state: { hrProfile: HrProfileState }) => state.hrProfile.skills;
export const selectIsLoading = (state: { hrProfile: HrProfileState }) => state.hrProfile.isLoading;
export const selectError = (state: { hrProfile: HrProfileState }) => state.hrProfile.error;
export const selectLastUpdated = (state: { hrProfile: HrProfileState }) =>
  state.hrProfile.lastUpdated;
