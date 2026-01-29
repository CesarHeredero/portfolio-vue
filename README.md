# portfolio-vue

## Intranet (Docker + Monorepo)

Este repositorio incluye una intranet en `/client` (Vue 3 + Vite) y `/server` (Node.js + Express), manteniendo el portfolio público actual en la raíz del repo.

### Puesta en marcha rápida

- Ajusta variables en `server/.env.example` y crea tu `.env`.
- Levanta los servicios:
	- `docker compose up -d --build`
- Semilla inicial de categorías:
	- `docker compose exec backend node seed.js`

### Deploy en VPS

Ejecuta `./deploy.sh` en el VPS para hacer `git pull`, reconstruir y levantar los contenedores.

### CI/CD (GitHub Actions → VPS)

Workflow: `.github/workflows/deploy-intranet-vps.yml`

Secrets requeridos en GitHub:
- `VPS_HOST`
- `VPS_USER`
- `VPS_PORT`
- `VPS_SSH_KEY` (clave privada)
- `VPS_PATH` (ruta del repo en el VPS)

### Dominio intranet (intracesar.cesarheredero.com)

El frontend de la intranet se sirve en el subdominio `intracesar.cesarheredero.com`.
El contenedor de Nginx del frontend ya proxya `/api` y `/uploads` al backend, así que
desde el cliente basta con usar `VITE_API_BASE=/api`.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Despliegue por GitHub Actions (FTP)

Este repo incluye un workflow `.github/workflows/deploy-ftp.yml` que:
- Construye la app con `npm ci && npm run build` en cada push a `main`.
- Sube el contenido de `dist/` a tu servidor por FTP/FTPS.

Configura en GitHub → Settings → Secrets and variables → Actions → New repository secret:

- `FTP_SERVER` (por ejemplo: ftp.tudominio.com)
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `FTP_SERVER_DIR` (carpeta destino, p.ej. `/public_html/` o `/www/`)
- `FTP_PROTOCOL` (opcional: `ftp`, `ftps` o `sftp`. Por defecto, `ftps`)

Tras hacer push a `main`, el workflow construirá y desplegará automáticamente.

Atajo opcional con GitHub CLI (macOS):

```zsh
chmod +x scripts/setup-github-secrets.zsh
./scripts/setup-github-secrets.zsh
```

## Formulario de contacto (Formspree)

El formulario usa Formspree como proveedor principal. Si quieres cambiar el endpoint, edita el atributo `action` del formulario en:

- `src/App.vue`
- `src/components/ContactInfo.vue`

No son necesarios secretos ni claves para el cliente. Revisa tus envíos en tu panel de Formspree.

Nota: El despliegue está configurado con “clean slate” (limpieza total del directorio remoto) para evitar restos de builds antiguas. Además, `public/.htaccess` desactiva cache para `index.html` y aplica cache largo a assets.
