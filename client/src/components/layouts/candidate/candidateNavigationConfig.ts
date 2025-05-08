import {
  Assignment as AssignmentIcon,
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

// Элементы навигации для кандидата
export const candidateNavigationItems: NavigationItem[] = [
  {
    title: 'Мой профиль',
    path: '/app/candidate/profile',
    icon: PersonIcon,
  },
  {
    title: 'Доступные тесты',
    path: '/app/candidate/tests/available',
    icon: AssignmentIcon,
  },
  {
    title: 'История тестов',
    path: '/app/candidate/tests/history',
    icon: AssignmentIcon,
  },

  {
    title: 'Уведомления',
    path: '/app/candidate/notifications',
    icon: NotificationsIcon,
  },
  {
    title: 'Настройки',
    path: '/app/candidate/settings',
    icon: SettingsIcon,
  },
  {
    title: 'Помощь',
    path: '/app/candidate/help',
    icon: HelpIcon,
  },
];

export default candidateNavigationItems;
