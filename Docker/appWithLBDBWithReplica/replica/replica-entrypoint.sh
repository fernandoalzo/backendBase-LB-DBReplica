#!/bin/bash
# Entrypoint de la réplica PostgreSQL
set -e

PRIMARY_HOST="postgres_primary"
PRIMARY_PORT=5432
REPL_USER="replicator"
REPL_PASSWORD="replica_pass"
PGDATA="/var/lib/postgresql/data"

echo "Esperando al primary en ${PRIMARY_HOST}:${PRIMARY_PORT}..."
until pg_isready -h "$PRIMARY_HOST" -p "$PRIMARY_PORT" -U "$REPL_USER" >/dev/null 2>&1; do
  sleep 1
done

if [ -s "$PGDATA/PG_VERSION" ]; then
  echo "Data existente detectada, iniciando como réplica..."
  exec docker-entrypoint.sh postgres
fi

export PGPASSWORD="$REPL_PASSWORD"
echo "Inicializando réplica con pg_basebackup..."
pg_basebackup -h "$PRIMARY_HOST" -p "$PRIMARY_PORT" -U "$REPL_USER" -D "$PGDATA" -Fp -Xs -P -R

unset PGPASSWORD
echo "Arrancando réplica..."
exec docker-entrypoint.sh postgres
