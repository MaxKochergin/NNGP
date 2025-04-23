import { Profile } from './profile';
import { TestAttempt } from './test';
import { User } from './user';

export interface Candidate extends User {
  profile?: Profile;
  desiredPosition?: string;
  currentStatus?: string; // 'active', 'not_looking', 'considering'
  desiredSalary?: number;
  availableFrom?: string;
  relocationPossible?: boolean;
  hasResume?: boolean;
  resumeUrl?: string;
  completedTests?: TestAttempt[];
}

export interface CandidateFilters {
  specialization?: string;
  skills?: string[];
  experience?: string; // '0-1', '1-3', '3-5', '5+'
  location?: string;
  relocationPossible?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateCandidateDto {
  userId: string;
  desiredPosition?: string;
  currentStatus?: string;
  desiredSalary?: number;
  availableFrom?: string;
  relocationPossible?: boolean;
  resumeUrl?: string;
}

export interface UpdateCandidateDto {
  desiredPosition?: string;
  currentStatus?: string;
  desiredSalary?: number;
  availableFrom?: string;
  relocationPossible?: boolean;
  resumeUrl?: string;
}

export interface MatchCandidateResult {
  candidateId: string;
  matchScore: number;
  matchedSkills: {
    skillId: string;
    skillName: string;
    matchLevel: number;
  }[];
  testResults: {
    testId: string;
    testName: string;
    score: number;
    isPassed: boolean;
  }[];
}
