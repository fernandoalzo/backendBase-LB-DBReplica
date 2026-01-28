-- Crear usuario de replicación
CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replica_pass';

-- Crear tabla de prueba para verificar la replicación
CREATE TABLE IF NOT EXISTS test_replication (
  id serial PRIMARY KEY,
  info text,
  created_at timestamptz DEFAULT now()
);

INSERT INTO test_replication (info) VALUES ('Fila inicial en PRIMARY');
