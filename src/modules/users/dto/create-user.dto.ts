export class CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dataProcessingConsent: boolean;
  roleIds: string[]; // Массив ID ролей для пользователя
}
