// client/src/components/layouts/Protected/navigationConfig.ts
import {
  SupervisorAccount as AdminIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

export interface NavigationItem {
  title: string;
  path: string;
  icon: any;
  roles?: string[];
}

// Элементы навигации с учетом ваших сущностей
export const navigationItems: NavigationItem[] = [
  {
    title: 'Профиль кандидата',
    path: '/candidate/profile',
    icon: PersonIcon,
    roles: ['candidate'],
  },
  {
    title: 'Профиль сотрудника',
    path: '/employee/profile',
    icon: PersonIcon,
    roles: ['employee'],
  },
  {
    title: 'Доступные тесты',
    path: '/tests/available',
    icon: AssignmentIcon,
    roles: ['candidate', 'employee'],
  },
  {
    title: 'История тестов',
    path: '/tests/history',
    icon: AssignmentIcon,
    roles: ['candidate', 'employee', 'hr'],
  },
  {
    title: 'Учебные материалы',
    path: '/learning/materials',
    icon: SchoolIcon,
    roles: ['candidate', 'employee'],
  },
  {
    title: 'Кандидаты',
    path: '/hr/candidates',
    icon: GroupIcon,
    roles: ['hr', 'admin'],
  },
  {
    title: 'Сотрудники',
    path: '/hr/employees',
    icon: BusinessIcon,
    roles: ['hr', 'admin'],
  },
  {
    title: 'Аналитика',
    path: '/analytics/reports',
    icon: BarChartIcon,
    roles: ['hr', 'admin'],
  },
  {
    title: 'Управление',
    path: '/admin/panel',
    icon: AdminIcon,
    roles: ['admin'],
  },
  {
    title: 'Настройки',
    path: '/settings',
    icon: SettingsIcon,
    // Доступно всем пользователям
  },
];

// Функция, которая фильтрует элементы навигации по ролям пользователя - остается без изменений
export const getNavigationItems = (userRoles: string[]) => {
  return navigationItems.filter(item => {
    if (!item.roles) return true;
    return userRoles.some(role => item.roles?.includes(role));
  });
};
