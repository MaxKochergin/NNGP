import { Profile } from './profile';
import { User } from './user';

export interface HR extends User {
  profile?: Profile;
  companyName?: string;
  position?: string;
  companySize?: number;
  industry?: string;
}

export interface HRFilters {
  industry?: string;
  companySize?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateHRDto {
  userId: string;
  companyName: string;
  position: string;
  companySize?: number;
  industry?: string;
}

export interface UpdateHRDto {
  companyName?: string;
  position?: string;
  companySize?: number;
  industry?: string;
}
