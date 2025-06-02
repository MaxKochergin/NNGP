import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Test, TestQuestion } from '../../types/test';
import {
  addQuestion,
  addTest,
  clearFilters,
  clearSelectedTest,
  deleteQuestion,
  deleteTest,
  setCreating,
  setDeleting,
  setDetailsError,
  setError,
  setFilters,
  setLoading,
  setLoadingDetails,
  setSelectedTest,
  setUpdating,
  TestFilters,
  updateQuestion,
  updateTest,
} from './testsSlice';

// Главный хук для работы с тестами
export const useTests = () => {
  const dispatch = useAppDispatch();
  const testsState = useAppSelector(state => state.tests);

  // Функция загрузки списка тестов
  const loadTests = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      // В реальном приложении здесь будет API запрос
      // const response = await api.get('/tests');
      // dispatch(setTests(response.data));

      // Имитация загрузки
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError('Ошибка при загрузке тестов'));
      console.error('Ошибка при загрузке тестов:', error);
    }
  }, [dispatch]);

  // Функция загрузки конкретного теста
  const loadTest = useCallback(
    async (testId: string) => {
      dispatch(setLoadingDetails(true));
      try {
        // В реальном приложении здесь будет API запрос
        // const response = await api.get(`/tests/${testId}`);
        // dispatch(setSelectedTest(response.data));

        // Имитация загрузки из локального состояния
        const test = testsState.tests.find(t => t.id === testId);
        if (test) {
          dispatch(setSelectedTest(test));
        } else {
          dispatch(setDetailsError('Тест не найден'));
        }
      } catch (error) {
        dispatch(setDetailsError('Ошибка при загрузке теста'));
        console.error('Ошибка при загрузке теста:', error);
      }
    },
    [dispatch, testsState.tests]
  );

  // Функция создания нового теста
  const createTest = useCallback(
    async (testData: Omit<Test, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch(setCreating(true));
      try {
        // В реальном приложении здесь будет API запрос
        // const response = await api.post('/tests', testData);
        // dispatch(addTest(response.data));

        // Имитация создания
        const newTest: Test = {
          ...testData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch(addTest(newTest));
        return newTest;
      } catch (error) {
        dispatch(setError('Ошибка при создании теста'));
        console.error('Ошибка при создании теста:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Функция обновления теста
  const updateTestData = useCallback(
    async (testData: Test) => {
      dispatch(setUpdating(true));
      try {
        // В реальном приложении здесь будет API запрос
        // const response = await api.put(`/tests/${testData.id}`, testData);
        // dispatch(updateTest(response.data));

        // Имитация обновления
        const updatedTest: Test = {
          ...testData,
          updatedAt: new Date().toISOString(),
        };

        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch(updateTest(updatedTest));
        return updatedTest;
      } catch (error) {
        dispatch(setError('Ошибка при обновлении теста'));
        console.error('Ошибка при обновлении теста:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Функция удаления теста
  const deleteTestById = useCallback(
    async (testId: string) => {
      dispatch(setDeleting(true));
      try {
        // В реальном приложении здесь будет API запрос
        // await api.delete(`/tests/${testId}`);

        // Имитация удаления
        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch(deleteTest(testId));
      } catch (error) {
        dispatch(setError('Ошибка при удалении теста'));
        console.error('Ошибка при удалении теста:', error);
        throw error;
      }
    },
    [dispatch]
  );

  // Функции для работы с фильтрами
  const updateFilters = useCallback(
    (newFilters: Partial<TestFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Функции для работы с вопросами
  const addTestQuestion = useCallback(
    async (testId: string, questionData: Omit<TestQuestion, 'id'>) => {
      try {
        // В реальном приложении здесь будет API запрос
        // const response = await api.post(`/tests/${testId}/questions`, questionData);
        // dispatch(addQuestion({ testId, question: response.data }));

        // Имитация создания вопроса
        const newQuestion: TestQuestion = {
          ...questionData,
          id: `q_${Date.now()}`,
        };

        dispatch(addQuestion({ testId, question: newQuestion }));
        return newQuestion;
      } catch (error) {
        console.error('Ошибка при добавлении вопроса:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const updateTestQuestion = useCallback(
    async (testId: string, questionData: TestQuestion) => {
      try {
        // В реальном приложении здесь будет API запрос
        // const response = await api.put(`/tests/${testId}/questions/${questionData.id}`, questionData);
        // dispatch(updateQuestion({ testId, question: response.data }));

        // Имитация обновления вопроса
        dispatch(updateQuestion({ testId, question: questionData }));
        return questionData;
      } catch (error) {
        console.error('Ошибка при обновлении вопроса:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const deleteTestQuestion = useCallback(
    async (testId: string, questionId: string) => {
      try {
        // В реальном приложении здесь будет API запрос
        // await api.delete(`/tests/${testId}/questions/${questionId}`);

        // Имитация удаления вопроса
        dispatch(deleteQuestion({ testId, questionId }));
      } catch (error) {
        console.error('Ошибка при удалении вопроса:', error);
        throw error;
      }
    },
    [dispatch]
  );

  const clearSelectedTestData = useCallback(() => {
    dispatch(clearSelectedTest());
  }, [dispatch]);

  return {
    // Состояние
    tests: testsState.filteredTests,
    allTests: testsState.tests,
    selectedTest: testsState.selectedTest,
    statistics: testsState.statistics,
    filters: testsState.filters,
    isLoading: testsState.isLoading,
    isLoadingDetails: testsState.isLoadingDetails,
    isCreating: testsState.isCreating,
    isUpdating: testsState.isUpdating,
    isDeleting: testsState.isDeleting,
    error: testsState.error,
    detailsError: testsState.detailsError,

    // Функции для работы с тестами
    loadTests,
    loadTest,
    createTest,
    updateTest: updateTestData,
    deleteTest: deleteTestById,
    clearSelectedTest: clearSelectedTestData,

    // Функции для работы с фильтрами
    updateFilters,
    resetFilters,

    // Функции для работы с вопросами
    addQuestion: addTestQuestion,
    updateQuestion: updateTestQuestion,
    deleteQuestion: deleteTestQuestion,
  };
};
