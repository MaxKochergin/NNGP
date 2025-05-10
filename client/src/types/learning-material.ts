// Типы статусов для учебных материалов
export type LearningMaterialStatus = 'active' | 'draft' | 'archived';

// Типы учебных материалов
export type LearningMaterialType = 'article' | 'video' | 'presentation' | 'document' | 'course';

// Уровни сложности
export type LearningMaterialDifficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Структура учебного материала
export interface LearningMaterial {
  id: string;
  title: string;
  description: string;
  type: LearningMaterialType;
  difficulty: LearningMaterialDifficulty;
  status: LearningMaterialStatus;
  departmentId?: string;
  department?: string;
  positionId?: string;
  position?: string;
  author: string;
  authorId: string;
  url?: string;
  durationMinutes?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  rating: number;
  isMandatory: boolean;
}

// Моковые данные для примера
export let mockLearningMaterials: LearningMaterial[] = [
  {
    id: '1',
    title: 'Основы проектирования в AutoCAD',
    description: 'Базовый курс по работе с AutoCAD для новых сотрудников строительной компании',
    type: 'course',
    difficulty: 'beginner',
    status: 'active',
    department: 'Конструкторский отдел',
    position: 'Инженер-конструктор',
    author: 'Иванов И.И.',
    authorId: '1',
    url: 'https://example.com/courses/autocad-basics',
    durationMinutes: 120,
    tags: ['AutoCAD', 'проектирование', 'обучение'],
    createdAt: '2025-01-15T10:30:00',
    updatedAt: '2025-02-20T14:15:00',
    viewCount: 125,
    rating: 4.8,
    isMandatory: true,
  },
  {
    id: '2',
    title: 'Современные нормы и правила строительства',
    description: 'Обзор актуальных СНиП и ГОСТ для работы инженеров-строителей',
    type: 'document',
    difficulty: 'intermediate',
    status: 'active',
    department: 'Технический отдел',
    position: 'Ведущий инженер',
    author: 'Петрова А.С.',
    authorId: '2',
    url: 'https://example.com/documents/building-regulations-2025',
    durationMinutes: 90,
    tags: ['СНиП', 'ГОСТ', 'нормативы', 'строительство'],
    createdAt: '2025-02-10T09:45:00',
    updatedAt: '2025-02-15T11:20:00',
    viewCount: 87,
    rating: 4.5,
    isMandatory: true,
  },
  {
    id: '3',
    title: 'Продвинутое моделирование в Revit',
    description: 'Курс повышения квалификации по работе в Revit для опытных архитекторов',
    type: 'video',
    difficulty: 'advanced',
    status: 'active',
    department: 'BIM-отдел',
    position: 'Архитектор',
    author: 'Сидоров А.П.',
    authorId: '3',
    url: 'https://example.com/videos/advanced-revit-modeling',
    durationMinutes: 150,
    tags: ['Revit', 'BIM', 'моделирование', '3D'],
    createdAt: '2025-01-20T14:30:00',
    updatedAt: '2025-03-05T16:45:00',
    viewCount: 93,
    rating: 4.9,
    isMandatory: false,
  },
  {
    id: '4',
    title: 'Лидерство в управлении строительными проектами',
    description: 'Презентация по ключевым аспектам управления командой в строительных проектах',
    type: 'presentation',
    difficulty: 'intermediate',
    status: 'active',
    department: 'Управление проектами',
    position: 'Руководитель проекта',
    author: 'Козлова Е.В.',
    authorId: '4',
    url: 'https://example.com/presentations/leadership-in-construction-projects',
    durationMinutes: 45,
    tags: ['лидерство', 'управление', 'проекты', 'команда'],
    createdAt: '2025-03-01T10:00:00',
    updatedAt: '2025-03-10T13:30:00',
    viewCount: 56,
    rating: 4.7,
    isMandatory: true,
  },
  {
    id: '5',
    title: 'BIM-координация в крупных проектах',
    description: 'Статья о методах эффективной BIM-координации в масштабных строительных проектах',
    type: 'article',
    difficulty: 'expert',
    status: 'active',
    department: 'BIM-отдел',
    position: 'BIM-координатор',
    author: 'Соколов Д.А.',
    authorId: '5',
    url: 'https://example.com/articles/bim-coordination-large-projects',
    durationMinutes: 20,
    tags: ['BIM', 'координация', 'управление проектами', 'коллаборация'],
    createdAt: '2025-02-25T09:15:00',
    updatedAt: '2025-03-10T14:45:00',
    viewCount: 112,
    rating: 4.6,
    isMandatory: false,
  },
  {
    id: '6',
    title: 'Техника безопасности на строительной площадке',
    description: 'Обязательный курс по технике безопасности для всех сотрудников',
    type: 'course',
    difficulty: 'beginner',
    status: 'active',
    department: '',
    position: '',
    author: 'Новиков И.М.',
    authorId: '6',
    url: 'https://example.com/courses/construction-site-safety',
    durationMinutes: 60,
    tags: ['безопасность', 'строительство', 'инструктаж'],
    createdAt: '2025-01-05T08:30:00',
    updatedAt: '2025-01-15T11:20:00',
    viewCount: 215,
    rating: 4.3,
    isMandatory: true,
  },
  {
    id: '7',
    title: 'Использование экологичных материалов в строительстве',
    description: 'Обзор современных экологичных материалов и их применение в проектах',
    type: 'article',
    difficulty: 'intermediate',
    status: 'draft',
    department: 'Отдел проектирования',
    position: 'Инженер-проектировщик',
    author: 'Морозова С.И.',
    authorId: '7',
    url: 'https://example.com/articles/eco-friendly-materials',
    durationMinutes: 25,
    tags: ['экология', 'материалы', 'устойчивое развитие'],
    createdAt: '2025-03-25T15:45:00',
    updatedAt: '2025-03-25T15:45:00',
    viewCount: 0,
    rating: 0,
    isMandatory: false,
  },
  {
    id: '8',
    title: 'Оптимизация сметной документации',
    description: 'Видеокурс по составлению и оптимизации смет в строительстве',
    type: 'video',
    difficulty: 'advanced',
    status: 'archived',
    department: 'Финансовый отдел',
    position: 'Сметчик',
    author: 'Волков М.С.',
    authorId: '8',
    url: 'https://example.com/videos/budget-optimization',
    durationMinutes: 90,
    tags: ['смета', 'финансы', 'оптимизация', 'документация'],
    createdAt: '2024-10-15T09:30:00',
    updatedAt: '2025-01-10T14:20:00',
    viewCount: 64,
    rating: 4.2,
    isMandatory: false,
  },
];

// Функция для удаления учебного материала из моковых данных
export const deleteMaterial = (id: string): boolean => {
  const initialLength = mockLearningMaterials.length;
  mockLearningMaterials = mockLearningMaterials.filter(material => material.id !== id);

  // Возвращаем true, если материал был удален (длина массива изменилась)
  return mockLearningMaterials.length < initialLength;
};
