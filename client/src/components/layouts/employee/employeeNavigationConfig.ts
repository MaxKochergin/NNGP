import {
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Business as BusinessIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

export interface NavigationItem {
  title: string;
  path: string;
  icon: any;
}

// Элементы навигации для сотрудника
export const employeeNavigationItems: NavigationItem[] = [
  {
    title: 'Мой профиль',
    path: '/app/employee/profile',
    icon: PersonIcon,
  },
  {
    title: 'Компетенции',
    path: '/app/employee/competencies',
    icon: BarChartIcon,
  },
  {
    title: 'Доступные тесты',
    path: '/app/employee/tests/available',
    icon: AssignmentIcon,
  },
  {
    title: 'История тестов',
    path: '/app/employee/tests/history',
    icon: AssignmentIcon,
  },
  {
    title: 'Учебные материалы',
    path: '/app/employee/learning/materials',
    icon: SchoolIcon,
  },
  {
    title: 'Курсы',
    path: '/app/employee/learning/courses',
    icon: SchoolIcon,
  },
  {
    title: 'Моя команда',
    path: '/app/employee/team',
    icon: BusinessIcon,
  },
  {
    title: 'Уведомления',
    path: '/app/notifications',
    icon: NotificationsIcon,
  },
  {
    title: 'Настройки',
    path: '/app/settings',
    icon: SettingsIcon,
  },
  {
    title: 'Помощь',
    path: '/app/help',
    icon: HelpIcon,
  },
];

export default employeeNavigationItems;
