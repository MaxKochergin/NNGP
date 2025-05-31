import { PrismaClient, Skill } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { railwayConfig } from '../src/config/railway.config';

// Создаем PrismaClient с fallback конфигурацией
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: railwayConfig.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('🌱 Начинаем заполнение базы данных тестовыми данными...');
  console.log(
    '🔗 Используем DATABASE_URL:',
    railwayConfig.DATABASE_URL ? 'найден' : 'не найден',
  );

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

  const createdSkills: Skill[] = [];
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
      const existingProfileSkill = await prisma.profileSkill.findFirst({
        where: {
          profileId: mentorProfile.id,
          skillId: skill.id,
        },
      });
      if (!existingProfileSkill) {
        await prisma.profileSkill.create({
          data: {
            profileId: mentorProfile.id,
            skillId: skill.id,
            level: skillData.level,
          },
        });
      }
    }
  }

  // 8. Создаем тесты
  console.log('📝 Создаем тесты...');
  let jsTest = await prisma.test.findFirst({
    where: { title: 'JavaScript Основы' },
  });
  if (!jsTest) {
    jsTest = await prisma.test.create({
      data: {
        title: 'JavaScript Основы',
        description: 'Тест на знание основ JavaScript',
        durationMinutes: 30,
        createdById: mentorUser.id,
        isPublished: true,
      },
    });
  }

  // 9. Создаем вопросы
  console.log('❓ Создаем вопросы...');
  let question1 = await prisma.question.findFirst({
    where: {
      testId: jsTest.id,
      content: 'Что выведет console.log(typeof null)?',
    },
  });
  if (!question1) {
    question1 = await prisma.question.create({
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
  }

  let question2 = await prisma.question.findFirst({
    where: {
      testId: jsTest.id,
      content:
        'Какой метод используется для добавления элемента в конец массива?',
    },
  });
  if (!question2) {
    question2 = await prisma.question.create({
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
  }

  // 10. Связываем тест со специализацией
  console.log('🔗 Связываем тест со специализацией...');
  const existingSpecTest = await prisma.specializationTest.findFirst({
    where: {
      specializationId: frontendSpec.id,
      testId: jsTest.id,
    },
  });
  if (!existingSpecTest) {
    await prisma.specializationTest.create({
      data: {
        specializationId: frontendSpec.id,
        testId: jsTest.id,
        isRequired: true,
      },
    });
  }

  // 11. Создаем учебные материалы
  console.log('📚 Создаем учебные материалы...');
  let learningMaterial = await prisma.learningMaterial.findFirst({
    where: { title: 'Введение в JavaScript' },
  });
  if (!learningMaterial) {
    learningMaterial = await prisma.learningMaterial.create({
      data: {
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
  }

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
