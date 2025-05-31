#!/bin/bash

echo "🚀 Starting deployment process..."

# Установка зависимостей
echo "📦 Installing dependencies..."
npm ci

# Генерация Prisma клиента
echo "🔧 Generating Prisma client..."
npx prisma generate

# Выполнение миграций базы данных
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Сборка приложения
echo "🏗️ Building application..."
npm run build

echo "✅ Deployment process completed!" 