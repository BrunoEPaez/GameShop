# syntax=docker/dockerfile:1
# check=error=true

# 1. Asegúrate de que RUBY_VERSION sea EXACTAMENTE la que tienes en tu Gemfile o .ruby-version
# Si en tu anterior log de Render decía 3.4.1, usa esa.
ARG RUBY_VERSION=3.4.1
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

WORKDIR /rails

# Instalamos dependencias básicas de ejecución
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

# Necesitamos libpq-dev para compilar la gema 'pg' (PostgreSQL)
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
RUN bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile -j 1 --gemfile

# Copiamos el código
COPY . .

# Precompilamos bootsnap para un arranque veloz
RUN bundle exec bootsnap precompile -j 1 app/ lib/

# --- Etapa Final ---
FROM base

# Seguridad: No correr como root
RUN groupadd --system --gid 1000 rails && \
    useradd rails --uid 1000 --gid 1000 --create-home --shell /bin/bash && \
    mkdir -p db log storage tmp && \
    chown -t rails:rails db log storage tmp

USER 1000:1000

# Copiamos lo construido
COPY --chown=rails:rails --from=build "${BUNDLE_PATH}" "${BUNDLE_PATH}"
COPY --chown=rails:rails --from=build /rails /rails

# Permisos para los ejecutables (importante para Render)
RUN chmod +x bin/*

# Punto de entrada para migraciones automáticas
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Exponemos el puerto 80 (Thruster)
EXPOSE 80

# Comando de inicio usando Thruster (acelerador HTTP de Rails 8)
CMD ["./bin/thrust", "./bin/rails", "server"]