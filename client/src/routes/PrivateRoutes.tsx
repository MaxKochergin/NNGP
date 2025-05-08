// client/src/routes/PrivateRoutes.tsx
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import AdminLayout from '../components/layouts/admin/AdminLayout';
import CandidateLayout from '../components/layouts/candidate/CandidateLayout';
import EmployeeLayout from '../components/layouts/employee/EmployeeLayout';
import HrLayout from '../components/layouts/hr/HrLayout';
import { adminRoutes } from './AdminRoutes';
import { candidateRoutes } from './CandidateRoutes';
import { commonRoutes } from './CommonRoutes';
import { employeeRoutes } from './EmployeeRoutes';
import { hrRoutes } from './HrRoutes';

/**
 * Структура приватных маршрутов:
 *
 * /app - Основной маршрут для авторизованных пользователей с разными лейаутами по ролям
 *   |- index - Перенаправление на /app/candidate/profile
 *   |
 *   |- /candidate - Маршруты кандидата (из CandidateRoutes.tsx)
 *   |    |- index - Перенаправление на /app/candidate/profile
 *   |    |- /profile - Профиль кандидата
 *   |    |    |- index - Перенаправление на /app/candidate/profile/basicInfo
 *   |    |    |- /basicInfo - Основная информация
 *   |    |    |- /experience - Опыт работы
 *   |    |    |- /education - Образование
 *   |    |    |- /skills - Навыки
 *   |    |- /tests
 *   |    |    |- /available - Доступные тесты для кандидата
 *   |    |    |- /history - История тестов кандидата
 *   |    |- /learning
 *   |         |- /materials - Учебные материалы для кандидата
 *   |         |- /courses - Курсы для кандидата
 *   |
 *   |- /employee - Маршруты сотрудника (из EmployeeRoutes.tsx)
 *   |    |- index - Перенаправление на /app/employee/profile
 *   |    |- /profile - Профиль сотрудника
 *   |    |- /tests
 *   |    |    |- /available - Доступные тесты для сотрудника
 *   |    |    |- /history - История тестов сотрудника
 *   |    |    |- /assessment - Оценка компетенций сотрудника
 *   |    |- /learning
 *   |         |- /materials - Учебные материалы для сотрудника
 *   |         |- /courses - Курсы повышения квалификации
 *   |         |- /webinars - Вебинары для сотрудников
 *   |
 *   |- /hr - Маршруты HR-специалиста (из HrRoutes.tsx)
 *   |    |- index - Перенаправление на /app/hr/profile
 *   |    |- /profile - Профиль HR
 *   |    |- /candidates - Список кандидатов
 *   |    |- /employees - Список сотрудников
 *   |    |- /tests
 *   |    |    |- /management - Управление тестами
 *   |    |    |- /results - Результаты тестирования
 *   |    |    |- /analytics - Аналитика по результатам тестов
 *   |    |- /learning
 *   |         |- /management - Управление учебными материалами
 *   |         |- /assignments - Назначение курсов сотрудникам
 *   |         |- /statistics - Статистика обучения
 *   |
 *   |- /admin - Маршруты администратора (из AdminRoutes.tsx)
 *   |    |- index - Перенаправление на /app/admin/panel
 *   |    |- /panel - Панель администратора
 *   |    |- /roles - Управление ролями
 *   |    |- /settings - Настройки системы
 *   |    |- /content
 *   |    |    |- /tests - Управление тестами (Admin)
 *   |    |    |- /learning - Управление учебными материалами (Admin)
 *   |    |    |- /notifications - Управление уведомлениями
 *   |    |- /system
 *   |         |- /users - Управление пользователями
 *   |         |- /logs - Системные логи
 *   |         |- /backup - Резервное копирование
 *   |
 *   |- /settings - Настройки пользователя (из CommonRoutes.tsx)
 *   |- /notifications - Уведомления пользователя (из CommonRoutes.tsx)
 *   |- /help - Справка и поддержка (из CommonRoutes.tsx)
 */
export const privateRoutes: RouteObject[] = [
  // Корневой маршрут с перенаправлением
  {
    path: '/app',
    element: <Navigate to="/app/candidate/profile" />,
  },

  // Маршруты кандидата в CandidateLayout
  {
    path: '/app/candidate',
    element: <CandidateLayout />,
    children: candidateRoutes.children,
  },

  // Маршруты сотрудника в EmployeeLayout
  {
    path: '/app/employee',
    element: <EmployeeLayout />,
    children: employeeRoutes.children,
  },

  // Маршруты HR в HrLayout
  {
    path: '/app/hr',
    element: <HrLayout />,
    children: hrRoutes.children,
  },

  // Маршруты администратора в AdminLayout
  {
    path: '/app/admin',
    element: <AdminLayout />,
    children: adminRoutes.children,
  },


  // Общие маршруты с CandidateLayout по умолчанию

];
