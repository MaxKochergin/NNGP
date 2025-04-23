export interface LearningMaterial {
  id?: string;
  title: string;
  content: string;
  type: string; // 'article', 'video', 'document', etc.
  url?: string;
  specializationId: string;
  createdById: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;

  specialization?: {
    id: string;
    name: string;
  };
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreateLearningMaterialDto {
  title: string;
  content: string;
  type: string;
  url?: string;
  specializationId: string;
}

export interface UpdateLearningMaterialDto {
  title?: string;
  content?: string;
  type?: string;
  url?: string;
  specializationId?: string;
  isPublished?: boolean;
}
