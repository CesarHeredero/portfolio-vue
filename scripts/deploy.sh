#!/bin/bash

# Script de deploy para el portfolio Vue.js
# Configuración del servidor
HOST="135.125.102.63"
USER="debian"
PORT="22"
REMOTE_PATH="/home/debian/portfolio/dist/"
LOCAL_DIST="./dist"

echo "🚀 Iniciando proceso de deploy..."

# Verificar que existe el directorio dist
if [ ! -d "$LOCAL_DIST" ]; then
    echo "❌ Error: No se encontró el directorio dist. Ejecuta 'npm run build' primero."
    exit 1
fi

echo "📦 Subiendo archivos al servidor..."

# Usar rsync para sincronizar los archivos
# -r: recursivo
# -v: verbose
# -z: compresión
# --delete: elimina archivos que no están en local
rsync -rvz --delete \
    -e "ssh -p $PORT" \
    "$LOCAL_DIST/" \
    "$USER@$HOST:$REMOTE_PATH"

if [ $? -eq 0 ]; then
    echo "✅ Deploy completado exitosamente!"
    echo "🌐 Tu sitio debería estar disponible en el servidor."
else
    echo "❌ Error durante el deploy. Verifica la conexión y credenciales."
    exit 1
fi