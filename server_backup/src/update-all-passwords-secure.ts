import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function updateAllPasswordsSecure() {
  try {
    // Получаем всех пользователей
    const users = await prisma.user.findMany();
    console.log(`Найдено ${users.length} пользователей для обновления паролей`);

    // Новый пароль с заглавной буквой
    const newPassword = 'Password123';
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    console.log(`Обновляем пароли для всех пользователей на: ${newPassword}`);

    // Обновляем пароли всех пользователей
    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });
      console.log(`Пароль обновлен для пользователя: ${user.email}`);
    }

    console.log('Все пароли успешно обновлены');
  } catch (error) {
    console.error('Ошибка при обновлении паролей:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAllPasswordsSecure()
  .then(() => console.log('Операция завершена'))
  .catch((e) => console.error('Ошибка выполнения операции:', e));
