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
    path: '/app/candidate/profile',
    icon: PersonIcon,
    roles: ['candidate'],
  },
  {
    title: 'Профиль сотрудника',
    path: '/app/employee/profile',
    icon: PersonIcon,
    roles: ['employee'],
  },
  {
    title: 'Доступные тесты',
    path: '/app/tests/available',
    icon: AssignmentIcon,
    roles: ['candidate', 'employee'],
  },
  {
    title: 'История тестов',
    path: '/app/tests/history',
    icon: AssignmentIcon,
    roles: ['candidate', 'employee', 'hr'],
  },
  {
    title: 'Учебные материалы',
    path: '/app/learning/materials',
    icon: SchoolIcon,
    roles: ['employee'],
  },
  {
    title: 'Кандидаты',
    path: '/app/hr/candidates',
    icon: GroupIcon,
    roles: ['hr', 'admin'],
  },
  {
    title: 'Сотрудники',
    path: '/app/hr/employees',
    icon: BusinessIcon,
    roles: ['hr', 'admin'],
  },
  {
    title: 'Аналитика',
    path: '/app/analytics/reports',
    icon: BarChartIcon,
    roles: ['hr', 'admin'],
  },
  {
    title: 'Управление',
    path: '/app/admin/panel',
    icon: AdminIcon,
    roles: ['admin'],
  },
  {
    title: 'Настройки',
    path: '/app/settings',
    icon: SettingsIcon,
    // Доступно всем пользователям
  },
];

// Функция, которая фильтрует элементы навигации по ролям пользователя
export const getNavigationItems = (userRoles: string[]) => {
  return navigationItems.filter(item => {
    if (!item.roles) return true;
    return userRoles.some(role => item.roles?.includes(role));
  });
};

// Функция, которая может динамически генерировать элементы навигации для конкретного пользователя
export const getDynamicNavigationItems = (userRoles: string[]) => {
  const baseItems = getNavigationItems(userRoles);

  // Здесь можно добавить дополнительную логику для динамического изменения
  // элементов навигации в зависимости от ролей пользователя

  return baseItems;
};
