# Руководство по развертыванию проекта "Политех-ЕАО"

## 📋 Предварительные требования

- Docker и Docker Compose
- Минимум 2GB RAM
- Минимум 5GB свободного места на диске
- Домен или IP-адрес сервера

## 🚀 Быстрое развертывание с Docker Compose

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd politeh-eao
```

### 2. Настройка переменных окружения

```bash
cp .env.example .env
# Отредактируйте .env файл с вашими настройками
```

**Обязательные переменные для изменения:**
- `DB_PASSWORD` - пароль для базы данных
- `JWT_SECRET` - секретный ключ для JWT токенов
- `FRONTEND_URL` - URL вашего фронтенда
- `CORS_ORIGIN` - origin для CORS

### 3. Запуск приложения

```bash
# Сборка и запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down
```

### 4. Проверка развертывания

- Фронтенд: `http://your-domain.com`
- Бэкенд API: `http://your-domain.com:5000`
- Админ-панель: `http://your-domain.com/admin`

## 🔧 Ручная настройка сервера

### Требования к серверу

- Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- Node.js 18+
- PostgreSQL 13+
- Nginx
- SSL сертификат (рекомендуется)

### 1. Установка зависимостей

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib nginx

# CentOS/RHEL
sudo yum install nodejs npm postgresql-server postgresql-contrib nginx
```

### 2. Настройка PostgreSQL

```bash
# Инициализация БД
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Создание пользователя и базы данных
sudo -u postgres psql
CREATE DATABASE politeh;
CREATE USER politeh_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE politeh TO politeh_user;
\q
```

### 3. Настройка бэкенда

```bash
cd backend
npm install --production
npx prisma generate
npx prisma db push
npm run build
```

### 4. Настройка фронтенда

```bash
cd ../frontend
npm install
npm run build
```

### 5. Настройка Nginx

Создайте файл `/etc/nginx/sites-available/politeh-eao`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files
    location /uploads/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 6. Настройка systemd сервисов

Создайте файл `/etc/systemd/system/politeh-backend.service`:

```ini
[Unit]
Description=Politech-EAO Backend
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/your/app/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
```

Аналогично для фронтенда, если используете отдельный процесс.

## 🔒 Безопасность

### Важные меры безопасности:

1. **SSL/TLS**: Всегда используйте HTTPS в продакшене
2. **Firewall**: Настройте UFW или firewalld
3. **Обновления**: Регулярно обновляйте зависимости
4. **Мониторинг**: Настройте логирование и мониторинг
5. **Бэкапы**: Настройте регулярные бэкапы базы данных

### Команды для базовой настройки безопасности:

```bash
# Установка UFW
sudo apt install ufw
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Отключение root SSH
sudo sed -i 's/#PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

## 📊 Мониторинг и обслуживание

### Проверка состояния:

```bash
# Проверка Docker контейнеров
docker-compose ps

# Просмотр логов
docker-compose logs backend
docker-compose logs frontend

# Проверка использования ресурсов
docker stats
```

### Обновление приложения:

```bash
# Остановка
docker-compose down

# Обновление кода
git pull

# Пересборка и запуск
docker-compose up -d --build
```

## 🆘 Устранение неполадок

### Распространенные проблемы:

1. **Порт уже используется**: `sudo lsof -i :5000`
2. **База данных недоступна**: Проверьте подключение PostgreSQL
3. **Файлы не загружаются**: Проверьте права на папку uploads
4. **CORS ошибки**: Проверьте настройки CORS_ORIGIN

### Логи для диагностики:

```bash
# Docker логи
docker-compose logs -f backend

# Nginx логи
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Системные логи
sudo journalctl -u politeh-backend -f
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи приложений
2. Убедитесь, что все переменные окружения настроены
3. Проверьте сетевые настройки
4. Свяжитесь с разработчиками