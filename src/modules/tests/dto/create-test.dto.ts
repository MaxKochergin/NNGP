export class CreateTestDto {
  title: string;
  description?: string;
  durationMinutes?: number;
  isPublished?: boolean;
  createdById: string; // ID пользователя, создавшего тест
  specializationIds?: string[]; // ID специализаций, к которым относится тест
}
