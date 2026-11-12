#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p backups
chmod 700 backups
umask 077
ccl_backup="backups/ccl-$(date -u +%Y%m%d-%H%M%S).tar.gz"
trap 'docker compose start app >/dev/null' EXIT
docker compose stop app
docker compose run --rm --no-deps -T app tar -czf - -C /app/data . > "$ccl_backup"
echo "Saved $ccl_backup. Store .env separately and privately for disaster recovery."
