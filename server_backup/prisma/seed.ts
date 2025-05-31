import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создание базовых ролей
  const roles = [
    {
      name: 'admin',
      description: 'Администратор системы с полным доступом',
    },
    {
      name: 'hr',
      description: 'HR-специалист, может просматривать результаты кандидатов',
    },
    {
      name: 'candidate',
      description: 'Кандидат, проходящий тесты для оценки',
    },
    {
      name: 'employee',
      description: 'Сотрудник компании с доступом к обучающим тестам',
    },
  ];

  console.log('Начинаю инициализацию ролей...');

  for (const role of roles) {
    // Проверяем, существует ли роль
    const existingRole = await prisma.role.findFirst({
      where: { name: role.name },
    });

    // Если роль не существует, создаем
    if (!existingRole) {
      await prisma.role.create({
        data: role,
      });
      console.log(`Роль ${role.name} создана`);
    } else {
      console.log(`Роль ${role.name} уже существует`);
    }
  }

  console.log('Инициализация ролей завершена!');
}

main()
  .catch((e) => {
    console.error('Ошибка при инициализации ролей:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().catch(console.error);
  });
