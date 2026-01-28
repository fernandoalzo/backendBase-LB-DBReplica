#!/bin/bash
# Configuración del primary para habilitar la replicación
PGDATA=${PGDATA:-/var/lib/postgresql/data}

# Ajustar parámetros para replicación
cat >> "$PGDATA/postgresql.conf" <<'EOF'
# --- Replication Config ---
wal_level = replica
max_wal_senders = 10
wal_keep_size = 64MB
# listen_addresses = '*'
EOF

# Permitir conexión desde la réplica
cat >> "$PGDATA/pg_hba.conf" <<'EOF'
# Permitir replicación desde cualquier host (ajustar IP según necesidad)
host replication replicator 0.0.0.0/0 md5
host all all 0.0.0.0/0 md5
EOF
