import { IsNotEmpty, IsUUID, IsArray } from 'class-validator';

export class AssignRoleDto {
  @IsUUID('4')
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @IsNotEmpty()
  roleIds: string[];
}
