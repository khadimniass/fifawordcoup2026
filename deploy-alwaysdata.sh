#!/usr/bin/env bash
# Déploie le frontend statique sur alwaysdata via rsync/SSH.
# Pré-requis : SSH activé sur le compte alwaysdata (clé ou mot de passe).
set -euo pipefail

ACCOUNT="world-cup2026"                       # nom du compte alwaysdata
SSH_HOST="ssh-${ACCOUNT}.alwaysdata.net"      # vérifie dans alwaysdata ▸ SSH
REMOTE_DIR="www/"                             # racine du site (/home/<compte>/www/)

echo "▶ Build du frontend…"
npm run build

echo "▶ Upload vers ${ACCOUNT}@${SSH_HOST}:${REMOTE_DIR}…"
rsync -avz --delete dist/ "${ACCOUNT}@${SSH_HOST}:${REMOTE_DIR}"

echo "✅ Déployé → https://${ACCOUNT}.alwaysdata.net"
