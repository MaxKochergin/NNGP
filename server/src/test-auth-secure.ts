import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testAuthSecure() {
  try {
    const email = 'candidate1@example.com';
    const password = 'Password123'; // Новый пароль с заглавной буквой

    console.log(`Проверяем авторизацию для пользователя: ${email}`);

    // Проверяем, существует ли пользователь
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`Пользователь с email ${email} не найден в базе данных.`);
      return;
    }

    console.log(`Пользователь найден: ${user.firstName} ${user.lastName}`);

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (isPasswordValid) {
      console.log('Пароль верный!');
    } else {
      console.log('Пароль неверный!');

      // Выводим текущий хэш
      console.log(`Текущий хэш пароля: ${user.passwordHash}`);

      // Создаем хэш для проверяемого пароля
      const testHash = await bcrypt.hash(password, 10);
      console.log(`Хэш для пароля '${password}': ${testHash}`);
    }

    // Получаем роли пользователя
    const userRoles = await prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: true },
    });

    console.log('Роли пользователя:');
    userRoles.forEach((ur) => {
      console.log(`- ${ur.role.name}`);
    });
  } catch (error) {
    console.error('Ошибка при проверке авторизации:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuthSecure()
  .then(() => console.log('Проверка завершена'))
  .catch((e) => console.error('Ошибка выполнения скрипта:', e));
