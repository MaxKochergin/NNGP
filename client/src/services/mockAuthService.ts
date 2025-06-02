// Сервис для локальной авторизации
import { MockUser, mockUsers } from '../data/mockUsers';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: MockUser;
  token?: string;
  message?: string;
}

export class MockAuthService {
  private static readonly TOKEN_KEY = 'mock_auth_token';
  private static readonly USER_KEY = 'mock_auth_user';

  // Имитация задержки сети
  private static delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Генерация простого токена
  private static generateToken(user: MockUser): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      timestamp: Date.now(),
    };
    return btoa(JSON.stringify(payload));
  }

  // Авторизация пользователя
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay(); // Имитация сетевой задержки

    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      return {
        success: false,
        message: 'Неверный email или пароль',
      };
    }

    const token = this.generateToken(user);

    // Сохраняем в localStorage
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    return {
      success: true,
      user,
      token,
      message: 'Успешная авторизация',
    };
  }

  // Регистрация (заглушка)
  static async register(userData: any): Promise<AuthResponse> {
    await this.delay();

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      return {
        success: false,
        message: 'Пользователь с таким email уже существует',
      };
    }

    // В реальном приложении здесь была бы логика создания пользователя
    return {
      success: false,
      message: 'Регистрация временно недоступна. Используйте тестовые аккаунты.',
    };
  }

  // Получение текущего пользователя
  static getCurrentUser(): MockUser | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  // Получение токена
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Проверка валидности токена
  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token));
      // Токен действителен 24 часа
      const isExpired = Date.now() - payload.timestamp > 24 * 60 * 60 * 1000;
      return !isExpired;
    } catch {
      return false;
    }
  }

  // Выход из системы
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Получение профиля пользователя
  static async getProfile(): Promise<MockUser | null> {
    await this.delay(200);
    return this.getCurrentUser();
  }

  // Проверка роли пользователя
  static hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Проверка авторизации
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.isTokenValid();
  }
}

// Экспорт для удобства
export const mockAuth = MockAuthService;
