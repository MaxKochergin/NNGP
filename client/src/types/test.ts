// client/src/types/test.ts
export interface AnswerOption {
  id?: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id?: string;
  testId: string;
  content: string;
  type: string; // 'single-choice', 'multiple-choice', 'text', etc.
  correctAnswer?: string;
  score?: number;
  createdById: string;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;

  answerOptions?: AnswerOption[];
}

export interface Test {
  id?: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  createdById: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;

  questions?: Question[];
}

export interface SpecializationTest {
  id?: string;
  specializationId: string;
  testId: string;
  isRequired: boolean;
  createdAt?: string;
  updatedAt?: string;

  specialization?: {
    id: string;
    name: string;
  };
  test?: Test;
}

export interface UserAnswer {
  id?: string;
  testAttemptId: string;
  questionId: string;
  answerOptionId?: string;
  textAnswer?: string;
  createdAt?: string;
  updatedAt?: string;

  question?: Question;
  answerOption?: AnswerOption;
}

export interface TestAttempt {
  id?: string;
  userId: string;
  testId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  isPassed?: boolean;
  createdAt?: string;
  updatedAt?: string;

  test?: Test;
  userAnswers?: UserAnswer[];
}

// DTO interfaces
export interface CreateTestDto {
  title: string;
  description?: string;
  durationMinutes?: number;
}

export interface UpdateTestDto {
  title?: string;
  description?: string;
  durationMinutes?: number;
  isPublished?: boolean;
}

export interface CreateQuestionDto {
  testId: string;
  content: string;
  type: string;
  correctAnswer?: string;
  score?: number;
}

export interface UpdateQuestionDto {
  content?: string;
  type?: string;
  correctAnswer?: string;
  score?: number;
  isApproved?: boolean;
}

export interface CreateAnswerOptionDto {
  questionId: string;
  content: string;
  isCorrect: boolean;
}

export interface UpdateAnswerOptionDto {
  content?: string;
  isCorrect?: boolean;
}

export interface CreateTestAttemptDto {
  testId: string;
}

export interface SubmitAnswerDto {
  testAttemptId: string;
  questionId: string;
  answerOptionId?: string;
  textAnswer?: string;
}

export interface CompleteTestAttemptDto {
  testAttemptId: string;
}

export interface AssignTestToSpecializationDto {
  specializationId: string;
  testId: string;
  isRequired?: boolean;
}

export type TestStatus = 'active' | 'draft' | 'archived';
export type TestTargetAudience = 'candidates' | 'employees' | 'both';
export type TestType = 'professional' | 'psychological' | 'knowledge' | 'skills';
export type TestDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface TestQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text' | 'scale';
  options?: {
    id: string;
    text: string;
    isCorrect?: boolean;
  }[];
  correctAnswer?: string;
  points: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  targetAudience: TestTargetAudience;
  duration: number; // в минутах
  passingScore: number;
  type: TestType;
  difficulty: TestDifficulty;
  status: TestStatus;
  department?: string;
  position?: string;
  questions: TestQuestion[];
  createdAt: string;
  updatedAt: string;
  author: string;
}

export const mockTests: Test[] = [
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
          { id: 'o3', text: 'ELLIPSE', isCorrect: false },
          { id: 'o4', text: 'ROUND', isCorrect: false },
        ],
        points: 5,
      },
      {
        id: 'q2',
        text: 'Для чего используется команда OFFSET?',
        type: 'single',
        options: [
          { id: 'o1', text: 'Для создания параллельной копии объекта', isCorrect: true },
          { id: 'o2', text: 'Для смещения начала координат', isCorrect: false },
          { id: 'o3', text: 'Для поворота объекта', isCorrect: false },
          { id: 'o4', text: 'Для изменения масштаба объекта', isCorrect: false },
        ],
        points: 5,
      },
    ],
    createdAt: '2025-03-15',
    updatedAt: '2025-03-20',
    author: 'Иванов И.И.',
  },
  {
    id: '2',
    title: 'Тест на знание строительных норм и правил',
    description: 'Проверка знаний актуальных СНиП и ГОСТ',
    targetAudience: 'employees',
    duration: 90,
    passingScore: 80,
    type: 'knowledge',
    difficulty: 'hard',
    status: 'active',
    department: 'Технический отдел',
    questions: [
      {
        id: 'q1',
        text: 'Какой СНиП регламентирует пожарную безопасность зданий?',
        type: 'single',
        options: [
          { id: 'o1', text: 'СНиП 21-01-97', isCorrect: true },
          { id: 'o2', text: 'СНиП 23-05-95', isCorrect: false },
          { id: 'o3', text: 'СНиП 31-06-2009', isCorrect: false },
          { id: 'o4', text: 'СНиП 52-01-2003', isCorrect: false },
        ],
        points: 10,
      },
      {
        id: 'q2',
        text: 'Укажите минимальную ширину эвакуационного выхода',
        type: 'single',
        options: [
          { id: 'o1', text: '0.8 м', isCorrect: false },
          { id: 'o2', text: '1.2 м', isCorrect: true },
          { id: 'o3', text: '1.5 м', isCorrect: false },
          { id: 'o4', text: '2.0 м', isCorrect: false },
        ],
        points: 10,
      },
    ],
    createdAt: '2025-02-10',
    updatedAt: '2025-02-15',
    author: 'Петрова А.С.',
  },
  {
    id: '3',
    title: 'Тест на знание Revit',
    description: 'Тест для оценки навыков работы в Revit для архитекторов и конструкторов',
    targetAudience: 'both',
    duration: 75,
    passingScore: 70,
    type: 'professional',
    difficulty: 'medium',
    status: 'active',
    position: 'Архитектор',
    questions: [
      {
        id: 'q1',
        text: 'Что такое семейство в Revit?',
        type: 'single',
        options: [
          { id: 'o1', text: 'Группа связанных элементов проекта', isCorrect: false },
          { id: 'o2', text: 'Шаблон для создания элементов с общими параметрами', isCorrect: true },
          { id: 'o3', text: 'Система классификации материалов', isCorrect: false },
          { id: 'o4', text: 'Набор видов проекта', isCorrect: false },
        ],
        points: 7,
      },
      {
        id: 'q2',
        text: 'Какие типы семейств существуют в Revit?',
        type: 'multiple',
        options: [
          { id: 'o1', text: 'Системные', isCorrect: true },
          { id: 'o2', text: 'Загружаемые', isCorrect: true },
          { id: 'o3', text: 'Контекстные', isCorrect: true },
          { id: 'o4', text: 'Программные', isCorrect: false },
        ],
        points: 8,
      },
    ],
    createdAt: '2025-01-20',
    updatedAt: '2025-03-05',
    author: 'Сидоров А.П.',
  },
  {
    id: '4',
    title: 'Психологический тест для руководителей',
    description: 'Тест для оценки лидерских качеств и навыков управления',
    targetAudience: 'employees',
    duration: 45,
    passingScore: 60,
    type: 'psychological',
    difficulty: 'medium',
    status: 'draft',
    position: 'Руководитель проекта',
    questions: [
      {
        id: 'q1',
        text: 'Оцените свою способность делегировать задачи от 1 до 10',
        type: 'scale',
        points: 5,
      },
      {
        id: 'q2',
        text: 'Как вы обычно разрешаете конфликты в команде?',
        type: 'text',
        points: 10,
      },
    ],
    createdAt: '2025-04-01',
    updatedAt: '2025-04-01',
    author: 'Козлова Е.В.',
  },
  {
    id: '5',
    title: 'Тест на знание BIM-координации',
    description: 'Проверка знаний процессов и инструментов BIM-координации',
    targetAudience: 'employees',
    duration: 60,
    passingScore: 75,
    type: 'professional',
    difficulty: 'expert',
    status: 'active',
    department: 'BIM-отдел',
    position: 'BIM-координатор',
    questions: [
      {
        id: 'q1',
        text: 'Какой формат является стандартом для обмена BIM данными?',
        type: 'single',
        options: [
          { id: 'o1', text: 'DWG', isCorrect: false },
          { id: 'o2', text: 'PDF', isCorrect: false },
          { id: 'o3', text: 'IFC', isCorrect: true },
          { id: 'o4', text: 'RVT', isCorrect: false },
        ],
        points: 5,
      },
      {
        id: 'q2',
        text: 'Что такое LOD в BIM?',
        type: 'single',
        options: [
          { id: 'o1', text: 'Level of Detail', isCorrect: false },
          { id: 'o2', text: 'Level of Development', isCorrect: true },
          { id: 'o3', text: 'Level of Design', isCorrect: false },
          { id: 'o4', text: 'Level of Drawing', isCorrect: false },
        ],
        points: 5,
      },
    ],
    createdAt: '2025-02-25',
    updatedAt: '2025-03-10',
    author: 'Соколов Д.А.',
  },
];
