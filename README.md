# portfolio-vue

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
- `VUE_APP_EMAILJS_PUBLIC_KEY`
- `VUE_APP_EMAILJS_SERVICE_ID`
- `VUE_APP_EMAILJS_TEMPLATE_ID`

Tras hacer push a `main`, el workflow construirá y desplegará automáticamente.

Atajo opcional con GitHub CLI (macOS):

```zsh
chmod +x scripts/setup-github-secrets.zsh
./scripts/setup-github-secrets.zsh
```
