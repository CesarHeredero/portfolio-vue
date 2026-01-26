#!/bin/bash

# Script de deploy alternativo usando SCP
# Configuración del servidor
HOST="135.125.102.63"
USER="debian"
PORT="22"
REMOTE_PATH="/home/debian/portfolio/dist/"
LOCAL_DIST="./dist"

echo "🚀 Iniciando proceso de deploy (SCP)..."

# Verificar que existe el directorio dist
if [ ! -d "$LOCAL_DIST" ]; then
    echo "❌ Error: No se encontró el directorio dist. Ejecuta 'npm run build' primero."
    exit 1
fi

echo "🗑️  Limpiando directorio remoto..."
ssh -p $PORT $USER@$HOST "rm -rf $REMOTE_PATH* && mkdir -p $REMOTE_PATH"

echo "📦 Subiendo archivos al servidor..."

# Usar scp para subir los archivos
scp -P $PORT -r $LOCAL_DIST/* $USER@$HOST:$REMOTE_PATH

if [ $? -eq 0 ]; then
    echo "✅ Deploy completado exitosamente!"
    echo "🌐 Tu sitio debería estar disponible en el servidor."
else
    echo "❌ Error durante el deploy. Verifica la conexión y credenciales."
    exit 1
fi