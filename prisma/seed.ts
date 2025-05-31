import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных тестовыми данными...');

  // 1. Создаем роли
  console.log('📝 Создаем роли...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Администратор системы',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Обычный пользователь',
    },
  });

  const mentorRole = await prisma.role.upsert({
    where: { name: 'mentor' },
    update: {},
    create: {
      name: 'mentor',
      description: 'Ментор/Преподаватель',
    },
  });

  // 2. Создаем специализации
  console.log('🎯 Создаем специализации...');
  const frontendSpec = await prisma.specialization.upsert({
    where: { name: 'Frontend Developer' },
    update: {},
    create: {
      name: 'Frontend Developer',
      description: 'Разработка пользовательских интерфейсов',
    },
  });

  const backendSpec = await prisma.specialization.upsert({
    where: { name: 'Backend Developer' },
    update: {},
    create: {
      name: 'Backend Developer',
      description: 'Серверная разработка и API',
    },
  });

  const fullstackSpec = await prisma.specialization.upsert({
    where: { name: 'Fullstack Developer' },
    update: {},
    create: {
      name: 'Fullstack Developer',
      description: 'Полный цикл веб-разработки',
    },
  });

  // 3. Создаем навыки
  console.log('💪 Создаем навыки...');
  const skills = [
    { name: 'JavaScript', category: 'Programming' },
    { name: 'TypeScript', category: 'Programming' },
    { name: 'React', category: 'Frontend' },
    { name: 'Vue.js', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'NestJS', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Git', category: 'Tools' },
  ];

  const createdSkills = [];
  for (const skill of skills) {
    const createdSkill = await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    });
    createdSkills.push(createdSkill);
  }

  // 4. Создаем пользователей
  console.log('👥 Создаем пользователей...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      firstName: 'Админ',
      lastName: 'Системы',
      dataProcessingConsent: true,
      emailVerified: true,
    },
  });

  const mentorUser = await prisma.user.upsert({
    where: { email: 'mentor@example.com' },
    update: {},
    create: {
      email: 'mentor@example.com',
      passwordHash,
      firstName: 'Иван',
      lastName: 'Ментор',
      phone: '+7 (999) 123-45-67',
      dataProcessingConsent: true,
      emailVerified: true,
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash,
      firstName: 'Петр',
      lastName: 'Разработчик',
      phone: '+7 (999) 987-65-43',
      dataProcessingConsent: true,
      emailVerified: true,
    },
  });

  // 5. Назначаем роли
  console.log('🔐 Назначаем роли...');
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: mentorUser.id,
        roleId: mentorRole.id,
      },
    },
    update: {},
    create: {
      userId: mentorUser.id,
      roleId: mentorRole.id,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: testUser.id,
        roleId: userRole.id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      roleId: userRole.id,
    },
  });

  // 6. Создаем профили
  console.log('📋 Создаем профили...');
  const mentorProfile = await prisma.profile.upsert({
    where: { userId: mentorUser.id },
    update: {},
    create: {
      userId: mentorUser.id,
      specializationId: fullstackSpec.id,
      aboutMe: 'Опытный fullstack разработчик с 5+ годами опыта',
      specialistLevel: 'Senior',
      location: 'Москва, Россия',
    },
  });

  const userProfile = await prisma.profile.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      specializationId: frontendSpec.id,
      aboutMe: 'Junior frontend разработчик, изучаю React',
      specialistLevel: 'Junior',
      location: 'Санкт-Петербург, Россия',
    },
  });

  // 7. Добавляем навыки к профилям
  console.log('🎯 Добавляем навыки к профилям...');
  const mentorSkills = [
    { skillName: 'JavaScript', level: 9 },
    { skillName: 'TypeScript', level: 8 },
    { skillName: 'React', level: 9 },
    { skillName: 'Node.js', level: 8 },
    { skillName: 'NestJS', level: 7 },
    { skillName: 'PostgreSQL', level: 8 },
  ];

  for (const skillData of mentorSkills) {
    const skill = createdSkills.find((s) => s.name === skillData.skillName);
    if (skill) {
      await prisma.profileSkill.upsert({
        where: {
          profileId_skillId: {
            profileId: mentorProfile.id,
            skillId: skill.id,
          },
        },
        update: {},
        create: {
          profileId: mentorProfile.id,
          skillId: skill.id,
          level: skillData.level,
        },
      });
    }
  }

  // 8. Создаем тест
  console.log('📝 Создаем тесты...');
  const jsTest = await prisma.test.upsert({
    where: { title: 'JavaScript Основы' },
    update: {},
    create: {
      title: 'JavaScript Основы',
      description: 'Тест на знание основ JavaScript',
      durationMinutes: 30,
      createdById: mentorUser.id,
      isPublished: true,
    },
  });

  // 9. Создаем вопросы
  console.log('❓ Создаем вопросы...');
  const question1 = await prisma.question.create({
    data: {
      testId: jsTest.id,
      content: 'Что выведет console.log(typeof null)?',
      type: 'multiple_choice',
      correctAnswer: 'object',
      score: 10,
      createdById: mentorUser.id,
      isApproved: true,
    },
  });

  // Варианты ответов для вопроса 1
  await prisma.answerOption.createMany({
    data: [
      { questionId: question1.id, content: 'null', isCorrect: false },
      { questionId: question1.id, content: 'object', isCorrect: true },
      { questionId: question1.id, content: 'undefined', isCorrect: false },
      { questionId: question1.id, content: 'string', isCorrect: false },
    ],
  });

  const question2 = await prisma.question.create({
    data: {
      testId: jsTest.id,
      content:
        'Какой метод используется для добавления элемента в конец массива?',
      type: 'multiple_choice',
      correctAnswer: 'push',
      score: 10,
      createdById: mentorUser.id,
      isApproved: true,
    },
  });

  // Варианты ответов для вопроса 2
  await prisma.answerOption.createMany({
    data: [
      { questionId: question2.id, content: 'push()', isCorrect: true },
      { questionId: question2.id, content: 'pop()', isCorrect: false },
      { questionId: question2.id, content: 'shift()', isCorrect: false },
      { questionId: question2.id, content: 'unshift()', isCorrect: false },
    ],
  });

  // 10. Связываем тест со специализацией
  console.log('🔗 Связываем тест со специализацией...');
  await prisma.specializationTest.upsert({
    where: {
      specializationId_testId: {
        specializationId: frontendSpec.id,
        testId: jsTest.id,
      },
    },
    update: {},
    create: {
      specializationId: frontendSpec.id,
      testId: jsTest.id,
      isRequired: true,
    },
  });

  // 11. Создаем учебные материалы
  console.log('📚 Создаем учебные материалы...');
  await prisma.learningMaterial.upsert({
    where: { title: 'Введение в JavaScript' },
    update: {},
    create: {
      title: 'Введение в JavaScript',
      content: `# Введение в JavaScript

JavaScript - это высокоуровневый, интерпретируемый язык программирования.

## Основные концепции:
- Переменные и типы данных
- Функции
- Объекты и массивы
- Асинхронное программирование

## Пример кода:
\`\`\`javascript
const greeting = "Привет, мир!";
console.log(greeting);
\`\`\``,
      specializationId: frontendSpec.id,
      createdById: mentorUser.id,
      isPublished: true,
    },
  });

  console.log('✅ Заполнение базы данных завершено!');
  console.log('📊 Созданные данные:');
  console.log('- 3 роли (admin, user, mentor)');
  console.log('- 3 специализации (Frontend, Backend, Fullstack)');
  console.log('- 10 навыков');
  console.log('- 3 пользователя');
  console.log('- 2 профиля');
  console.log('- 1 тест с 2 вопросами');
  console.log('- 1 учебный материал');
  console.log('');
  console.log('🔑 Тестовые аккаунты:');
  console.log('- admin@example.com / password123 (Администратор)');
  console.log('- mentor@example.com / password123 (Ментор)');
  console.log('- user@example.com / password123 (Пользователь)');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении БД:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
