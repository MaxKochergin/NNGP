import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import mockAuthReducer from '../features/auth/mockAuthSlice';
import candidatesReducer from '../features/candidates/candidatesSlice';
import employeesReducer from '../features/employees/employeesSlice';
import hrProfileReducer from '../features/hr/hrProfileSlice';
import testsReducer from '../features/tests/testsSlice';
import themeReducer from '../features/theme/themeSlice';
import { apiSlice } from './api/api.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mockAuth: mockAuthReducer,
    theme: themeReducer,
    hrProfile: hrProfileReducer,
    candidates: candidatesReducer,
    employees: employeesReducer,
    tests: testsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {},
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
