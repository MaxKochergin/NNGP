// Тестовые данные пользователей для фронтенд авторизации
export interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'hr' | 'candidate' | 'employer';
  phone?: string;
  profile?: {
    aboutMe?: string;
    specialistLevel?: string;
    location?: string;
    specialization: string;
    skills: Array<{
      name: string;
      level: number;
      category: string;
    }>;
  };
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    password: 'Password123',
    firstName: 'Админ',
    lastName: 'Системы',
    role: 'admin',
  },
  {
    id: '2',
    email: 'hr@example.com',
    password: 'Password123',
    firstName: 'Анна',
    lastName: 'HR-менеджер',
    role: 'hr',
    phone: '+7 (999) 123-45-67',
    profile: {
      aboutMe: 'Опытный HR-специалист с 5+ годами опыта',
      specialistLevel: 'Senior',
      location: 'Москва, Россия',
      specialization: 'HR Management',
      skills: [
        { name: 'Recruitment', level: 9, category: 'HR' },
        { name: 'Interview Techniques', level: 8, category: 'HR' },
        { name: 'Team Management', level: 7, category: 'Management' },
      ],
    },
  },
  {
    id: '3',
    email: 'candidate@example.com',
    password: 'Password123',
    firstName: 'Петр',
    lastName: 'Кандидат',
    role: 'candidate',
    phone: '+7 (999) 987-65-43',
    profile: {
      aboutMe: 'Junior frontend разработчик, изучаю React',
      specialistLevel: 'Junior',
      location: 'Санкт-Петербург, Россия',
      specialization: 'Frontend Developer',
      skills: [
        { name: 'JavaScript', level: 6, category: 'Programming' },
        { name: 'React', level: 5, category: 'Frontend' },
        { name: 'HTML/CSS', level: 7, category: 'Frontend' },
        { name: 'Git', level: 6, category: 'Tools' },
      ],
    },
  },
  {
    id: '4',
    email: 'employer@example.com',
    password: 'Password123',
    firstName: 'Михаил',
    lastName: 'Работодатель',
    role: 'employer',
    phone: '+7 (999) 555-12-34',
    profile: {
      aboutMe: 'Представитель IT-компании, ищем талантливых разработчиков',
      specialistLevel: 'Manager',
      location: 'Москва, Россия',
      specialization: 'Business Management',
      skills: [
        { name: 'Team Leadership', level: 8, category: 'Management' },
        { name: 'Project Management', level: 7, category: 'Management' },
        { name: 'Business Development', level: 9, category: 'Business' },
      ],
    },
  },
];

// Дополнительные тестовые данные
export const mockSpecializations = [
  { id: '1', name: 'Frontend Developer', description: 'Клиентская разработка' },
  { id: '2', name: 'Backend Developer', description: 'Серверная разработка и API' },
  { id: '3', name: 'Fullstack Developer', description: 'Полный цикл веб-разработки' },
  { id: '4', name: 'HR Management', description: 'Управление персоналом' },
  { id: '5', name: 'Business Management', description: 'Бизнес-управление' },
];

export const mockSkills = [
  { id: '1', name: 'JavaScript', category: 'Programming' },
  { id: '2', name: 'TypeScript', category: 'Programming' },
  { id: '3', name: 'React', category: 'Frontend' },
  { id: '4', name: 'Vue.js', category: 'Frontend' },
  { id: '5', name: 'Node.js', category: 'Backend' },
  { id: '6', name: 'NestJS', category: 'Backend' },
  { id: '7', name: 'PostgreSQL', category: 'Database' },
  { id: '8', name: 'MongoDB', category: 'Database' },
  { id: '9', name: 'Docker', category: 'DevOps' },
  { id: '10', name: 'Git', category: 'Tools' },
  { id: '11', name: 'HTML/CSS', category: 'Frontend' },
  { id: '12', name: 'Recruitment', category: 'HR' },
  { id: '13', name: 'Interview Techniques', category: 'HR' },
  { id: '14', name: 'Team Management', category: 'Management' },
  { id: '15', name: 'Team Leadership', category: 'Management' },
  { id: '16', name: 'Project Management', category: 'Management' },
  { id: '17', name: 'Business Development', category: 'Business' },
];

export const mockTests = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Базовые знания JavaScript',
    durationMinutes: 30,
    specialization: 'Frontend Developer',
    questions: [
      {
        id: '1',
        content: 'Что такое замыкание в JavaScript?',
        type: 'multiple_choice',
        score: 10,
        options: [
          { id: '1', content: 'Функция внутри функции', isCorrect: false },
          { id: '2', content: 'Доступ к переменным внешней области видимости', isCorrect: true },
          { id: '3', content: 'Метод объекта', isCorrect: false },
          { id: '4', content: 'Тип данных', isCorrect: false },
        ],
      },
      {
        id: '2',
        content: 'Объясните разницу между let, const и var',
        type: 'text',
        score: 15,
      },
    ],
  },
  {
    id: '2',
    title: 'HR Interview Skills',
    description: 'Навыки проведения собеседований',
    durationMinutes: 45,
    specialization: 'HR Management',
    questions: [
      {
        id: '3',
        content: 'Какие вопросы лучше задавать на техническом собеседовании?',
        type: 'multiple_choice',
        score: 10,
        options: [
          { id: '5', content: 'Только теоретические вопросы', isCorrect: false },
          { id: '6', content: 'Практические задачи и теория', isCorrect: true },
          { id: '7', content: 'Только личные вопросы', isCorrect: false },
          { id: '8', content: 'Вопросы о зарплате', isCorrect: false },
        ],
      },
    ],
  },
];
