export interface Role {
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface UserRole {
  id?: string;
  userId: string;
  roleId: string;
  role?: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssignRoleDto {
  userId: string;
  roleId: string;
}
