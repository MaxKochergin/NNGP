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
    title: 'Настройки системы',
    path: '/app/admin/settings',
    icon: SettingsIcon,
  },
  {
    title: 'Уведомления',
    path: '/app/admin/notifications',
    icon: NotificationsIcon,
  },
];

export default adminNavigationItems;
