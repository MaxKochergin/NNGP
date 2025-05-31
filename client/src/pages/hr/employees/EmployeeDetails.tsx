import { useEffect, useState } from 'react';
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Book as BookIcon,
  CalendarMonth as CalendarMonthIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  EmojiEvents as EmojiEventsIcon,
  EventNote as EventNoteIcon,
  LocalOffer as LocalOfferIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

// Расширенные тестовые данные для сотрудников
const mockEmployeesDetails = [
  {
    id: '1',
    name: 'Смирнов Дмитрий Константинович',
    position: 'Ведущий инженер-конструктор',
    department: 'Конструкторский отдел',
    experience: '5 лет',
    status: 'Работает',
    hireDate: '2025-04-15',
    skills: [
      'AutoCAD',
      'Revit',
      'ЛИРА-САПР',
      'Железобетонные конструкции',
      'Нормативная документация',
    ],
    avatar: null,
    email: 'smirnov@example.com',
    phone: '+7 (999) 123-45-67',
    salary: '180 000 руб.',
    location: 'Москва',
    birthDate: '1990-05-15',
    education: [
      {
        id: '1',
        degree: 'Магистр',
        specialty: 'Промышленное и гражданское строительство',
        university: 'Московский государственный строительный университет',
        year: '2015',
        description: 'Специализация: проектирование железобетонных конструкций. Диплом с отличием.',
      },
      {
        id: '2',
        degree: 'Бакалавр',
        specialty: 'Строительство',
        university: 'Московский государственный строительный университет',
        year: '2013',
        description: 'Направление: промышленное и гражданское строительство.',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'ООО "СтройПроект"',
        position: 'Инженер-конструктор 1 категории',
        period: '2020-2025',
        description:
          'Проектирование железобетонных конструкций многоквартирных жилых домов. Расчет конструкций в ЛИРА-САПР. Разработка рабочей документации.',
      },
      {
        id: '2',
        company: 'ООО "Стройэксперт"',
        position: 'Инженер-конструктор 2 категории',
        period: '2016-2020',
        description:
          'Разработка чертежей строительных конструкций. Оформление проектной документации. Помощь ведущим специалистам в расчетах.',
      },
    ],
    certifications: [
      {
        id: '1',
        title: 'Сертифицированный специалист Autodesk Revit',
        issuer: 'Autodesk',
        date: '2025-01-15',
        validUntil: '2028-01-15',
        description:
          'Профессиональная сертификация по работе с Revit для проектирования зданий и сооружений',
      },
      {
        id: '2',
        title: 'BIM-менеджер',
        issuer: 'Университет МГСУ',
        date: '2024-09-10',
        validUntil: '2026-09-10',
        description: 'Профессиональная переподготовка по управлению BIM-проектами',
      },
    ],
    projects: [
      {
        id: '1',
        name: 'ЖК "Солнечный город"',
        role: 'Ведущий инженер-конструктор',
        period: '2025-01-15 - настоящее время',
        description:
          'Разработка конструктивных решений для многоэтажного жилого комплекса. Руководство группой инженеров.',
      },
      {
        id: '2',
        name: 'Бизнес-центр "Горизонт"',
        role: 'Инженер-конструктор',
        period: '2024-06-10 - 2025-01-10',
        description: 'Проектирование несущих конструкций 25-этажного административного здания.',
      },
      {
        id: '3',
        name: 'Торговый центр "Меридиан"',
        role: 'Инженер-конструктор',
        period: '2023-10-05 - 2024-05-30',
        description: 'Разработка конструкций покрытия большепролетного торгового центра.',
      },
    ],
    evaluations: [
      {
        id: '1',
        date: '2025-03-15',
        title: 'Ежегодная оценка',
        rating: 4.8,
        description:
          'Отличные результаты по проекту ЖК "Солнечный город". Соблюдение сроков и высокое качество работы.',
        evaluator: 'Смирнов А.П., Главный конструктор',
      },
      {
        id: '2',
        date: '2024-09-20',
        title: 'Квартальная оценка',
        rating: 4.5,
        description:
          'Успешное завершение проекта бизнес-центра "Горизонт". Отмечена хорошая координация с архитектурным отделом.',
        evaluator: 'Смирнов А.П., Главный конструктор',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-05',
        text: 'Запрос на обучение по курсу "Проектирование высотных зданий". Ожидается одобрение.',
        author: 'Петрова А.С. (HR)',
      },
      {
        id: '2',
        date: '2025-03-20',
        text: 'Отмечен руководством за инициативу по оптимизации конструкций в проекте ЖК "Солнечный город".',
        author: 'Смирнов А.П. (Главный конструктор)',
      },
    ],
    training: [
      {
        id: '1',
        title: 'Проектирование в среде Revit 2025',
        provider: 'Центр компьютерного обучения',
        date: '2025-02-10',
        duration: '40 часов',
        certificate: true,
        description:
          'Курс повышения квалификации по новейшей версии Revit 2025 с фокусом на конструктивные элементы.',
      },
      {
        id: '2',
        title: 'Современные методы расчета железобетонных конструкций',
        provider: 'МГСУ, Факультет повышения квалификации',
        date: '2024-11-15',
        duration: '72 часа',
        certificate: true,
        description:
          'Углубленный курс по современным методикам расчета на базе актуальных нормативных документов.',
      },
    ],
  },
  {
    id: '2',
    name: 'Петрова Анна Сергеевна',
    position: 'Инженер-проектировщик ОВиК',
    department: 'Отдел инженерных систем',
    experience: '3 года',
    status: 'Работает',
    hireDate: '2025-04-10',
    skills: [
      'AutoCAD',
      'Revit MEP',
      'Расчет систем вентиляции',
      'BIM-проектирование',
      'Нормативная документация',
    ],
    avatar: null,
    email: 'petrova@example.com',
    phone: '+7 (999) 234-56-78',
    salary: '150 000 руб.',
    location: 'Москва',
    birthDate: '1993-08-22',
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
          'Проектирование систем отопления, вентиляции и кондиционирования для жилых и общественных зданий. BIM-моделирование инженерных систем.',
      },
    ],
    certifications: [
      {
        id: '1',
        title: 'Revit MEP Certified Professional',
        issuer: 'Autodesk',
        date: '2024-11-12',
        validUntil: '2027-11-12',
        description:
          'Профессиональная сертификация по работе с Revit MEP для инженерных систем зданий',
      },
    ],
    projects: [
      {
        id: '1',
        name: 'ЖК "Солнечный город"',
        role: 'Инженер-проектировщик ОВиК',
        period: '2025-01-15 - настоящее время',
        description:
          'Проектирование систем отопления, вентиляции и кондиционирования жилого комплекса.',
      },
      {
        id: '2',
        name: 'Бизнес-центр "Горизонт"',
        role: 'Инженер-проектировщик ОВиК',
        period: '2024-08-10 - 2025-01-10',
        description: 'Разработка инженерных систем 25-этажного административного здания.',
      },
    ],
    evaluations: [
      {
        id: '1',
        date: '2025-03-15',
        title: 'Ежегодная оценка',
        rating: 4.6,
        description: 'Высокий уровень квалификации. Быстрая адаптация к новым проектам.',
        evaluator: 'Николаев К.Р., Руководитель отдела инженерных систем',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-08',
        text: 'Назначена ответственной за координацию систем ОВиК с архитектурными решениями в проекте ЖК "Солнечный город".',
        author: 'Николаев К.Р. (Руководитель отдела)',
      },
    ],
    training: [
      {
        id: '1',
        title: 'Энергоэффективные системы вентиляции',
        provider: 'Академия инженерных систем',
        date: '2025-03-05',
        duration: '24 часа',
        certificate: true,
        description: 'Курс по современным энергоэффективным решениям в системах вентиляции зданий.',
      },
    ],
  },
  {
    id: '3',
    name: 'Сидоров Алексей Петрович',
    position: 'Главный инженер проекта',
    department: 'Управление проектами',
    experience: '8 лет',
    status: 'Работает',
    hireDate: '2024-11-03',
    skills: [
      'BIM',
      'Управление проектами',
      'Нормативная документация',
      'Техническая экспертиза',
      'Revit',
      'MS Project',
    ],
    avatar: null,
    email: 'sidorov@example.com',
    phone: '+7 (999) 345-67-89',
    salary: '250 000 руб.',
    location: 'Москва',
    birthDate: '1985-03-10',
    education: [
      {
        id: '1',
        degree: 'Магистр',
        specialty: 'Промышленное и гражданское строительство',
        university: 'Московский государственный строительный университет',
        year: '2010',
        description: 'Специализация: управление строительными проектами.',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'ООО "ПроектСтрой"',
        position: 'Главный инженер проекта',
        period: '2020-2024',
        description:
          'Руководство проектными командами, координация различных разделов проекта, взаимодействие с заказчиками и подрядчиками.',
      },
      {
        id: '2',
        company: 'ООО "СтройМастер"',
        position: 'Ведущий инженер',
        period: '2016-2020',
        description:
          'Разработка проектной документации, авторский надзор, техническая экспертиза проектных решений.',
      },
    ],
    certifications: [
      {
        id: '1',
        title: 'Project Management Professional (PMP)',
        issuer: 'Project Management Institute',
        date: '2023-05-20',
        validUntil: '2026-05-20',
        description: 'Международная сертификация в области управления проектами',
      },
      {
        id: '2',
        title: 'BIM Manager',
        issuer: 'Autodesk',
        date: '2022-11-15',
        validUntil: '2025-11-15',
        description: 'Сертификация по управлению BIM-процессами в проектировании',
      },
    ],
    projects: [
      {
        id: '1',
        name: 'ЖК "Солнечный город"',
        role: 'Главный инженер проекта',
        period: '2024-11-10 - настоящее время',
        description:
          'Управление проектом строительства жилого комплекса из 5 многоквартирных домов.',
      },
      {
        id: '2',
        name: 'Спортивный комплекс "Олимп"',
        role: 'Главный инженер проекта',
        period: '2023-06-15 - 2024-10-30',
        description:
          'Руководство разработкой проектной и рабочей документации для спортивного комплекса с бассейном и ледовой ареной.',
      },
    ],
    evaluations: [
      {
        id: '1',
        date: '2025-03-20',
        title: 'Квартальная оценка',
        rating: 4.9,
        description:
          'Отличное руководство проектом ЖК "Солнечный город". Успешное внедрение BIM-технологий.',
        evaluator: 'Васильев П.М., Технический директор',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-05',
        text: 'Предложил разработать новый стандарт BIM-моделирования для компании. Назначена встреча с руководством для обсуждения инициативы.',
        author: 'Васильев П.М. (Технический директор)',
      },
    ],
    training: [
      {
        id: '1',
        title: 'BIM-координация в строительных проектах',
        provider: 'Академия BIM',
        date: '2025-02-20',
        duration: '40 часов',
        certificate: true,
        description:
          'Курс повышения квалификации по координации BIM-моделей в крупных строительных проектах.',
      },
    ],
  },
  {
    id: '4',
    name: 'Козлова Екатерина Владимировна',
    position: 'Главный архитектор',
    department: 'Архитектурный отдел',
    experience: '7 лет',
    status: 'Отпуск',
    hireDate: '2025-01-15',
    skills: [
      'ArchiCAD',
      'Revit',
      '3D моделирование',
      'Концептуальное проектирование',
      'Adobe Photoshop',
      'SketchUp',
    ],
    avatar: null,
    email: 'kozlova@example.com',
    phone: '+7 (999) 456-78-90',
    salary: '220 000 руб.',
    location: 'Москва',
    birthDate: '1989-11-25',
    education: [
      {
        id: '1',
        degree: 'Магистр',
        specialty: 'Архитектура',
        university: 'Московский архитектурный институт',
        year: '2015',
        description:
          'Специализация: архитектурное проектирование жилых и общественных зданий. Диплом с отличием.',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'ООО "АрхПроект"',
        position: 'Ведущий архитектор',
        period: '2020-2024',
        description:
          'Разработка архитектурных концепций и проектной документации для жилых и общественных зданий. Руководство группой архитекторов.',
      },
      {
        id: '2',
        company: 'ООО "АрхСтудия"',
        position: 'Архитектор',
        period: '2016-2020',
        description: 'Проектирование жилых зданий, разработка фасадных решений, 3D-визуализация.',
      },
    ],
    certifications: [
      {
        id: '1',
        title: 'Revit Architecture Certified Professional',
        issuer: 'Autodesk',
        date: '2024-05-10',
        validUntil: '2027-05-10',
        description: 'Профессиональная сертификация по архитектурному проектированию в Revit',
      },
    ],
    projects: [
      {
        id: '1',
        name: 'ЖК "Солнечный город"',
        role: 'Главный архитектор',
        period: '2025-01-20 - настоящее время',
        description:
          'Разработка архитектурной концепции и проектной документации жилого комплекса.',
      },
      {
        id: '2',
        name: 'Бизнес-центр "Горизонт"',
        role: 'Ведущий архитектор',
        period: '2024-06-10 - 2025-01-10',
        description:
          'Проектирование фасадов и общей концепции 25-этажного административного здания.',
      },
    ],
    evaluations: [
      {
        id: '1',
        date: '2025-03-15',
        title: 'Квартальная оценка',
        rating: 4.8,
        description:
          'Высокий профессионализм. Архитектурные решения для ЖК "Солнечный город" получили высокую оценку заказчика.',
        evaluator: 'Соколова Е.В., Руководитель архитектурного отдела',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-02',
        text: 'Находится в отпуске с 02.04.2025 по 30.04.2025. Связь поддерживает по email.',
        author: 'Петрова А.С. (HR)',
      },
    ],
    training: [
      {
        id: '1',
        title: 'Современные тенденции в жилой архитектуре',
        provider: 'Архитектурная академия',
        date: '2025-02-15',
        duration: '32 часа',
        certificate: true,
        description: 'Курс по современным архитектурным решениям в жилищном строительстве.',
      },
    ],
  },
  {
    id: '5',
    name: 'Соколов Дмитрий Александрович',
    position: 'BIM-координатор',
    department: 'BIM-отдел',
    experience: '4 года',
    status: 'Работает',
    hireDate: '2025-02-20',
    skills: ['Revit', 'Navisworks', 'BIM-координация', 'Autodesk BIM 360', 'Dynamo', 'Python'],
    avatar: null,
    email: 'sokolov@example.com',
    phone: '+7 (999) 567-89-01',
    salary: '190 000 руб.',
    location: 'Москва',
    birthDate: '1992-06-18',
    education: [
      {
        id: '1',
        degree: 'Специалист',
        specialty: 'Информационные системы и технологии',
        university: 'Московский государственный технический университет',
        year: '2016',
        description: 'Специализация: информационное моделирование в строительстве.',
      },
    ],
    workExperience: [
      {
        id: '1',
        company: 'ООО "БИМ-Проект"',
        position: 'BIM-координатор',
        period: '2020-2025',
        description:
          'Координация BIM-проектов, настройка шаблонов, обучение сотрудников. Выявление коллизий и управление данными проекта.',
      },
      {
        id: '2',
        company: 'ООО "ПроектСтрой"',
        position: 'BIM-специалист',
        period: '2018-2020',
        description:
          'Разработка информационных моделей зданий. Подготовка документации на основе BIM-моделей.',
      },
    ],
    certifications: [
      {
        id: '1',
        title: 'Autodesk Navisworks Certified Professional',
        issuer: 'Autodesk',
        date: '2024-11-20',
        validUntil: '2027-11-20',
        description:
          'Профессиональная сертификация в области координации проектов с использованием Navisworks',
      },
      {
        id: '2',
        title: 'BIM Coordinator (ISO 19650)',
        issuer: 'Building Smart International',
        date: '2024-08-15',
        validUntil: '2026-08-15',
        description: 'Международная сертификация по координации BIM-процессов',
      },
    ],
    projects: [
      {
        id: '1',
        name: 'ЖК "Солнечный город"',
        role: 'BIM-координатор',
        period: '2025-02-20 - настоящее время',
        description: 'Координация BIM-моделей различных разделов проекта жилого комплекса.',
      },
      {
        id: '2',
        name: 'Бизнес-центр "Горизонт"',
        role: 'BIM-специалист',
        period: '2024-08-10 - 2025-01-10',
        description: 'Создание и поддержка единой BIM-модели административного здания.',
      },
    ],
    evaluations: [
      {
        id: '1',
        date: '2025-03-30',
        title: 'Ежемесячная оценка',
        rating: 4.7,
        description:
          'Отличная работа по координации BIM-моделей. Внедрение автоматизации процессов с помощью Dynamo.',
        evaluator: 'Михайлов В.А., Руководитель BIM-отдела',
      },
    ],
    notes: [
      {
        id: '1',
        date: '2025-04-10',
        text: 'Разработал скрипт для автоматизации проверки коллизий между архитектурной и конструктивной моделями.',
        author: 'Михайлов В.А. (Руководитель BIM-отдела)',
      },
    ],
    training: [
      {
        id: '1',
        title: 'Программирование в Dynamo для BIM',
        provider: 'BIM Academy',
        date: '2025-03-12',
        duration: '40 часов',
        certificate: true,
        description: 'Курс по разработке скриптов автоматизации в Dynamo для Revit.',
      },
    ],
  },
];

// Интерфейс для образования сотрудника
interface Education {
  id: string;
  degree: string;
  specialty: string;
  university: string;
  year: string;
  description: string;
}

// Интерфейс для опыта работы сотрудника
interface WorkExperience {
  id: string;
  company: string;
  position: string;
  period: string;
  description: string;
}

// Интерфейс для сертификации сотрудника
interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  validUntil: string;
  description: string;
}

// Интерфейс для проектов сотрудника
interface Project {
  id: string;
  name: string;
  role: string;
  period: string;
  description: string;
}

// Интерфейс для оценок сотрудника
interface Evaluation {
  id: string;
  date: string;
  title: string;
  rating: number;
  description: string;
  evaluator: string;
}

// Интерфейс для заметок о сотруднике
interface Note {
  id: string;
  date: string;
  text: string;
  author: string;
}

// Интерфейс для данных об обучении сотрудника
interface Training {
  id: string;
  title: string;
  provider: string;
  date: string;
  duration: string;
  certificate: boolean;
  description: string;
}

// Интерфейс для расширенных данных о сотруднике
interface EmployeeDetailData {
  id: string;
  name: string;
  position: string;
  department: string;
  experience: string;
  status: string;
  hireDate: string;
  skills: string[];
  avatar: string | null;
  email: string;
  phone: string;
  salary: string;
  location: string;
  birthDate: string;
  education: Education[];
  workExperience: WorkExperience[];
  certifications: Certification[];
  projects: Project[];
  evaluations: Evaluation[];
  notes: Note[];
  training: Training[];
}

// Компонент детальной страницы сотрудника
const EmployeeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<EmployeeDetailData | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');

  // Обработчик изменения вкладки
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Загрузка данных сотрудника
  useEffect(() => {
    // Имитация загрузки данных с сервера
    const timer = setTimeout(() => {
      const foundEmployee = mockEmployeesDetails.find(emp => emp.id === id);
      if (foundEmployee) {
        setEmployee(foundEmployee);
      }
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [id]);

  // Обработчик возврата к списку сотрудников
  const handleBack = () => {
    navigate('/app/hr/employees');
  };

  // Обработчик перехода к редактированию
  const handleEdit = () => {
    // Перенаправление на страницу редактирования сотрудника
    navigate(`/app/hr/employees/${id}/edit`);
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Определение цвета для статуса
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'работает':
        return 'success';
      case 'отпуск':
        return 'info';
      case 'больничный':
        return 'warning';
      case 'удаленная работа':
        return 'secondary';
      case 'командировка':
        return 'primary';
      case 'уволен':
        return 'error';
      default:
        return 'default';
    }
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <CircularProgress sx={{ mt: 3, mb: 3 }} />
          <Typography>Загрузка данных сотрудника...</Typography>
        </Paper>
      </Container>
    );
  }

  // Если сотрудник не найден, показываем сообщение об ошибке
  if (!employee) {
    return (
      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Alert severity="error">Сотрудник не найден</Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
            Вернуться к списку
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
      {/* Верхняя панель с информацией и действиями */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Avatar
            src={employee.avatar || undefined}
            sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}
          >
            {!employee.avatar && <PersonIcon sx={{ fontSize: 40 }} />}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {employee.name}
              <Chip
                label={employee.status}
                color={getStatusColor(employee.status)}
                size="small"
                sx={{ ml: 2, verticalAlign: 'middle' }}
              />
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {employee.position} • {employee.department}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Chip
                icon={<CalendarMonthIcon fontSize="small" />}
                label={`Дата приёма: ${formatDate(employee.hireDate)}`}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<WorkIcon fontSize="small" />}
                label={`Опыт: ${employee.experience}`}
                variant="outlined"
                size="small"
              />
            </Stack>
          </Box>
          <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit} sx={{ ml: 2 }}>
            Редактировать
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{employee.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="body2" color="text.secondary">
              Телефон
            </Typography>
            <Typography variant="body1">{employee.phone}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="body2" color="text.secondary">
              Зарплата
            </Typography>
            <Typography variant="body1">{employee.salary}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Typography variant="body2" color="text.secondary">
              Местоположение
            </Typography>
            <Typography variant="body1">{employee.location}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Вкладки с дополнительной информацией */}
      <Paper sx={{ p: 0, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Основная информация" />
          <Tab icon={<SchoolIcon />} label="Образование" />
          <Tab icon={<WorkIcon />} label="Опыт работы" />
          <Tab icon={<EmojiEventsIcon />} label="Сертификаты" />
          <Tab icon={<AssignmentIcon />} label="Проекты" />
          <Tab icon={<DescriptionIcon />} label="Оценки" />
          <Tab icon={<EventNoteIcon />} label="Заметки" />
          <Tab icon={<BookIcon />} label="Обучение" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Основная информация */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Профиль сотрудника
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        Персональная информация
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Дата рождения
                        </Typography>
                        <Typography variant="body1">{formatDate(employee.birthDate)}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Департамент
                        </Typography>
                        <Typography variant="body1">{employee.department}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Должность
                        </Typography>
                        <Typography variant="body1">{employee.position}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        Навыки
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {employee.skills.map((skill, index) => (
                          <Chip key={index} label={skill} />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Образование */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Образование
              </Typography>
              {employee.education.length > 0 ? (
                <Stack spacing={2}>
                  {employee.education.map(edu => (
                    <Card key={edu.id} variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                          {edu.university}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          {edu.degree} • {edu.specialty} • {edu.year} г.
                        </Typography>
                        <Typography variant="body2">{edu.description}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">Информация об образовании отсутствует</Alert>
              )}
            </Box>
          )}

          {/* Опыт работы */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Опыт работы
              </Typography>
              {employee.workExperience.length > 0 ? (
                <Stack spacing={2}>
                  {employee.workExperience.map(exp => (
                    <Card key={exp.id} variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                          {exp.company}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          {exp.position} • {exp.period}
                        </Typography>
                        <Typography variant="body2">{exp.description}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">Информация об опыте работы отсутствует</Alert>
              )}
            </Box>
          )}

          {/* Сертификаты */}
          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Сертификаты
              </Typography>
              {employee.certifications.length > 0 ? (
                <Grid container spacing={2}>
                  {employee.certifications.map(cert => (
                    <Grid item xs={12} sm={6} md={4} key={cert.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" component="div" gutterBottom>
                            {cert.title}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Выдан: {cert.issuer}
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            <Chip
                              size="small"
                              label={`Получен: ${formatDate(cert.date)}`}
                              sx={{ mr: 1, mb: 1 }}
                            />
                            <Chip
                              size="small"
                              label={`Действует до: ${formatDate(cert.validUntil)}`}
                              sx={{ mb: 1 }}
                            />
                          </Box>
                          <Typography variant="body2">{cert.description}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">Информация о сертификатах отсутствует</Alert>
              )}
            </Box>
          )}

          {/* Проекты */}
          {activeTab === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Проекты
              </Typography>
              {employee.projects.length > 0 ? (
                <Stack spacing={2}>
                  {employee.projects.map(project => (
                    <Card key={project.id} variant="outlined">
                      <CardContent>
                        <Typography variant="h6" component="div" gutterBottom>
                          {project.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          {project.role} • {project.period}
                        </Typography>
                        <Typography variant="body2">{project.description}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">Информация о проектах отсутствует</Alert>
              )}
            </Box>
          )}

          {/* Оценки */}
          {activeTab === 5 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Оценки
              </Typography>
              {employee.evaluations.length > 0 ? (
                <Stack spacing={2}>
                  {employee.evaluations.map(evaluation => (
                    <Card key={evaluation.id} variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h6" component="div">
                            {evaluation.title}
                          </Typography>
                          <Chip
                            label={`Оценка: ${evaluation.rating}/5`}
                            color={evaluation.rating >= 4.5 ? 'success' : 'primary'}
                          />
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Дата: {formatDate(evaluation.date)} • Оценил: {evaluation.evaluator}
                        </Typography>
                        <Typography variant="body2">{evaluation.description}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">Информация об оценках отсутствует</Alert>
              )}
            </Box>
          )}

          {/* Заметки */}
          {activeTab === 6 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Заметки
              </Typography>
              {employee.notes.length > 0 ? (
                <Stack spacing={2}>
                  {employee.notes.map(note => (
                    <Card key={note.id} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          {formatDate(note.date)} • {note.author}
                        </Typography>
                        <Typography variant="body1">{note.text}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">Заметки отсутствуют</Alert>
              )}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Добавить заметку
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Введите текст заметки..."
                  value={editedNotes}
                  onChange={e => setEditedNotes(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" disabled={!editedNotes.trim()}>
                  Сохранить заметку
                </Button>
              </Box>
            </Box>
          )}

          {/* Обучение */}
          {activeTab === 7 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Обучение
              </Typography>
              {employee.training.length > 0 ? (
                <Grid container spacing={2}>
                  {employee.training.map(train => (
                    <Grid item xs={12} sm={6} md={4} key={train.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" component="div" gutterBottom>
                            {train.title}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Провайдер: {train.provider}
                          </Typography>
                          <Box sx={{ mb: 1 }}>
                            <Chip
                              size="small"
                              label={`Дата: ${formatDate(train.date)}`}
                              sx={{ mr: 1, mb: 1 }}
                            />
                            <Chip
                              size="small"
                              label={`Длительность: ${train.duration}`}
                              sx={{ mb: 1 }}
                            />
                            {train.certificate && (
                              <Chip
                                size="small"
                                icon={<DownloadIcon />}
                                label="Сертификат"
                                color="primary"
                                sx={{ mb: 1, ml: 1 }}
                              />
                            )}
                          </Box>
                          <Typography variant="body2">{train.description}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">Информация об обучении отсутствует</Alert>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default EmployeeDetails;
