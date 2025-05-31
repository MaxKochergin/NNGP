// Railway configuration with fallbacks
export const railwayConfig = {
  // Реальный DATABASE_URL из Railway PostgreSQL
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://postgres:tcHTDfzKOwYTWbiZjrjImmkwOfUWaCwS@postgres.railway.internal:5432/railway',
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-jwt-secret-key',
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT || '3000',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

// Логируем конфигурацию для отладки
console.log('Railway Config:', {
  DATABASE_URL_exists: !!railwayConfig.DATABASE_URL,
  JWT_SECRET_exists: !!railwayConfig.JWT_SECRET,
  NODE_ENV: railwayConfig.NODE_ENV,
  PORT: railwayConfig.PORT,
});
