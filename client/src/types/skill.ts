export interface Skill {
  id?: string;
  name: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSkillDto {
  name: string;
  category?: string;
}

export interface UpdateSkillDto {
  name?: string;
  category?: string;
}
