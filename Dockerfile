# Multi-stage build для оптимизации размера образа

# Стадия 1: Сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и устанавливаем все зависимости (включая dev)
COPY package*.json ./
RUN npm ci

# Копируем исходники
COPY . .

# Собираем приложение (frontend + backend)
RUN npm run build

# Стадия 2: Production образ
FROM node:20-alpine

WORKDIR /app

# Устанавливаем только production зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем собранное приложение из builder stage
COPY --from=builder /app/dist ./dist

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=5000

# Открываем порт
EXPOSE 5000
# Healthcheck: ждём пока поднимется сервер и проверяем /healthz
HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD wget -qO- http://localhost:5000/healthz >/dev/null 2>&1 || exit 1

# Запускаем собранное приложение
CMD ["node", "dist/index.js"]
