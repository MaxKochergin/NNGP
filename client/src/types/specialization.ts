export interface Specialization {
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSpecializationDto {
  name: string;
  description?: string;
}

export interface UpdateSpecializationDto {
  name?: string;
  description?: string;
}
