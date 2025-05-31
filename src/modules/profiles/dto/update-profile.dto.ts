import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';

// Исключаем userId из списка обновляемых полей
export class UpdateProfileDto extends PartialType(
  OmitType(CreateProfileDto, ['userId'] as const),
) {}
