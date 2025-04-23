// client/src/types/test.ts
export interface AnswerOption {
  id?: string;
  questionId: string;
  content: string;
  isCorrect: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Question {
  id?: string;
  testId: string;
  content: string;
  type: string; // 'single-choice', 'multiple-choice', 'text', etc.
  correctAnswer?: string;
  score?: number;
  createdById: string;
  isApproved: boolean;
  createdAt?: string;
  updatedAt?: string;

  answerOptions?: AnswerOption[];
}

export interface Test {
  id?: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  createdById: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;

  questions?: Question[];
}

export interface SpecializationTest {
  id?: string;
  specializationId: string;
  testId: string;
  isRequired: boolean;
  createdAt?: string;
  updatedAt?: string;

  specialization?: {
    id: string;
    name: string;
  };
  test?: Test;
}

export interface UserAnswer {
  id?: string;
  testAttemptId: string;
  questionId: string;
  answerOptionId?: string;
  textAnswer?: string;
  createdAt?: string;
  updatedAt?: string;

  question?: Question;
  answerOption?: AnswerOption;
}

export interface TestAttempt {
  id?: string;
  userId: string;
  testId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  isPassed?: boolean;
  createdAt?: string;
  updatedAt?: string;

  test?: Test;
  userAnswers?: UserAnswer[];
}

// DTO interfaces
export interface CreateTestDto {
  title: string;
  description?: string;
  durationMinutes?: number;
}

export interface UpdateTestDto {
  title?: string;
  description?: string;
  durationMinutes?: number;
  isPublished?: boolean;
}

export interface CreateQuestionDto {
  testId: string;
  content: string;
  type: string;
  correctAnswer?: string;
  score?: number;
}

export interface UpdateQuestionDto {
  content?: string;
  type?: string;
  correctAnswer?: string;
  score?: number;
  isApproved?: boolean;
}

export interface CreateAnswerOptionDto {
  questionId: string;
  content: string;
  isCorrect: boolean;
}

export interface UpdateAnswerOptionDto {
  content?: string;
  isCorrect?: boolean;
}

export interface CreateTestAttemptDto {
  testId: string;
}

export interface SubmitAnswerDto {
  testAttemptId: string;
  questionId: string;
  answerOptionId?: string;
  textAnswer?: string;
}

export interface CompleteTestAttemptDto {
  testAttemptId: string;
}

export interface AssignTestToSpecializationDto {
  specializationId: string;
  testId: string;
  isRequired?: boolean;
}
