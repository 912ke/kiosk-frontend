# BurnoutZ Kiosk - Развертывание в Docker

## Быстрый старт

### 1. Подготовка

Убедитесь, что установлены:
- Docker (версия 20.10 или выше)
- Docker Compose (версия 2.0 или выше)

### 2. Сборка и запуск

```bash
# Клонируйте репозиторий или скопируйте файлы проекта
cd burnoutz-kiosk

# Создайте файл .env (опционально)
cat > .env << EOF
SESSION_SECRET=your-super-secret-key-here-change-me
NODE_ENV=production
PORT=5000
EOF

# Соберите и запустите контейнеры
docker-compose up -d --build

# Проверьте статус
docker-compose ps

# Просмотр логов
docker-compose logs -f app
```

Приложение будет доступно по адресу: **http://localhost:5000**

### 3. Остановка и удаление

```bash
# Остановить контейнеры
docker-compose down

# Остановить и удалить volumes
docker-compose down -v
```

## Расширенная настройка

### Использование PostgreSQL базы данных

Приложение по умолчанию использует in-memory хранилище. Для использования PostgreSQL:

1. Раскомментируйте секцию `postgres` в `docker-compose.yml`
2. Раскомментируйте переменные окружения для БД
3. Создайте файл `.env`:

```bash
SESSION_SECRET=your-secret-key
DATABASE_URL=postgresql://burnoutz:change-this-password@postgres:5432/burnoutz_kiosk
PGHOST=postgres
PGPORT=5432
PGUSER=burnoutz
PGPASSWORD=change-this-password
PGDATABASE=burnoutz_kiosk
```

4. Перезапустите контейнеры:

```bash
docker-compose down
docker-compose up -d --build
```

### Настройка порта

Измените порт в `docker-compose.yml`:

```yaml
ports:
  - "8080:5000"  # Внешний порт:Внутренний порт
```

### Production deployment

Для production развертывания:

1. **Измените SESSION_SECRET** на надежный случайный ключ
2. **Настройте reverse proxy** (Nginx/Traefik) с SSL/TLS
3. **Настройте автоматический перезапуск**: `restart: always`
4. **Настройте мониторинг и логирование**
5. **Регулярно обновляйте образы**

Пример конфигурации Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Управление

### Просмотр логов

```bash
# Все логи
docker-compose logs -f

# Только приложение
docker-compose logs -f app

# Последние 100 строк
docker-compose logs --tail=100 app
```

### Перезапуск

```bash
# Перезапустить только приложение
docker-compose restart app

# Перезапустить все сервисы
docker-compose restart
```

### Обновление приложения

```bash
# Остановить контейнеры
docker-compose down

# Обновить код (git pull или копирование файлов)
git pull

# Пересобрать и запустить
docker-compose up -d --build
```

### Резервное копирование

#### Резервная копия базы данных (если используется PostgreSQL):

```bash
docker-compose exec postgres pg_dump -U burnoutz burnoutz_kiosk > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Восстановление из резервной копии:

```bash
cat backup_20250120_123456.sql | docker-compose exec -T postgres psql -U burnoutz burnoutz_kiosk
```

## Устранение неполадок

### Контейнер не запускается

```bash
# Проверьте логи
docker-compose logs app

# Проверьте статус
docker-compose ps
```

### Приложение недоступно

1. Проверьте, что порт 5000 не занят другим приложением
2. Проверьте firewall настройки
3. Убедитесь, что контейнер запущен: `docker-compose ps`

### Проблемы с производительностью

```bash
# Проверьте использование ресурсов
docker stats

# Ограничьте ресурсы в docker-compose.yml:
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
```

## Технические детали

- **Образ базовый**: node:20-alpine (легковесный)
- **Многоступенчатая сборка**: оптимизация размера образа
- **Production режим**: только необходимые зависимости
- **Автоматический перезапуск**: настроен через `restart: unless-stopped`

## Системные требования

### Минимальные:
- CPU: 1 ядро
- RAM: 512 MB
- Диск: 1 GB

### Рекомендуемые:
- CPU: 2 ядра
- RAM: 2 GB
- Диск: 5 GB (с учетом логов и базы данных)

## Безопасность

1. **Никогда не используйте стандартные пароли** в production
2. **Используйте HTTPS** через reverse proxy
3. **Регулярно обновляйте** зависимости и образы Docker
4. **Ограничьте доступ** к портам базы данных
5. **Используйте Docker secrets** для чувствительных данных в production

## Поддержка

При возникновении проблем:
1. Проверьте логи: `docker-compose logs -f`
2. Проверьте переменные окружения
3. Убедитесь, что все порты доступны
4. Проверьте версии Docker и Docker Compose
