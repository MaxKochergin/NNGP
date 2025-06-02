import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addCandidate,
  addInterview,
  addNote,
  // Types
  CandidateBasicInfo,
  CandidateDetailed,
  CandidateFilters,
  CandidateInterview,
  CandidateNote,
  clearFilters,
  clearSearch,
  createCandidateComplete,
  deleteCandidate,
  deleteInterview,
  deleteNote,
  loadCandidateDetails,
  selectActiveFiltersCount,
  // Selectors
  selectCandidates,
  selectDetailsError,
  selectError,
  selectFilteredCandidates,
  selectFilters,
  selectFiltersOpen,
  selectIsCreating,
  selectIsDeleting,
  selectIsLoading,
  selectIsLoadingDetails,
  selectIsUpdating,
  selectLastUpdated,
  selectSearchQuery,
  selectSelectedCandidate,
  selectStatistics,
  setCandidates,
  setCandidatesError,
  // Actions
  setCandidatesLoading,
  setCreating,
  setDeleting,
  setFilters,
  setFiltersOpen,
  setSearchQuery,
  setSelectedCandidate,
  setSelectedCandidateError,
  setSelectedCandidateLoading,
  setStatistics,
  setUpdating,
  updateCandidate,
  updateCandidateComplete,
  updateCandidateStatus,
  updateInterview,
  updateNote,
} from './candidatesSlice';

// Хук для работы со списком кандидатов
export const useCandidatesList = () => {
  const dispatch = useAppDispatch();

  const candidates = useAppSelector(selectCandidates);
  const filteredCandidates = useAppSelector(selectFilteredCandidates);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);
  const lastUpdated = useAppSelector(selectLastUpdated);

  const loadCandidates = useCallback(async () => {
    dispatch(setCandidatesLoading(true));
    try {
      // В реальном приложении здесь будет API вызов
      // const response = await candidatesApi.getCandidates();
      // dispatch(setCandidates(response.data));

      // Пока используем моковые данные, которые уже загружены в initialState
      dispatch(setCandidatesLoading(false));
    } catch (error) {
      dispatch(
        setCandidatesError(error instanceof Error ? error.message : 'Ошибка загрузки кандидатов')
      );
    }
  }, [dispatch]);

  const refreshCandidates = useCallback(() => {
    loadCandidates();
  }, [loadCandidates]);

  return {
    candidates,
    filteredCandidates,
    isLoading,
    error,
    lastUpdated,
    loadCandidates,
    refreshCandidates,
  };
};

// Хук для работы с поиском
export const useCandidatesSearch = () => {
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
export const useCandidatesFilters = () => {
  const dispatch = useAppDispatch();

  const filters = useAppSelector(selectFilters);
  const activeFiltersCount = useAppSelector(selectActiveFiltersCount);
  const filtersOpen = useAppSelector(selectFiltersOpen);

  const applyFilters = useCallback(
    (newFilters: CandidateFilters) => {
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

// Хук для работы с выбранным кандидатом
export const useCandidateDetails = () => {
  const dispatch = useAppDispatch();

  const selectedCandidate = useAppSelector(selectSelectedCandidate);
  const isLoadingDetails = useAppSelector(selectIsLoadingDetails);
  const detailsError = useAppSelector(selectDetailsError);
  const isDeleting = useAppSelector(selectIsDeleting);

  const loadCandidate = useCallback(
    (candidateId: string) => {
      dispatch(setSelectedCandidateLoading(true));
      try {
        // В реальном приложении здесь будет API вызов
        // const response = await candidatesApi.getCandidateById(candidateId);
        // dispatch(setSelectedCandidate(response.data));

        // Пока используем моковые данные
        dispatch(loadCandidateDetails(candidateId));
      } catch (error) {
        dispatch(
          setSelectedCandidateError(
            error instanceof Error ? error.message : 'Ошибка загрузки кандидата'
          )
        );
      }
    },
    [dispatch]
  );

  const clearSelectedCandidate = useCallback(() => {
    dispatch(setSelectedCandidate(null));
  }, [dispatch]);

  const updateStatus = useCallback(
    (candidateId: string, status: string) => {
      dispatch(updateCandidateStatus({ candidateId, status }));
    },
    [dispatch]
  );

  const deleteCandidateById = useCallback(
    async (candidateId: string) => {
      dispatch(setDeleting(true));
      try {
        // В реальном приложении здесь будет API вызов
        // await candidatesApi.deleteCandidate(candidateId);

        // Пока удаляем локально
        dispatch(deleteCandidate(candidateId));
        return true;
      } catch (error) {
        dispatch(setDeleting(false));
        throw error;
      }
    },
    [dispatch]
  );

  return {
    selectedCandidate,
    isLoadingDetails,
    detailsError,
    isDeleting,
    loadCandidate,
    clearSelectedCandidate,
    updateStatus,
    deleteCandidateById,
  };
};

// Хук для CRUD операций с кандидатами
export const useCandidatesCRUD = () => {
  const dispatch = useAppDispatch();

  const isCreating = useAppSelector(selectIsCreating);
  const isUpdating = useAppSelector(selectIsUpdating);
  const isDeleting = useAppSelector(selectIsDeleting);

  const createCandidate = useCallback(
    async (candidateData: Omit<CandidateBasicInfo, 'id'>) => {
      dispatch(setCreating(true));
      try {
        // В реальном приложении здесь будет API вызов
        // const response = await candidatesApi.createCandidate(candidateData);
        // dispatch(addCandidate(response.data));

        // Пока создаем моковые данные
        const newCandidate: CandidateBasicInfo = {
          ...candidateData,
          id: Date.now().toString(),
          lastActivity: new Date().toISOString().split('T')[0],
        };
        dispatch(addCandidate(newCandidate));
        return newCandidate;
      } catch (error) {
        dispatch(setCreating(false));
        throw error;
      }
    },
    [dispatch]
  );

  // Новая функция для создания полного кандидата
  const createCandidateWithDetails = useCallback(
    async (candidateData: Omit<CandidateDetailed, 'id'>) => {
      dispatch(setCreating(true));
      try {
        // В реальном приложении здесь будет API вызов
        // const response = await candidatesApi.createCandidateComplete(candidateData);
        // dispatch(createCandidateComplete(response.data));

        // Пока создаем моковые данные
        dispatch(createCandidateComplete(candidateData));
        return candidateData;
      } catch (error) {
        dispatch(setCreating(false));
        throw error;
      }
    },
    [dispatch]
  );

  const updateCandidateData = useCallback(
    async (candidateId: string, updates: Partial<CandidateBasicInfo>) => {
      dispatch(setUpdating(true));
      try {
        // В реальном приложении здесь будет API вызов
        // const response = await candidatesApi.updateCandidate(candidateId, updates);
        // dispatch(updateCandidate(response.data));

        // Пока обновляем локально
        const updatedCandidate: CandidateBasicInfo = {
          id: candidateId,
          ...updates,
        } as CandidateBasicInfo;
        dispatch(updateCandidate(updatedCandidate));
        return updatedCandidate;
      } catch (error) {
        dispatch(setUpdating(false));
        throw error;
      }
    },
    [dispatch]
  );

  // Новая функция для обновления полного кандидата
  const updateCandidateWithDetails = useCallback(
    async (candidateData: CandidateDetailed) => {
      dispatch(setUpdating(true));
      try {
        // В реальном приложении здесь будет API вызов
        // const response = await candidatesApi.updateCandidateComplete(candidateData);
        // dispatch(updateCandidateComplete(response.data));

        // Пока обновляем локально
        dispatch(updateCandidateComplete(candidateData));
        return candidateData;
      } catch (error) {
        dispatch(setUpdating(false));
        throw error;
      }
    },
    [dispatch]
  );

  const deleteCandidateById = useCallback(
    async (candidateId: string) => {
      dispatch(setDeleting(true));
      try {
        // В реальном приложении здесь будет API вызов
        // await candidatesApi.deleteCandidate(candidateId);

        // Пока удаляем локально
        dispatch(deleteCandidate(candidateId));
      } catch (error) {
        dispatch(setDeleting(false));
        throw error;
      }
    },
    [dispatch]
  );

  return {
    isCreating,
    isUpdating,
    isDeleting,
    createCandidate,
    createCandidateWithDetails,
    updateCandidateData,
    updateCandidateWithDetails,
    deleteCandidateById,
  };
};

// Хук для работы с заметками
export const useCandidateNotes = () => {
  const dispatch = useAppDispatch();

  const addCandidateNote = useCallback(
    (candidateId: string, noteText: string, author: string) => {
      const note: CandidateNote = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        text: noteText,
        author,
      };
      dispatch(addNote({ candidateId, note }));
      return note;
    },
    [dispatch]
  );

  const updateCandidateNote = useCallback(
    (candidateId: string, noteId: string, noteText: string) => {
      const note: CandidateNote = {
        id: noteId,
        date: new Date().toISOString().split('T')[0],
        text: noteText,
        author: 'Текущий пользователь', // В реальном приложении получаем из auth
      };
      dispatch(updateNote({ candidateId, note }));
      return note;
    },
    [dispatch]
  );

  const deleteCandidateNote = useCallback(
    (candidateId: string, noteId: string) => {
      dispatch(deleteNote({ candidateId, noteId }));
    },
    [dispatch]
  );

  return {
    addCandidateNote,
    updateCandidateNote,
    deleteCandidateNote,
  };
};

// Хук для работы с интервью
export const useCandidateInterviews = () => {
  const dispatch = useAppDispatch();

  const addCandidateInterview = useCallback(
    (candidateId: string, interviewData: Omit<CandidateInterview, 'id'>) => {
      const interview: CandidateInterview = {
        ...interviewData,
        id: Date.now().toString(),
      };
      dispatch(addInterview({ candidateId, interview }));
      return interview;
    },
    [dispatch]
  );

  const updateCandidateInterview = useCallback(
    (candidateId: string, interviewId: string, updates: Partial<CandidateInterview>) => {
      const interview: CandidateInterview = {
        id: interviewId,
        ...updates,
      } as CandidateInterview;
      dispatch(updateInterview({ candidateId, interview }));
      return interview;
    },
    [dispatch]
  );

  const deleteCandidateInterview = useCallback(
    (candidateId: string, interviewId: string) => {
      dispatch(deleteInterview({ candidateId, interviewId }));
    },
    [dispatch]
  );

  return {
    addCandidateInterview,
    updateCandidateInterview,
    deleteCandidateInterview,
  };
};

// Хук для работы со статистикой
export const useCandidatesStatistics = () => {
  const statistics = useAppSelector(selectStatistics);

  return {
    statistics,
  };
};

// Главный хук, объединяющий всю функциональность
export const useCandidates = () => {
  const listHooks = useCandidatesList();
  const searchHooks = useCandidatesSearch();
  const filtersHooks = useCandidatesFilters();
  const detailsHooks = useCandidateDetails();
  const crudHooks = useCandidatesCRUD();
  const notesHooks = useCandidateNotes();
  const interviewsHooks = useCandidateInterviews();
  const statisticsHooks = useCandidatesStatistics();

  return {
    // Список кандидатов
    ...listHooks,

    // Поиск
    ...searchHooks,

    // Фильтры
    ...filtersHooks,

    // Детали кандидата
    ...detailsHooks,

    // CRUD операции
    ...crudHooks,

    // Заметки
    ...notesHooks,

    // Интервью
    ...interviewsHooks,

    // Статистика
    ...statisticsHooks,
  };
};
