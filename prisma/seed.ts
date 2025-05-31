import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных тестовыми данными...');

  // 1. Создаем роли
  console.log('📝 Создаем роли...');
  let adminRole = await prisma.role.findFirst({ where: { name: 'admin' } });
  if (!adminRole) {
    adminRole = await prisma.role.create({
      data: {
        name: 'admin',
        description: 'Администратор системы',
      },
    });
  }

  let userRole = await prisma.role.findFirst({ where: { name: 'user' } });
  if (!userRole) {
    userRole = await prisma.role.create({
      data: {
        name: 'user',
        description: 'Обычный пользователь',
      },
    });
  }

  let mentorRole = await prisma.role.findFirst({ where: { name: 'mentor' } });
  if (!mentorRole) {
    mentorRole = await prisma.role.create({
      data: {
        name: 'mentor',
        description: 'Ментор/Преподаватель',
      },
    });
  }

  // 2. Создаем специализации
  console.log('🎯 Создаем специализации...');
  let frontendSpec = await prisma.specialization.findFirst({
    where: { name: 'Frontend Developer' },
  });
  if (!frontendSpec) {
    frontendSpec = await prisma.specialization.create({
      data: {
        name: 'Frontend Developer',
        description: 'Разработка пользовательских интерфейсов',
      },
    });
  }

  let backendSpec = await prisma.specialization.findFirst({
    where: { name: 'Backend Developer' },
  });
  if (!backendSpec) {
    backendSpec = await prisma.specialization.create({
      data: {
        name: 'Backend Developer',
        description: 'Серверная разработка и API',
      },
    });
  }

  let fullstackSpec = await prisma.specialization.findFirst({
    where: { name: 'Fullstack Developer' },
  });
  if (!fullstackSpec) {
    fullstackSpec = await prisma.specialization.create({
      data: {
        name: 'Fullstack Developer',
        description: 'Полный цикл веб-разработки',
      },
    });
  }

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

  const createdSkills: any[] = [];
  for (const skill of skills) {
    let existingSkill = await prisma.skill.findFirst({
      where: { name: skill.name },
    });
    if (!existingSkill) {
      existingSkill = await prisma.skill.create({
        data: skill,
      });
    }
    createdSkills.push(existingSkill);
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
  const adminUserRole = await prisma.userRole.findFirst({
    where: { userId: adminUser.id, roleId: adminRole.id },
  });
  if (!adminUserRole) {
    await prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    });
  }

  const mentorUserRole = await prisma.userRole.findFirst({
    where: { userId: mentorUser.id, roleId: mentorRole.id },
  });
  if (!mentorUserRole) {
    await prisma.userRole.create({
      data: {
        userId: mentorUser.id,
        roleId: mentorRole.id,
      },
    });
  }

  const testUserRole = await prisma.userRole.findFirst({
    where: { userId: testUser.id, roleId: userRole.id },
  });
  if (!testUserRole) {
    await prisma.userRole.create({
      data: {
        userId: testUser.id,
        roleId: userRole.id,
      },
    });
  }

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
      aboutMe: 'Начинающий frontend разработчик',
      specialistLevel: 'Junior',
      location: 'Санкт-Петербург, Россия',
    },
  });

  // 7. Добавляем навыки к профилям
  console.log('🎯 Добавляем навыки к профилям...');
  const jsSkill = createdSkills.find((s: any) => s.name === 'JavaScript');
  const reactSkill = createdSkills.find((s: any) => s.name === 'React');
  const nodeSkill = createdSkills.find((s: any) => s.name === 'Node.js');

  if (jsSkill) {
    const existingProfileSkill = await prisma.profileSkill.findFirst({
      where: { profileId: userProfile.id, skillId: jsSkill.id },
    });
    if (!existingProfileSkill) {
      await prisma.profileSkill.create({
        data: {
          profileId: userProfile.id,
          skillId: jsSkill.id,
          level: 3,
        },
      });
    }
  }

  if (reactSkill) {
    const existingProfileSkill = await prisma.profileSkill.findFirst({
      where: { profileId: userProfile.id, skillId: reactSkill.id },
    });
    if (!existingProfileSkill) {
      await prisma.profileSkill.create({
        data: {
          profileId: userProfile.id,
          skillId: reactSkill.id,
          level: 2,
        },
      });
    }
  }

  // 8. Создаем тест
  console.log('📝 Создаем тест...');
  const test = await prisma.test.upsert({
    where: { id: 'test-js-basics' },
    update: {},
    create: {
      id: 'test-js-basics',
      title: 'JavaScript Основы',
      description: 'Тест на знание основ JavaScript',
      durationMinutes: 30,
      createdById: mentorUser.id,
      isPublished: true,
    },
  });

  // 9. Создаем вопросы
  console.log('❓ Создаем вопросы...');
  const question1 = await prisma.question.upsert({
    where: { id: 'q1-js-var' },
    update: {},
    create: {
      id: 'q1-js-var',
      testId: test.id,
      content:
        'Какой из способов объявления переменной создает блочную область видимости?',
      type: 'single_choice',
      score: 1,
      createdById: mentorUser.id,
      isApproved: true,
    },
  });

  const question2 = await prisma.question.upsert({
    where: { id: 'q2-js-func' },
    update: {},
    create: {
      id: 'q2-js-func',
      testId: test.id,
      content: 'Что выведет console.log(typeof function() {})?',
      type: 'single_choice',
      score: 1,
      createdById: mentorUser.id,
      isApproved: true,
    },
  });

  // 10. Создаем варианты ответов
  console.log('✅ Создаем варианты ответов...');
  await prisma.answerOption.createMany({
    data: [
      { questionId: question1.id, content: 'var', isCorrect: false },
      { questionId: question1.id, content: 'let', isCorrect: true },
      { questionId: question1.id, content: 'const', isCorrect: true },
      { questionId: question1.id, content: 'function', isCorrect: false },

      { questionId: question2.id, content: 'function', isCorrect: true },
      { questionId: question2.id, content: 'object', isCorrect: false },
      { questionId: question2.id, content: 'undefined', isCorrect: false },
      { questionId: question2.id, content: 'string', isCorrect: false },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Заполнение базы данных завершено!');
  console.log('📧 Тестовые аккаунты:');
  console.log('   Admin: admin@example.com / password123');
  console.log('   Mentor: mentor@example.com / password123');
  console.log('   User: user@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
