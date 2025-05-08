// client/src/types/user.ts
export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  dataProcessingConsent: boolean;
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetTokenExpires?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  phone?: string;
  firstName: string;
  lastName: string;
  dataProcessingConsent: boolean;
}

export interface UpdateUserDto {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserWithRoles extends User {
  roles: string[];
}

export interface UserFilters {
  role?: string;
  specialization?: string;
  search?: string;
  page?: number;
  limit?: number;
}
