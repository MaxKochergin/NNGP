import {
  Assignment as AssignmentIcon,
  AssignmentInd as AssignmentIndIcon,
  BarChart as BarChartIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
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

// Элементы навигации для HR
export const hrNavigationItems: NavigationItem[] = [
  {
    title: 'Мой профиль',
    path: '/app/hr/profile',
    icon: PersonIcon,
  },
  {
    title: 'Кандидаты',
    path: '/app/hr/candidates',
    icon: GroupIcon,
  },
  {
    title: 'Сотрудники',
    path: '/app/hr/employees',
    icon: BusinessIcon,
  },
  {
    title: 'Тесты',
    path: '/app/hr/tests',
    icon: AssignmentIcon,
  },
  {
    title: 'Результаты тестов',
    path: '/app/hr/tests/results',
    icon: AssignmentIndIcon,
  },
  {
    title: 'Аналитика',
    path: '/app/hr/analytics',
    icon: BarChartIcon,
  },
  {
    title: 'Учебные материалы',
    path: '/app/hr/learning',
    icon: SchoolIcon,
  },
  {
    title: 'Назначения курсов',
    path: '/app/hr/assignments',
    icon: AssignmentIndIcon,
  },
  {
    title: 'Уведомления',
    path: '/app/hr/notifications',
    icon: NotificationsIcon,
  },
  {
    title: 'Настройки',
    path: '/app/hr/settings',
    icon: SettingsIcon,
  },
  {
    title: 'Помощь',
    path: '/app/hr/help',
    icon: HelpIcon,
  },
];

export default hrNavigationItems;
