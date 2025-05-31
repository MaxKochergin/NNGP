import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetPasswordSecure() {
  try {
    const email = 'candidate1@example.com';
    const newPassword = 'Password123'; // Пароль с заглавной буквой P

    console.log(`Сбрасываем пароль для пользователя: ${email}`);

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`Пользователь с email ${email} не найден в базе данных.`);
      return;
    }

    console.log(`Пользователь найден: ${user.firstName} ${user.lastName}`);

    // Хэшируем новый пароль
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Обновляем пароль пользователя
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    console.log(`Пароль обновлен на: '${newPassword}'`);
    console.log(`Новый хэш пароля: ${passwordHash}`);
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPasswordSecure()
  .then(() => console.log('Сброс пароля завершен'))
  .catch((e) => console.error('Ошибка выполнения скрипта:', e));
