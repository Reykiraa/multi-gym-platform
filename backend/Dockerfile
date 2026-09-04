FROM php:8.3-cli-alpine

# Install PostgreSQL Extension and Sistem Dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    zip \
    git \
    bash \
    curl \
    && docker-php-ext-install \
    pdo \
    pdo_pgsql \
    zip \
    bcmath \
    intl \
    opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

# Copy Composer files
COPY composer.json composer.lock ./

# Install Laravel Dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy all backend files 
COPY . .

# Storage Permissions
RUN chmod -R 777 storage bootstrap/cache

EXPOSE 8000

# Run server
CMD php artisan config:cache && php artisan route:cache && php artisan serve --host=0.0.0.0 --port=8000