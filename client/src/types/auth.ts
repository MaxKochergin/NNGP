// client/src/types/auth.ts
// Типы для запросов
export interface LoginDto {
    email: string;
    password: string;
  }
  
  export interface RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }
  
  // Типы для ответов
  export interface AuthResponse {
    accessToken: string;
    user: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      roles?: string[];
    };
  }
  
  // Тип для состояния аутентификации в Redux
  export interface AuthState {
    user: AuthResponse['user'] | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
