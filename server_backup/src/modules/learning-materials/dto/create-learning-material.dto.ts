import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLearningMaterialDto {
  @ApiProperty({ description: 'Заголовок материала' })
  title: string;

  @ApiProperty({ description: 'Содержимое материала' })
  content: string;

  @ApiProperty({ description: 'ID специализации' })
  specializationId: string;

  @ApiProperty({ description: 'ID создателя материала' })
  createdById: string;

  @ApiPropertyOptional({ description: 'Опубликован ли материал' })
  isPublished?: boolean;
}
