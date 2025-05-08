import {
  SupervisorAccount as AdminIcon,
  Assignment as AssignmentIcon,
  AssignmentInd as AssignmentIndIcon,
  BarChart as BarChartIcon,
  Business as BusinessIcon,
  Code as CodeIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

export interface NavigationItem {
  title: string;
  path: string;
  icon: any;
}

// Элементы навигации для администратора
export const adminNavigationItems: NavigationItem[] = [
  {
    title: 'Панель управления',
    path: '/app/admin/panel',
    icon: DashboardIcon,
  },
  {
    title: 'Пользователи',
    path: '/app/admin/users',
    icon: GroupIcon,
  },
  {
    title: 'Роли и права',
    path: '/app/admin/roles',
    icon: SecurityIcon,
  },
  {
    title: 'Кандидаты',
    path: '/app/admin/candidates',
    icon: PersonIcon,
  },
  {
    title: 'Сотрудники',
    path: '/app/admin/employees',
    icon: BusinessIcon,
  },
  {
    title: 'Управление тестами',
    path: '/app/admin/tests',
    icon: AssignmentIcon,
  },
  {
    title: 'Учебные материалы',
    path: '/app/admin/learning',
    icon: SchoolIcon,
  },
  {
    title: 'Аналитика',
    path: '/app/admin/analytics',
    icon: BarChartIcon,
  },
  {
    title: 'Интеграции',
    path: '/app/admin/integrations',
    icon: CodeIcon,
  },
  {
    title: 'Системные логи',
    path: '/app/admin/logs',
    icon: StorageIcon,
  },
  {
    title: 'Настройки системы',
    path: '/app/admin/settings',
    icon: SettingsIcon,
  },
  {
    title: 'Уведомления',
    path: '/app/notifications',
    icon: NotificationsIcon,
  },
  {
    title: 'Помощь',
    path: '/app/help',
    icon: HelpIcon,
  },
];

export default adminNavigationItems;
