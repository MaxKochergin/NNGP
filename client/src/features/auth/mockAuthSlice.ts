// Mock Auth Slice для локальной авторизации
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MockUser } from '../../data/mockUsers';
import { AuthResponse, LoginCredentials, mockAuth } from '../../services/mockAuthService';

export interface MockAuthState {
  user: MockUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  defaultPath: string;
}

// Функция для определения базового маршрута по роли
const getDefaultPathByRole = (role: string): string => {
  switch (role) {
    case 'admin':
      return '/app/admin/panel';
    case 'hr':
      return '/app/hr/profile';
    case 'employer':
      return '/app/employer/profile';
    case 'candidate':
      return '/app/candidate/profile';
    default:
      return '/';
  }
};

// Async thunks
export const mockLogin = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  'mockAuth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await mockAuth.login(credentials);
      if (!response.success) {
        return rejectWithValue(response.message || 'Ошибка авторизации');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Произошла ошибка при авторизации');
    }
  }
);

export const mockRegister = createAsyncThunk<AuthResponse, any, { rejectValue: string }>(
  'mockAuth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await mockAuth.register(userData);
      if (!response.success) {
        return rejectWithValue(response.message || 'Ошибка регистрации');
      }
      return response;
    } catch (error) {
      return rejectWithValue('Произошла ошибка при регистрации');
    }
  }
);

export const mockGetProfile = createAsyncThunk<MockUser, void, { rejectValue: string }>(
  'mockAuth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await mockAuth.getProfile();
      if (!user) {
        return rejectWithValue('Пользователь не найден');
      }
      return user;
    } catch (error) {
      return rejectWithValue('Ошибка получения профиля');
    }
  }
);

// Инициализация состояния
const initializeState = (): MockAuthState => {
  const user = mockAuth.getCurrentUser();
  const token = mockAuth.getToken();
  const isAuthenticated = mockAuth.isAuthenticated();

  return {
    user,
    token,
    isAuthenticated,
    isLoading: false,
    error: null,
    defaultPath: user ? getDefaultPathByRole(user.role) : '/',
  };
};

const initialState: MockAuthState = initializeState();

const mockAuthSlice = createSlice({
  name: 'mockAuth',
  initialState,
  reducers: {
    logout: state => {
      mockAuth.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.defaultPath = '/';
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
    setDefaultPath: state => {
      if (state.user) {
        state.defaultPath = getDefaultPathByRole(state.user.role);
      }
    },
    // Восстановление состояния из localStorage
    restoreAuth: state => {
      const user = mockAuth.getCurrentUser();
      const token = mockAuth.getToken();
      const isAuthenticated = mockAuth.isAuthenticated();

      state.user = user;
      state.token = token;
      state.isAuthenticated = isAuthenticated;
      state.defaultPath = user ? getDefaultPathByRole(user.role) : '/';
    },
  },
  extraReducers: builder => {
    // Login
    builder
      .addCase(mockLogin.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(mockLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user!;
        state.token = action.payload.token!;
        state.defaultPath = getDefaultPathByRole(action.payload.user!.role);
        state.error = null;
      })
      .addCase(mockLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка авторизации';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Register
    builder
      .addCase(mockRegister.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(mockRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.user) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token!;
          state.defaultPath = getDefaultPathByRole(action.payload.user.role);
        }
        state.error = null;
      })
      .addCase(mockRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка регистрации';
      });

    // Get Profile
    builder
      .addCase(mockGetProfile.pending, state => {
        state.isLoading = true;
      })
      .addCase(mockGetProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.defaultPath = getDefaultPathByRole(action.payload.role);
      })
      .addCase(mockGetProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка получения профиля';
      });
  },
});

export const { logout, clearError, setDefaultPath, restoreAuth } = mockAuthSlice.actions;

export default mockAuthSlice.reducer;

// Селекторы
export const selectMockAuth = (state: { mockAuth: MockAuthState }) => state.mockAuth;
export const selectMockUser = (state: { mockAuth: MockAuthState }) => state.mockAuth.user;
export const selectMockIsAuthenticated = (state: { mockAuth: MockAuthState }) =>
  state.mockAuth.isAuthenticated;
export const selectMockIsLoading = (state: { mockAuth: MockAuthState }) => state.mockAuth.isLoading;
export const selectMockError = (state: { mockAuth: MockAuthState }) => state.mockAuth.error;
