# syntax=docker/dockerfile:1
# check=error=true

# 1. Usamos la versión de Ruby detectada en tus logs anteriores
ARG RUBY_VERSION=3.4.1
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

WORKDIR /rails

# Instalamos dependencias básicas de ejecución
# Se agrega libyaml-0-2 para evitar errores de carga de gemas en ejecución
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    curl \
    libjemalloc2 \
    libvips \
    postgresql-client \
    libyaml-0-2 && \
    ln -s /usr/lib/$(uname -m)-linux-gnu/libjemalloc.so.2 /usr/local/lib/libjemalloc.so && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Variables de entorno de producción
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development" \
    LD_PRELOAD="/usr/local/lib/libjemalloc.so"

# --- Etapa de construcción (Build) ---
FROM base AS build

# Instalamos paquetes necesarios para compilar gemas nativas (como 'pg')
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y \
    build-essential \
    git \
    libpq-dev \
    libyaml-dev \
    pkg-config && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Instalamos las gemas
COPY Gemfile Gemfile.lock ./

# Optimizamos para entornos con poca RAM (Render Free/Starter)
# Limitamos a 1 job para evitar el error 'exit status 1' por falta de memoria
RUN bundle config set --local jobs 1 && \
    bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile -j 1 --gemfile

# Copiamos el resto de la aplicación
COPY . .

# Precompilamos bootsnap para mejorar el tiempo de arranque del contenedor
RUN bundle exec bootsnap precompile -j 1 app/ lib/

# --- Etapa Final (Runtime) ---
FROM base

# Seguridad: Creamos un usuario 'rails' para no correr como root
RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
    mkdir -p db log storage tmp && \
    chown -R rails:rails db log storage tmp

USER 1000:1000

# Copiamos las gemas y el código desde la etapa de build
COPY --chown=rails:rails --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --chown=rails:rails --from=build /rails /rails

# Aseguramos permisos de ejecución en los scripts de Rails 8
RUN chmod +x bin/*

# Punto de entrada (ejecuta migraciones automáticamente si bin/docker-entrypoint existe)
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Exponemos el puerto 80 para Thruster (acelerador de Rails 8)
EXPOSE 80

# Comando por defecto para iniciar la aplicación
CMD ["./bin/thrust", "./bin/rails", "server"]