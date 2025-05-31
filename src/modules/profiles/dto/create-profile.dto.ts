export class CreateProfileDto {
  userId: string;
  specializationId: string;
  aboutMe?: string;
  specialistLevel?: string;
  location?: string;
  photoUrl?: string;

  // Связанные данные для создания вместе с профилем
  socialMedia?: {
    platform: string;
    url: string;
  }[];

  skills?: {
    skillId: string;
    level?: number;
  }[];
}
