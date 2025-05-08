// client/src/types/profile.ts
export interface SocialMedia {
  id?: string;
  profileId?: string;
  platform: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileSkill {
  id?: string;
  profileId?: string;
  skillId: string;
  level?: number;
  createdAt?: string;
  updatedAt?: string;
  skill?: {
    id: string;
    name: string;
  };
}

export interface Project {
  id?: string;
  profileId?: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkExperience {
  id?: string;
  profileId?: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  id?: string;
  profileId?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Profile {
  id?: string;
  userId: string;
  specializationId: string;
  aboutMe?: string;
  specialistLevel?: string;
  location?: string;
  photoUrl?: string;
  createdAt?: string;
  updatedAt?: string;

  specialization?: {
    id: string;
    name: string;
  };
  socialMedia?: SocialMedia[];
  profileSkills?: ProfileSkill[];
  projects?: Project[];
  workExperiences?: WorkExperience[];
  educations?: Education[];
}

export interface CreateProfileDto {
  userId: string;
  specializationId: string;
  aboutMe?: string;
  specialistLevel?: string;
  location?: string;
  photoUrl?: string;
}

export interface UpdateProfileDto {
  specializationId?: string;
  aboutMe?: string;
  specialistLevel?: string;
  location?: string;
  photoUrl?: string;
}

export interface CreateSocialMediaDto {
  profileId: string;
  platform: string;
  url: string;
}

export interface CreateProfileSkillDto {
  profileId: string;
  skillId: string;
  level?: number;
}

export interface CreateProjectDto {
  profileId: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateWorkExperienceDto {
  profileId: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
}

export interface CreateEducationDto {
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
}
