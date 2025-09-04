#!/usr/bin/env zsh

set -e

echo "==> Comprobando GitHub CLI..."
if ! command -v gh >/dev/null 2>&1; then
  echo "Error: GitHub CLI (gh) no está instalado. Instálalo: https://cli.github.com/"
  exit 1
fi

echo "==> Comprobando autenticación en GitHub..."
if ! gh auth status >/dev/null 2>&1; then
  echo "Error: no estás autenticado en gh. Ejecuta: gh auth login"
  exit 1
fi

echo "==> Detectando repositorio..."
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)
if [[ -z "$REPO" ]]; then
  # Fallback a remoto origin
  ORIGIN_URL=$(git remote get-url origin 2>/dev/null || true)
  if [[ -z "$ORIGIN_URL" ]]; then
    echo "Error: no se pudo detectar el repositorio. Ejecuta dentro del repo con remote origin configurado."
    exit 1
  fi
  if [[ "$ORIGIN_URL" == git@github.com:* ]]; then
    REPO=${ORIGIN_URL#git@github.com:}
    REPO=${REPO%.git}
  elif [[ "$ORIGIN_URL" == https://github.com/* ]]; then
    REPO=${ORIGIN_URL#https://github.com/}
    REPO=${REPO%.git}
  fi
fi

if [[ -z "$REPO" ]]; then
  echo "Error: no se pudo determinar owner/repo."
  exit 1
fi
echo "Repositorio: $REPO"

echo "==> Configurando secretos de Actions en $REPO"

typeset -a NAMES
NAMES=(
  FTP_SERVER
  FTP_USERNAME
  FTP_PASSWORD
  FTP_SERVER_DIR
  VUE_APP_EMAILJS_PUBLIC_KEY
  VUE_APP_EMAILJS_SERVICE_ID
  VUE_APP_EMAILJS_TEMPLATE_ID
)

for NAME in ${NAMES[@]}; do
  CUR=$(gh secret list --repo "$REPO" --json name -q ".[] | select(.name==\"$NAME\").name" 2>/dev/null || true)
  if [[ "$CUR" == "$NAME" ]]; then
    echo "- $NAME ya existe. ¿Deseas sobrescribirlo? [s/N] "
    read -r OVER
    if [[ ! "$OVER" =~ ^[sS]$ ]]; then
      echo "  · Omitido $NAME"
      continue
    fi
  fi
  PROMPT="Introduce valor para $NAME: "
  # No mostramos el valor al teclear
  read -rs "VALUE?$PROMPT"
  echo
  if [[ -z "$VALUE" ]]; then
    echo "  ! Se omitió $NAME por estar vacío"
    continue
  fi
  gh secret set "$NAME" --repo "$REPO" --body "$VALUE" >/dev/null && echo "  ✓ $NAME configurado" || echo "  ✗ Error al configurar $NAME"
done

echo "==> Listo. Puedes revisar los secretos en https://github.com/$REPO/settings/secrets/actions"
