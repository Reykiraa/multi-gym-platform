FROM php:8.3-cli-alpine

# Install PostgreSQL Extension and Sistem Dependencies
RUN apk add --no-cache postgresql-dev libzip-dev zip git bash curl \
    && docker-php-ext-install pdo pdo_pgsql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# Install Laravel Dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Storage Permissions
RUN chmod -R 777 storage bootstrap/cache

EXPOSE 8000

# Run server
CMD php artisan config:cache && php artisan route:cache && php artisan serve --host=0.0.0.0 --port=8000