#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
command -v docker >/dev/null || { echo 'Install Docker Engine and Docker Compose plugin first.'; exit 1; }
docker compose version >/dev/null
if [ ! -f .env ]; then
  read -r -p 'Domain pointing to this VPS (e.g. cricket.arcite.in): ' ccl_domain
  [[ "$ccl_domain" =~ ^[A-Za-z0-9][A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]] || { echo 'Use a valid domain, without https:// or a path.'; exit 1; }
  umask 077
  ccl_secret=$(openssl rand -hex 32)
  ccl_admin=$(openssl rand -hex 24)
  printf 'DOMAIN=%s\nPUBLIC_ORIGIN=https://%s\nSESSION_SECRET=%s\nADMIN_USER=admin\nADMIN_PASSWORD=%s\nCOOKIE_SECURE=true\n' "$ccl_domain" "$ccl_domain" "$ccl_secret" "$ccl_admin" > .env
  echo 'Created .env. Organiser username: admin. Password is in .env (ADMIN_PASSWORD).'
fi
docker compose up -d --build
echo 'Deployment started. Use docker compose logs -f to check startup and HTTPS issuance.'
