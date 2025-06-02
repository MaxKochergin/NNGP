import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addEmployee,
  addEvaluation,
  addNote,
  addTraining,
  clearFilters,
  clearSearch,
  createEmployeeComplete,
  deleteEmployee,
  deleteEvaluation,
  deleteNote,
  deleteTraining,
  // Types
  EmployeeBasicInfo,
  EmployeeDetailed,
  EmployeeEvaluation,
  EmployeeFilters,
  EmployeeNote,
  EmployeeTraining,
  loadEmployeeDetails,
  selectActiveFiltersCount,
  selectDetailsError,
  // Selectors
  selectEmployees,
  selectError,
  selectFilteredEmployees,
  selectFilters,
  selectFiltersOpen,
  selectIsCreating,
  selectIsDeleting,
  selectIsLoading,
  selectIsLoadingDetails,
  selectIsUpdating,
  selectLastUpdated,
  selectSearchQuery,
  selectSelectedEmployee,
  selectStatistics,
  setCreating,
  setDeleting,
  setEmployees,
  setEmployeesError,
  // Actions
  setEmployeesLoading,
  setFilters,
  setFiltersOpen,
  setSearchQuery,
  setSelectedEmployee,
  setSelectedEmployeeError,
  setSelectedEmployeeLoading,
  setStatistics,
  setUpdating,
  updateEmployee,
  updateEmployeeComplete,
  updateEmployeeStatus,
  updateEvaluation,
  updateNote,
  updateTraining,
} from './employeesSlice';

// Хук для работы со списком сотрудников
export const useEmployeesList = () => {
  const dispatch = useAppDispatch();

  const employees = useAppSelector(selectEmployees);
  const filteredEmployees = useAppSelector(selectFilteredEmployees);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const lastUpdated = useAppSelector(selectLastUpdated);

  const loadEmployees = useCallback(async () => {
    dispatch(setEmployeesLoading(true));
    try {
      // В реальном приложении здесь будет API вызов
      // const response = await employeesApi.getEmployees();
      // dispatch(setEmployees(response.data));

      // Пока используем моковые данные, которые уже загружены в initialState
      dispatch(setEmployeesLoading(false));
    } catch (error) {
      dispatch(
        setEmployeesError(error instanceof Error ? error.message : 'Ошибка загрузки сотрудников')
      );
    }
  }, [dispatch]);

  const refreshEmployees = useCallback(() => {
    loadEmployees();
  }, [loadEmployees]);

  return {
    employees,
    filteredEmployees,
    isLoading,
    error,
    lastUpdated,
    loadEmployees,
    refreshEmployees,
  };
};

// Хук для работы с поиском
export const useEmployeesSearch = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector(selectSearchQuery);

  const setSearch = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const clearSearchQuery = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  return {
    searchQuery,
    setSearch,
    clearSearchQuery,
  };
};

// Хук для работы с фильтрами
export const useEmployeesFilters = () => {
  const dispatch = useAppDispatch();

  const filters = useAppSelector(selectFilters);
  const activeFiltersCount = useAppSelector(selectActiveFiltersCount);
  const filtersOpen = useAppSelector(selectFiltersOpen);

  const applyFilters = useCallback(
    (newFilters: EmployeeFilters) => {
      dispatch(setFilters(newFilters));
      dispatch(setFiltersOpen(false));
    },
    [dispatch]
  );

  const clearAllFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const toggleFiltersOpen = useCallback(
    (open?: boolean) => {
      dispatch(setFiltersOpen(open ?? !filtersOpen));
    },
    [dispatch, filtersOpen]
  );

  return {
    filters,
    activeFiltersCount,
    filtersOpen,
    applyFilters,
    clearAllFilters,
    toggleFiltersOpen,
  };
};

// Хук для работы с выбранным сотрудником
export const useEmployeeDetails = () => {
  const dispatch = useAppDispatch();

  const selectedEmployee = useAppSelector(selectSelectedEmployee);
  const isLoadingDetails = useAppSelector(selectIsLoadingDetails);
  const detailsError = useAppSelector(selectDetailsError);
  const isDeleting = useAppSelector(selectIsDeleting);

  const loadEmployee = useCallback(
    (employeeId: string) => {
      dispatch(setSelectedEmployeeLoading(true));
      try {
        // В реальном приложении здесь будет API вызов
        // const response = await employeesApi.getEmployeeById(employeeId);
        // dispatch(setSelectedEmployee(response.data));

        // Пока используем моковые данные
        dispatch(loadEmployeeDetails(employeeId));
      } catch (error) {
        dispatch(
          setSelectedEmployeeError(
            error instanceof Error ? error.message : 'Ошибка загрузки сотрудника'
          )
        );
      }
    },
    [dispatch]
  );

  const clearSelectedEmployee = useCallback(() => {
    dispatch(setSelectedEmployee(null));
  }, [dispatch]);

  const updateStatus = useCallback(
    (employeeId: string, status: string) => {
      dispatch(updateEmployeeStatus({ employeeId, status }));
    },
    [dispatch]
  );

  const deleteEmployeeById = useCallback(
    async (employeeId: string) => {
      dispatch(setDeleting(true));
      try {
        // В реальном приложении здесь будет API вызов
        // await employeesApi.deleteEmployee(employeeId);

        // Пока удаляем локально
        dispatch(deleteEmployee(employeeId));
        return true;
      } catch (error) {
        dispatch(setDeleting(false));
        throw error;
      }
    },
    [dispatch]
  );

  return {
    selectedEmployee,
    isLoadingDetails,
    detailsError,
    isDeleting,
    loadEmployee,
    clearSelectedEmployee,
    updateStatus,
    deleteEmployeeById,
  };
};

// Хук для CRUD операций с сотрудниками
export const useEmployeesCRUD = () => {
  const dispatch = useAppDispatch();

  const isCreating = useAppSelector(selectIsCreating);
  const isUpdating = useAppSelector(selectIsUpdating);
  const isDeleting = useAppSelector(selectIsDeleting);

  const createEmployee = useCallback(
    async (employeeData: Omit<EmployeeBasicInfo, 'id'>) => {
      dispatch(setCreating(true));
      try {
        // В реальном приложении здесь будет API вызов
        // const response = await employeesApi.createEmployee(employeeData);
        // dispatch(addEmployee(response.data));

        // Пока создаем моковые данные
        const newEmployee: EmployeeBasicInfo = {
          ...employeeData,
          id: Date.now().toString(),
          lastActivity: new Date().toISOString().split('T')[0],
        };
        dispatch(addEmployee(newEmployee));
        return newEmployee;
      } catch (error) {
        throw error;
      } finally {
        dispatch(setCreating(false));
      }
    },
    [dispatch]
  );

  const updateEmployeeById = useCallback(
    async (employeeId: string, employeeData: Partial<EmployeeBasicInfo>) => {
      dispatch(setUpdating(true));
      try {
        // В реальном приложении здесь будет API вызов
        // const response = await employeesApi.updateEmployee(employeeId, employeeData);
        // dispatch(updateEmployee({ id: employeeId, changes: response.data }));

        // Пока обновляем локально
        dispatch(updateEmployee({ id: employeeId, changes: employeeData }));
        return true;
      } catch (error) {
        throw error;
      } finally {
        dispatch(setUpdating(false));
      }
    },
    [dispatch]
  );

  const deleteEmployeeById = useCallback(
    async (employeeId: string) => {
      dispatch(setDeleting(true));
      try {
        // В реальном приложении здесь будет API вызов
        // await employeesApi.deleteEmployee(employeeId);

        // Пока удаляем локально
        dispatch(deleteEmployee(employeeId));
        return true;
      } catch (error) {
        throw error;
      } finally {
        dispatch(setDeleting(false));
      }
    },
    [dispatch]
  );

  return {
    isCreating,
    isUpdating,
    isDeleting,
    createEmployee,
    updateEmployeeById,
    deleteEmployeeById,
  };
};

// Хук для работы с заметками
export const useEmployeeNotes = () => {
  const dispatch = useAppDispatch();

  const selectedEmployee = useAppSelector(selectSelectedEmployee);

  const addEmployeeNote = useCallback(
    (employeeId: string, note: Omit<EmployeeNote, 'id' | 'createdAt'>) => {
      const newNote: EmployeeNote = {
        ...note,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      dispatch(addNote({ employeeId, note: newNote }));
    },
    [dispatch]
  );

  const updateEmployeeNote = useCallback(
    (employeeId: string, noteId: string, updates: Partial<EmployeeNote>) => {
      dispatch(updateNote({ employeeId, noteId, updates }));
    },
    [dispatch]
  );

  const deleteEmployeeNote = useCallback(
    (employeeId: string, noteId: string) => {
      dispatch(deleteNote({ employeeId, noteId }));
    },
    [dispatch]
  );

  return {
    notes: selectedEmployee?.notes || [],
    addEmployeeNote,
    updateEmployeeNote,
    deleteEmployeeNote,
  };
};

// Хук для работы с оценками
export const useEmployeeEvaluations = () => {
  const dispatch = useAppDispatch();

  const selectedEmployee = useAppSelector(selectSelectedEmployee);

  const addEmployeeEvaluation = useCallback(
    (employeeId: string, evaluation: Omit<EmployeeEvaluation, 'id'>) => {
      const newEvaluation: EmployeeEvaluation = {
        ...evaluation,
        id: Date.now().toString(),
      };
      dispatch(addEvaluation({ employeeId, evaluation: newEvaluation }));
    },
    [dispatch]
  );

  const updateEmployeeEvaluation = useCallback(
    (employeeId: string, evaluationId: string, updates: Partial<EmployeeEvaluation>) => {
      dispatch(updateEvaluation({ employeeId, evaluationId, updates }));
    },
    [dispatch]
  );

  const deleteEmployeeEvaluation = useCallback(
    (employeeId: string, evaluationId: string) => {
      dispatch(deleteEvaluation({ employeeId, evaluationId }));
    },
    [dispatch]
  );

  return {
    evaluations: selectedEmployee?.evaluations || [],
    addEmployeeEvaluation,
    updateEmployeeEvaluation,
    deleteEmployeeEvaluation,
  };
};

// Хук для работы с обучением
export const useEmployeeTraining = () => {
  const dispatch = useAppDispatch();

  const selectedEmployee = useAppSelector(selectSelectedEmployee);

  const addEmployeeTraining = useCallback(
    (employeeId: string, training: Omit<EmployeeTraining, 'id'>) => {
      const newTraining: EmployeeTraining = {
        ...training,
        id: Date.now().toString(),
      };
      dispatch(addTraining({ employeeId, training: newTraining }));
    },
    [dispatch]
  );

  const updateEmployeeTraining = useCallback(
    (employeeId: string, trainingId: string, updates: Partial<EmployeeTraining>) => {
      dispatch(updateTraining({ employeeId, trainingId, updates }));
    },
    [dispatch]
  );

  const deleteEmployeeTraining = useCallback(
    (employeeId: string, trainingId: string) => {
      dispatch(deleteTraining({ employeeId, trainingId }));
    },
    [dispatch]
  );

  return {
    trainings: selectedEmployee?.trainings || [],
    addEmployeeTraining,
    updateEmployeeTraining,
    deleteEmployeeTraining,
  };
};

// Хук для работы со статистикой
export const useEmployeesStatistics = () => {
  const statistics = useAppSelector(selectStatistics);

  return statistics;
};

// Главный хук, объединяющий всю функциональность
export const useEmployees = () => {
  const listHooks = useEmployeesList();
  const searchHooks = useEmployeesSearch();
  const filtersHooks = useEmployeesFilters();
  const detailsHooks = useEmployeeDetails();
  const crudHooks = useEmployeesCRUD();
  const notesHooks = useEmployeeNotes();
  const evaluationsHooks = useEmployeeEvaluations();
  const trainingHooks = useEmployeeTraining();
  const statisticsHooks = useEmployeesStatistics();

  return {
    // Список и поиск
    ...listHooks,
    ...searchHooks,

    // Фильтры
    ...filtersHooks,

    // Детали сотрудника
    ...detailsHooks,

    // CRUD операции
    ...crudHooks,

    // Заметки
    ...notesHooks,

    // Оценки
    ...evaluationsHooks,

    // Обучение
    ...trainingHooks,

    // Статистика
    ...statisticsHooks,
  };
};
