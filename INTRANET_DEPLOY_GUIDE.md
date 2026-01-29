# Guía paso a paso: Intranet + CI/CD (con rama y merge)

## 0) Preparación local (repo)

1. Asegúrate de estar en la raíz del repo:
   - `portfolio-vue-main/`
2. Sincroniza con la rama principal:
   - `git checkout main`
   - `git pull`

## 1) Crear rama de trabajo

1. Crear y entrar en la rama:
   - `git checkout -b feature/intranet`

2. Revisar cambios:
   - `git status`

## 2) Commit de cambios

1. Añadir cambios:
   - `git add .`
2. Crear commit:
   - `git commit -m "feat: intranet crud + docker + ci/cd"`

## 3) Publicar rama en remoto

1. Subir la rama:
   - `git push -u origin feature/intranet`

## 4) Merge a main (y poder revertir)

### Opción A: Merge normal (recomendado)
1. Volver a `main`:
   - `git checkout main`
   - `git pull`
2. Merge:
   - `git merge feature/intranet`
3. Subir cambios:
   - `git push origin main`

### Opción B: Pull Request (más seguro)
1. En GitHub, abre un PR de `feature/intranet` → `main`.
2. Revisa cambios y mergea desde la UI.

## 5) Configurar secrets de CI/CD en GitHub

En GitHub → **Settings → Secrets and variables → Actions**:

- `VPS_HOST`
- `VPS_USER`
- `VPS_PORT`
- `VPS_SSH_KEY` (clave privada)
- `VPS_PATH` (ruta absoluta del repo en el VPS)

## 6) Despliegue automático (GitHub Actions)

Cada push a `main` (con cambios en `/client`, `/server` o `docker-compose.yml`) ejecuta:
- `git pull`
- `docker compose build`
- `docker compose up -d --remove-orphans`

## 7) Seed inicial

Una sola vez:
- `docker compose exec backend node seed.js`

## 8) URLs

- Intranet: `https://intracesar.cesarheredero.com`
- Health: `https://intracesar.cesarheredero.com/api/health`

## 8.1) Nginx Proxy Manager (gestor-web)

En Nginx Proxy Manager (puerto 81):

### Proxy Host principal (frontend)
- **Domain:** `intracesar.cesarheredero.com`
- **Scheme:** `http`
- **Forward Hostname/IP:** `frontend`
- **Forward Port:** `80`
- **Block Common Exploits:** ✅
- **Websockets Support:** ✅

### Custom Locations

**/api**
- Forward Hostname/IP: `backend`
- Forward Port: `4000`
- Scheme: `http`

**/uploads**
- Forward Hostname/IP: `backend`
- Forward Port: `4000`
- Scheme: `http`

## 9) Volver atrás (rollback rápido)

Si algo falla:
1. Ver historial de commits:
   - `git log --oneline`
2. Volver a un commit anterior:
   - `git reset --hard <commit_sha>`
3. Subir cambios:
   - `git push -f origin main`

> Alternativa más segura: crear un nuevo commit revertiendo con `git revert <commit_sha>`.
