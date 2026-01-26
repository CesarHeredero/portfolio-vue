# Configuración de Deploy
# Este archivo contiene la información del servidor de destino

## Servidor SSH/SFTP
- **Host**: 135.125.102.63
- **Usuario**: debian
- **Puerto**: 22
- **Ruta remota**: /home/debian/portfolio/dist/

## Comandos disponibles

### Para desarrollo
```bash
npm run serve    # Ejecutar en localhost:8080
```

### Para publicación
```bash
npm run build    # Generar build de producción
npm run deploy   # Subir archivos al servidor
npm run publish  # Build + Deploy (proceso completo)
```

## Requisitos

1. **SSH Key configurada**: Asegúrate de tener acceso SSH al servidor sin contraseña
2. **rsync instalado**: El script usa rsync para sincronizar archivos
3. **Directorio remoto**: El directorio `/home/debian/portfolio/dist/` debe existir en el servidor

## Configuración de SSH Key (opcional)

Para evitar introducir la contraseña cada vez:

```bash
# Generar clave SSH (si no tienes una)
ssh-keygen -t rsa -b 4096 -C "tu-email@ejemplo.com"

# Copiar clave al servidor
ssh-copy-id debian@135.125.102.63
```

## Solución de problemas

- Si obtienes error de permisos, verifica que el directorio remoto existe
- Si rsync no está disponible, instálalo: `brew install rsync` (macOS)
- Para debug del deploy, ejecuta: `./scripts/deploy.sh` directamente