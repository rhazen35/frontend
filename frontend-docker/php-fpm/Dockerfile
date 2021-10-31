FROM php:7.4.19-fpm-alpine

RUN apk add --no-cache \
        acl \
        fcgi \
        file \
        gettext \
        git \
        make \
        bash \
        nano \
        zip \
        openssh-client \
        nginx \
        freetype \
        libpng \
        libjpeg-turbo \
        freetype-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        $PHPIZE_DEPS \
    ;

RUN pecl install xdebug

RUN docker-php-ext-install pdo_mysql

COPY --from=composer /usr/bin/composer /usr/bin/composer

RUN mkdir /var/log/messenger

WORKDIR /var/www
EXPOSE ${PHP_FPM_EXPOSED_PORT}