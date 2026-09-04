FROM php:8.4-cli-alpine

# Install sistem dependecies, PostgreSQL Extension and extra libraries
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    icu-dev \
    oniguruma-dev \
    zip \
    git \
    bash \
    curl \
    linux-headers \
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

# Copy composer files
COPY composer.json composer.lock ./

# Install Laravel dependencies (With PHP 8.4 & Fail-safe flag)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --ignore-platform-reqs

# Copy all backend files
COPY . .

# Set permission storage
RUN chmod -R 777 storage bootstrap/cache

EXPOSE 8000

# Run server
CMD php artisan config:cache && php artisan route:cache && php artisan serve --host=0.0.0.0 --port=8000