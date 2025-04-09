import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Начинаю заполнение базы данных демонстрационными данными...');

  // 1. Проверяем и создаем базовые роли, если их нет
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

  console.log('Проверка наличия ролей...');
  for (const role of roles) {
    const existingRole = await prisma.role.findFirst({
      where: { name: role.name },
    });

    if (!existingRole) {
      await prisma.role.create({
        data: role,
      });
      console.log(`Роль ${role.name} создана`);
    } else {
      console.log(`Роль ${role.name} уже существует`);
    }
  }

  // 2. Создаем специализации
  const specializations = [
    {
      name: 'Инженер ПГС',
      description:
        'Проектирование и расчет конструкций промышленного и гражданского строительства',
    },
    {
      name: 'Сметчик',
      description:
        'Составление и проверка сметной документации строительных проектов',
    },
    {
      name: 'Инженер по ОВ',
      description:
        'Проектирование систем отопления, вентиляции и кондиционирования',
    },
    {
      name: 'Инженер по проектированию ЭОМ',
      description:
        'Проектирование электрооборудования, освещения и электрических сетей',
    },
    {
      name: 'Проектировщик КМ/КЖ/АР',
      description:
        'Проектирование конструкций металлических, железобетонных и архитектурных решений',
    },
  ];

  console.log('Создание специализаций...');
  for (const spec of specializations) {
    const existingSpec = await prisma.specialization.findFirst({
      where: { name: spec.name },
    });

    if (!existingSpec) {
      await prisma.specialization.create({
        data: spec,
      });
      console.log(`Специализация ${spec.name} создана`);
    } else {
      console.log(`Специализация ${spec.name} уже существует`);
    }
  }

  // 3. Получаем ID ролей
  const adminRole = await prisma.role.findFirst({ where: { name: 'admin' } });
  const hrRole = await prisma.role.findFirst({ where: { name: 'hr' } });
  const candidateRole = await prisma.role.findFirst({
    where: { name: 'candidate' },
  });
  const employeeRole = await prisma.role.findFirst({
    where: { name: 'employee' },
  });

  if (!adminRole || !hrRole || !candidateRole || !employeeRole) {
    throw new Error('Не удалось найти все необходимые роли');
  }

  // 4. Получаем ID специализаций
  const pgsSpec = await prisma.specialization.findFirst({
    where: { name: 'Инженер ПГС' },
  });
  const estimatorSpec = await prisma.specialization.findFirst({
    where: { name: 'Сметчик' },
  });
  const hvacSpec = await prisma.specialization.findFirst({
    where: { name: 'Инженер по ОВ' },
  });
  const electricalSpec = await prisma.specialization.findFirst({
    where: { name: 'Инженер по проектированию ЭОМ' },
  });
  const structuralArchSpec = await prisma.specialization.findFirst({
    where: { name: 'Проектировщик КМ/КЖ/АР' },
  });

  if (
    !pgsSpec ||
    !estimatorSpec ||
    !hvacSpec ||
    !electricalSpec ||
    !structuralArchSpec
  ) {
    throw new Error('Не удалось найти все необходимые специализации');
  }

  // 5. Создаем пользователей
  const defaultPassword = await bcrypt.hash('password123', 10);

  const users = [
    // Администратор
    {
      email: 'admin@example.com',
      passwordHash: defaultPassword,
      firstName: 'Администратор',
      lastName: 'Системы',
      dataProcessingConsent: true,
      roles: [adminRole.id],
    },
    // HR специалисты
    {
      email: 'hr1@example.com',
      passwordHash: defaultPassword,
      firstName: 'Елена',
      lastName: 'Смирнова',
      dataProcessingConsent: true,
      roles: [hrRole.id],
    },
    {
      email: 'hr2@example.com',
      passwordHash: defaultPassword,
      firstName: 'Ольга',
      lastName: 'Петрова',
      dataProcessingConsent: true,
      roles: [hrRole.id],
    },
    // Кандидаты
    {
      email: 'candidate1@example.com',
      passwordHash: defaultPassword,
      firstName: 'Иван',
      lastName: 'Иванов',
      dataProcessingConsent: true,
      roles: [candidateRole.id],
      specialization: pgsSpec.id,
    },
    {
      email: 'candidate2@example.com',
      passwordHash: defaultPassword,
      firstName: 'Мария',
      lastName: 'Сидорова',
      dataProcessingConsent: true,
      roles: [candidateRole.id],
      specialization: estimatorSpec.id,
    },
    {
      email: 'candidate3@example.com',
      passwordHash: defaultPassword,
      firstName: 'Алексей',
      lastName: 'Кузнецов',
      dataProcessingConsent: true,
      roles: [candidateRole.id],
      specialization: hvacSpec.id,
    },
    {
      email: 'candidate4@example.com',
      passwordHash: defaultPassword,
      firstName: 'Анна',
      lastName: 'Морозова',
      dataProcessingConsent: true,
      roles: [candidateRole.id],
      specialization: electricalSpec.id,
    },
    {
      email: 'candidate5@example.com',
      passwordHash: defaultPassword,
      firstName: 'Дмитрий',
      lastName: 'Волков',
      dataProcessingConsent: true,
      roles: [candidateRole.id],
      specialization: structuralArchSpec.id,
    },
    // Сотрудники
    {
      email: 'employee1@example.com',
      passwordHash: defaultPassword,
      firstName: 'Сергей',
      lastName: 'Новиков',
      dataProcessingConsent: true,
      roles: [employeeRole.id],
      specialization: pgsSpec.id,
    },
    {
      email: 'employee2@example.com',
      passwordHash: defaultPassword,
      firstName: 'Татьяна',
      lastName: 'Ковалева',
      dataProcessingConsent: true,
      roles: [employeeRole.id],
      specialization: estimatorSpec.id,
    },
    {
      email: 'employee3@example.com',
      passwordHash: defaultPassword,
      firstName: 'Михаил',
      lastName: 'Соколов',
      dataProcessingConsent: true,
      roles: [employeeRole.id],
      specialization: hvacSpec.id,
    },
  ];

  console.log('Создание пользователей...');
  for (const userData of users) {
    const {
      email,
      passwordHash,
      firstName,
      lastName,
      dataProcessingConsent,
      roles,
      specialization,
    } = userData;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      // Создаем пользователя
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          dataProcessingConsent,
          emailVerified: true,
        },
      });

      // Присваиваем роли
      for (const roleId of roles) {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId,
          },
        });
      }

      // Если указана специализация, создаем профиль с ней
      if (specialization) {
        await prisma.profile.create({
          data: {
            userId: user.id,
            aboutMe: `Профиль пользователя ${firstName} ${lastName}`,
            specializationId: specialization,
          },
        });
      }

      console.log(`Пользователь ${email} создан`);
    } else {
      console.log(`Пользователь ${email} уже существует`);
    }
  }

  // 6. Создаем тесты для разных специализаций
  const pgsTests = [
    {
      title: 'Основы расчета конструкций',
      description: 'Базовый тест на знание расчетов в ПГС',
      durationMinutes: 30,
      isPublished: true,
      specializationId: pgsSpec.id,
      createdById: users[0].email, // admin
      questions: [
        {
          content:
            'Какой нормативный документ используется для расчета нагрузок на здания и сооружения?',
          type: 'SINGLE_CHOICE',
          score: 10,
          options: [
            { content: 'СП 20.13330', isCorrect: true },
            { content: 'СП 50.13330', isCorrect: false },
            { content: 'СП 70.13330', isCorrect: false },
            { content: 'СП 22.13330', isCorrect: false },
          ],
        },
        {
          content: 'Что такое предельное состояние конструкции?',
          type: 'SINGLE_CHOICE',
          score: 10,
          options: [
            {
              content: 'Состояние, при котором конструкция разрушается',
              isCorrect: false,
            },
            {
              content:
                'Состояние, при котором конструкция перестает удовлетворять требованиям эксплуатации',
              isCorrect: true,
            },
            {
              content:
                'Состояние, при котором конструкция имеет максимальную несущую способность',
              isCorrect: false,
            },
            {
              content:
                'Состояние, при котором конструкция получает первую трещину',
              isCorrect: false,
            },
          ],
        },
      ],
    },
    {
      title: 'Железобетонные конструкции',
      description: 'Тест на знание проектирования и расчета ЖБК',
      durationMinutes: 45,
      isPublished: true,
      specializationId: pgsSpec.id,
      createdById: users[0].email, // admin
      questions: [
        {
          content:
            'Какие классы бетона по прочности на сжатие применяются в современном строительстве?',
          type: 'MULTIPLE_CHOICE',
          score: 10,
          options: [
            { content: 'B15', isCorrect: true },
            { content: 'B25', isCorrect: true },
            { content: 'B45', isCorrect: true },
            { content: 'B100', isCorrect: false },
          ],
        },
        {
          content:
            'Опишите основные этапы расчета железобетонной балки на изгиб',
          type: 'TEXT',
          score: 15,
        },
      ],
    },
  ];

  const estimatorTests = [
    {
      title: 'Основы сметного дела',
      description: 'Базовый тест на знание сметного дела',
      durationMinutes: 40,
      isPublished: true,
      specializationId: estimatorSpec.id,
      createdById: users[0].email, // admin
      questions: [
        {
          content: 'Что такое ФЕР?',
          type: 'SINGLE_CHOICE',
          score: 10,
          options: [
            { content: 'Федеральные единичные расценки', isCorrect: true },
            { content: 'Формальная единица расчета', isCorrect: false },
            {
              content: 'Финансово-экономическое распределение',
              isCorrect: false,
            },
            { content: 'Фонд единого развития', isCorrect: false },
          ],
        },
        {
          content: 'Какие виды смет существуют?',
          type: 'MULTIPLE_CHOICE',
          score: 10,
          options: [
            { content: 'Локальная смета', isCorrect: true },
            { content: 'Объектная смета', isCorrect: true },
            { content: 'Сводный сметный расчет', isCorrect: true },
            { content: 'Инвестиционная смета', isCorrect: false },
          ],
        },
      ],
    },
  ];

  const hvacTests = [
    {
      title: 'Системы отопления и вентиляции',
      description: 'Тест на знание проектирования систем ОВ',
      durationMinutes: 35,
      isPublished: true,
      specializationId: hvacSpec.id,
      createdById: users[0].email, // admin
      questions: [
        {
          content:
            'Какие системы отопления применяются в многоквартирных домах?',
          type: 'MULTIPLE_CHOICE',
          score: 10,
          options: [
            { content: 'Однотрубная', isCorrect: true },
            { content: 'Двухтрубная', isCorrect: true },
            { content: 'Лучевая', isCorrect: true },
            { content: 'Коллекторно-веерная', isCorrect: false },
          ],
        },
        {
          content: 'Как рассчитывается кратность воздухообмена в помещении?',
          type: 'TEXT',
          score: 15,
        },
      ],
    },
  ];

  console.log('Создание тестов и вопросов...');

  // Функция для создания теста с вопросами
  async function createTestWithQuestions(testData) {
    const {
      title,
      description,
      durationMinutes,
      isPublished,
      specializationId,
      createdById,
      questions,
    } = testData;

    // Находим ID создателя по email
    const creator = await prisma.user.findFirst({
      where: { email: createdById },
    });

    if (!creator) {
      console.error(`Пользователь с email ${createdById} не найден`);
      return;
    }

    // Проверяем существование теста
    const existingTest = await prisma.test.findFirst({
      where: {
        title,
        createdById: creator.id,
      },
    });

    if (existingTest) {
      console.log(`Тест "${title}" уже существует`);
      return;
    }

    // Создаем тест
    const test = await prisma.test.create({
      data: {
        title,
        description,
        durationMinutes,
        isPublished,
        createdById: creator.id,
      },
    });

    // Связываем тест со специализацией
    await prisma.specializationTest.create({
      data: {
        testId: test.id,
        specializationId,
        isRequired: true,
      },
    });

    // Создаем вопросы для теста
    for (const questionData of questions) {
      const { content, type, score, options } = questionData;

      const question = await prisma.question.create({
        data: {
          testId: test.id,
          content,
          type,
          score,
          createdById: creator.id,
          isApproved: true,
        },
      });

      // Если есть варианты ответов, создаем их
      if (options) {
        for (const option of options) {
          await prisma.answerOption.create({
            data: {
              questionId: question.id,
              content: option.content,
              isCorrect: option.isCorrect,
            },
          });
        }
      }
    }

    console.log(`Тест "${title}" создан с ${questions.length} вопросами`);
  }

  // Создаем тесты для разных специализаций
  for (const test of pgsTests) {
    await createTestWithQuestions(test);
  }

  for (const test of estimatorTests) {
    await createTestWithQuestions(test);
  }

  for (const test of hvacTests) {
    await createTestWithQuestions(test);
  }

  // 7. Создаем обучающие материалы
  const learningMaterials = [
    {
      title: 'Основные принципы проектирования железобетонных конструкций',
      content: `# Проектирование железобетонных конструкций
      
Железобетонные конструкции - основа современного строительства, обеспечивающая надежность и долговечность зданий и сооружений.

## Основные принципы расчета железобетона
- Расчет по первой группе предельных состояний (по несущей способности)
- Расчет по второй группе предельных состояний (по деформациям)
- Учет физической нелинейности железобетона
- Учет трещинообразования

## Классы бетона и арматуры

Бетон классифицируется по прочности на сжатие (B), на растяжение (Bt) и по морозостойкости (F).
Арматура классифицируется по прочностным характеристикам и способу производства (A-I, A-III, A400, B500 и др.).

## Пример расчета армирования балки

\`\`\`
1. Определение нагрузок и усилий
2. Подбор сечения бетона с учетом защитного слоя
3. Расчет площади рабочей арматуры
4. Проверка по второй группе предельных состояний
5. Конструирование армирования (хомуты, отгибы, анкеровка)
\`\`\`

## Нормативные документы
- СП 63.13330.2018 "Бетонные и железобетонные конструкции"
- СП 20.13330.2016 "Нагрузки и воздействия"
- ГОСТ 34028-2016 "Прокат арматурный для железобетонных конструкций"

Грамотное проектирование ЖБК - залог безопасности и экономической эффективности строительства.`,
      specializationId: pgsSpec.id,
      createdById: users[0].email, // admin
      isPublished: true,
    },
    {
      title: 'Составление локальных смет',
      content: `# Составление локальных смет

Локальная смета - это первичный сметный документ, составляемый на отдельные виды работ и затрат по зданиям и сооружениям.

## Структура локальной сметы
- Объемы работ, определенные по чертежам и спецификациям
- Единичные расценки (ФЕР, ТЕР)
- Начисление накладных расходов и сметной прибыли
- Лимитированные затраты

## Методы составления смет
- Базисно-индексный метод
- Ресурсный метод
- Ресурсно-индексный метод

## Пример структуры локальной сметы

\`\`\`
1. Прямые затраты:
   - Материалы
   - Оплата труда рабочих
   - Эксплуатация машин и механизмов
2. Накладные расходы
3. Сметная прибыль
4. Итого по смете
5. НДС
\`\`\`

## Нормативные документы
- МДС 81-35.2004 "Методика определения стоимости строительной продукции"
- МДС 81-33.2004 "Методические указания по определению накладных расходов"
- МДС 81-25.2001 "Методические указания по определению сметной прибыли"

Грамотное составление смет - важный этап в обеспечении экономической эффективности строительства.`,
      specializationId: estimatorSpec.id,
      createdById: users[0].email, // admin
      isPublished: true,
    },
    {
      title: 'Проектирование систем вентиляции',
      content: `# Проектирование систем вентиляции

Системы вентиляции обеспечивают необходимый воздухообмен в помещениях для создания комфортных и безопасных условий для людей.

## Основные типы систем вентиляции
- Естественная вентиляция
- Механическая вентиляция
- Приточная вентиляция
- Вытяжная вентиляция
- Приточно-вытяжная вентиляция

## Расчет воздухообмена

Расчет воздухообмена производится по следующим критериям:
- По кратности воздухообмена
- По санитарным нормам (на человека)
- По удалению вредностей (теплоизбытки, влага, CO2)
- По нормативному воздухообмену для определенных помещений

## Пример расчета воздухообмена по кратности

\`\`\`
Объем помещения: 100 м³
Кратность воздухообмена: 3 ч⁻¹
Требуемый воздухообмен = 100 × 3 = 300 м³/ч
\`\`\`

## Нормативные документы
- СП 60.13330.2020 "Отопление, вентиляция и кондиционирование воздуха"
- ГОСТ 30494-2011 "Здания жилые и общественные. Параметры микроклимата в помещениях"
- СанПиН 1.2.3685-21 "Гигиенические нормативы и требования к обеспечению безопасности и (или) безвредности для человека факторов среды обитания"

Правильно спроектированная система вентиляции - залог здорового микроклимата в помещениях.`,
      specializationId: hvacSpec.id,
      createdById: users[0].email, // admin
      isPublished: true,
    },
  ];

  console.log('Создание обучающих материалов...');

  async function createLearningMaterial(materialData) {
    const { title, content, specializationId, createdById, isPublished } =
      materialData;

    // Находим ID создателя по email
    const creator = await prisma.user.findFirst({
      where: { email: createdById },
    });

    if (!creator) {
      console.error(`Пользователь с email ${createdById} не найден`);
      return;
    }

    // Проверяем существование материала
    const existingMaterial = await prisma.learningMaterial.findFirst({
      where: {
        title,
        createdById: creator.id,
      },
    });

    if (existingMaterial) {
      console.log(`Обучающий материал "${title}" уже существует`);
      return;
    }

    // Создаем обучающий материал
    await prisma.learningMaterial.create({
      data: {
        title,
        content,
        specializationId,
        createdById: creator.id,
        isPublished,
      },
    });

    console.log(`Обучающий материал "${title}" создан`);
  }

  for (const material of learningMaterials) {
    await createLearningMaterial(material);
  }

  // 8. Создаем профили для пользователей, у которых их еще нет
  console.log('Проверка и создание профилей для пользователей...');

  const allUsers = await prisma.user.findMany({
    include: {
      profile: true,
    },
  });

  for (const user of allUsers) {
    if (!user.profile) {
      // Получаем основную роль пользователя
      const userRole = await prisma.userRole.findFirst({
        where: { userId: user.id },
        include: { role: true },
      });

      // Находим специализацию по умолчанию
      const defaultSpec = await prisma.specialization.findFirst();

      if (defaultSpec) {
        await prisma.profile.create({
          data: {
            userId: user.id,
            aboutMe: `Профиль пользователя ${user.firstName} ${user.lastName}`,
            specializationId: defaultSpec.id,
          },
        });

        console.log(`Создан профиль для пользователя ${user.email}`);
      }
    } else {
      console.log(`Профиль для пользователя ${user.email} уже существует`);
    }
  }

  console.log('Заполнение базы данных завершено!');
}

main()
  .catch((e) => {
    console.error('Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect().catch(console.error);
  });
