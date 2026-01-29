#!/bin/bash

set -e

echo "🚀 Actualizando repositorio..."
git pull

echo "🐳 Reconstruyendo imágenes..."
docker compose build

echo "📦 Levantando servicios..."
docker compose up -d --remove-orphans

echo "✅ Deploy completado"
