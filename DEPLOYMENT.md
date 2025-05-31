# 🚀 Инструкции по деплою

## Архитектура деплоя

- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway (NestJS + Node.js)
- **Database**: Railway PostgreSQL

## 1. Деплой Backend на Railway

### Шаг 1: Подготовка

1. Создайте аккаунт на [Railway](https://railway.app)
2. Подключите ваш GitHub репозиторий

### Шаг 2: Создание проекта

1. Нажмите "New Project" → "Deploy from GitHub repo"
2. Выберите ваш репозиторий
3. Выберите папку `server` как root directory

### Шаг 3: Добавление PostgreSQL

1. В проекте нажмите "Add Service" → "Database" → "PostgreSQL"
2. Railway автоматически создаст переменную `DATABASE_URL`

### Шаг 4: Настройка переменных окружения

Добавьте в Railway следующие переменные:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here-generate-random
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### Шаг 5: Настройка деплоя

1. В настройках проекта установите:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start:prod`
   - **Root Directory**: `server`

## 2. Деплой Frontend на Vercel

### Шаг 1: Подключение репозитория

1. Войдите в [Vercel](https://vercel.com)
2. Нажмите "New Project" → выберите ваш GitHub репозиторий
3. Установите **Root Directory**: `client`

### Шаг 2: Настройка переменных окружения

Добавьте в Vercel:

```
VITE_API_BASE_URL=https://your-backend-domain.railway.app/api
VITE_NODE_ENV=production
```

### Шаг 3: Настройка сборки

Vercel автоматически определит настройки, но убедитесь:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm ci`

## 3. Автоматический деплой

После настройки каждый push в main ветку будет автоматически:

1. Деплоить backend на Railway
2. Выполнять миграции БД
3. Деплоить frontend на Vercel

## 4. Проверка деплоя

1. Откройте URL вашего frontend на Vercel
2. Проверьте, что API запросы работают
3. Проверьте логи в Railway Dashboard

## Полезные команды

```bash
# Локальная проверка production build
cd server && npm run build && npm run start:prod
cd client && npm run build && npm run preview

# Проверка миграций
cd server && npx prisma migrate status
```

## Troubleshooting

### Проблемы с CORS

Убедитесь, что `CORS_ORIGIN` в Railway соответствует URL Vercel

### Проблемы с БД

Проверьте, что `DATABASE_URL` правильно настроен в Railway

### Проблемы с API

Проверьте, что `VITE_API_BASE_URL` в Vercel указывает на Railway URL
