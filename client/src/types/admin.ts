import { User } from './user';

export interface Admin extends User {
  permissions: AdminPermission[];
  lastLoginAt?: string;
}

export type AdminPermission =
  | 'users_manage'
  | 'roles_manage'
  | 'content_manage'
  | 'tests_manage'
  | 'system_manage'
  | 'reports_view';

export interface AdminFilters {
  permission?: AdminPermission;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateAdminDto {
  userId: string;
  permissions: AdminPermission[];
}

export interface UpdateAdminDto {
  permissions?: AdminPermission[];
}

// Типы для системной статистики
export interface SystemStats {
  users: {
    total: number;
    active: number;
    newLastWeek: number;
    byRole: { [role: string]: number };
  };
  tests: {
    total: number;
    published: number;
    avgScore: number;
    attemptCount: number;
  };
  content: {
    totalLearningMaterials: number;
    publishedMaterials: number;
  };
  candidates: {
    total: number;
    withResume: number;
    byStatus: { [status: string]: number };
  };
  employers: {
    total: number;
    byIndustry: { [industry: string]: number };
  };
}

// Тип для логов активности
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

// Фильтры для логов активности
export interface ActivityLogFilters {
  userId?: string;
  action?: string;
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Системные настройки
export interface SystemSettings {
  // Общие настройки
  siteName: string;
  siteDescription?: string;
  contactEmail: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;

  // Настройки регистрации
  registrationEnabled: boolean;
  requireEmailVerification: boolean;
  allowedDomains?: string[]; // Ограничение доменов для регистрации

  // Настройки безопасности
  passwordMinLength: number;
  passwordRequireSpecialChars: boolean;
  passwordRequireNumbers: boolean;
  sessionTimeout: number; // в минутах
  maxLoginAttempts: number;

  // Настройки тестирования
  defaultTestDuration: number; // в минутах
  passingScore: number; // в процентах
  showCorrectAnswers: boolean;

  // Настройки файлов
  maxFileSize: number; // в МБ
  allowedFileTypes: string[];

  // Настройки уведомлений
  emailNotifications: boolean;
  adminAlerts: boolean;
}
