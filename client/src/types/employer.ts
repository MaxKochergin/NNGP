import { Profile } from './profile';
import { User } from './user';

export interface Employer extends User {
  profile?: Profile;
  companyName: string;
  position: string;
  companySize?: number;
  industry?: string;
  companyDescription?: string;
  website?: string;
  location?: string;
}

export interface EmployerFilters {
  industry?: string;
  companySize?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateEmployerDto {
  userId: string;
  companyName: string;
  position: string;
  companySize?: number;
  industry?: string;
  companyDescription?: string;
  website?: string;
  location?: string;
}

export interface UpdateEmployerDto {
  companyName?: string;
  position?: string;
  companySize?: number;
  industry?: string;
  companyDescription?: string;
  website?: string;
  location?: string;
}
