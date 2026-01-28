# 🚀 Credit Community - Load Balancing + Database Replication

## 📋 Descripción General

Esta configuración combina **balanceo de carga con Nginx** y **replicación de base de datos PostgreSQL** para crear una arquitectura de alta disponibilidad.

### Arquitectura

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                     Docker Network                          │
                    │                   172.18.26.0/26                            │
                    │                                                             │
     Port 3000      │   ┌─────────┐      ┌─────────┐      ┌─────────┐           │
    ──────────────► │   │  Nginx  │─────►│  App 1  │─────►│ Primary │           │
                    │   │   LB    │      │  :3000  │      │   DB    │           │
                    │   │         │      ├─────────┤      │  :5432  │           │
                    │   │         │─────►│  App 2  │      │         │           │
                    │   └─────────┘      │  :3000  │      └────┬────┘           │
                    │                    └─────────┘           │                 │
                    │                                    Replicación             │
                    │                                          │                 │
                    │                                    ┌─────▼────┐            │
                    │                                    │ Replica  │            │
                    │                                    │   DB     │            │
     Port 5050      │   ┌──────────┐                    │  :5433   │            │
    ──────────────► │   │ pgAdmin  │                    └──────────┘            │
                    │   └──────────┘                                             │
                    └─────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Archivos

```
appWithLBDBWithReplica/
├── docker-compose.yml          # Configuración principal de Docker
├── nginx.conf                  # Configuración del balanceador de carga
├── DEPLOYMENT_MANUAL.md        # Este manual
├── primary/
│   └── initdb/
│       ├── 01_create_replication_user.sql  # Crea usuario de replicación
│       └── 02_configure_primary.sh         # Configura el primary para replicación
├── replica/
│   └── replica-entrypoint.sh   # Script de inicio de la réplica
├── primary_data/               # (Generado) Datos del primary
└── replica_data/               # (Generado) Datos de la réplica
```

---

## 🛠️ Requisitos Previos

- **Docker** v20.10 o superior
- **Docker Compose** v2.0 o superior
- Archivo `.env` configurado en la raíz del proyecto (`../../.env`)

---

## 🚀 Despliegue

### 1. Primer Despliegue (Limpio)

```bash
# Navegar al directorio
cd Docker/appWithLBDBWithReplica

# Limpiar datos anteriores (si existen)
rm -rf primary_data replica_data

# Construir e iniciar todos los servicios
docker-compose up --build -d
```

### 2. Verificar Servicios

```bash
# Ver estado de todos los contenedores
docker-compose ps

# Deberías ver 6 contenedores corriendo:
# - cc_lb_replica_db_primary    (PostgreSQL Primary)
# - cc_lb_replica_db_replica    (PostgreSQL Replica)
# - cc_lb_replica_pgadmin       (pgAdmin)
# - cc_lb_replica_app_1         (App Instance 1)
# - cc_lb_replica_app_2         (App Instance 2)
# - cc_lb_replica_nginx         (Nginx Load Balancer)
```

### 3. Ver Logs

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f nginx
docker-compose logs -f app1
docker-compose logs -f postgres_primary
docker-compose logs -f postgres_replica
```

---

## 🌐 Acceso a los Servicios

| Servicio | URL/Puerto | Descripción |
|----------|------------|-------------|
| **Aplicación** | `http://localhost:3000` | App con balanceo de carga |
| **pgAdmin** | `http://localhost:5050` | Administrador de PostgreSQL |
| **Primary DB** | `localhost:5432` | Base de datos principal |
| **Replica DB** | `localhost:5433` | Base de datos réplica (solo lectura) |

### Credenciales pgAdmin
- **Email:** `root@mail.com`
- **Password:** `12345`

### Credenciales PostgreSQL
- **Usuario:** `root`
- **Password:** `12345`
- **Base de datos:** `creditCommunity`

---

## ✅ Verificar la Replicación

### 1. Verificar estado de la réplica

```bash
# Conectarse al primary
docker exec -it cc_lb_replica_db_primary psql -U root -d creditCommunity

# Verificar procesos de replicación
SELECT * FROM pg_stat_replication;

# Salir
\q
```

### 2. Probar la replicación

```bash
# En el PRIMARY: insertar datos
docker exec -it cc_lb_replica_db_primary psql -U root -d creditCommunity -c \
  "INSERT INTO test_replication (info) VALUES ('Prueba de replicación $(date)');"

# En la REPLICA: verificar que los datos se replicaron
docker exec -it cc_lb_replica_db_replica psql -U root -d creditCommunity -c \
  "SELECT * FROM test_replication;"
```

---

## ⚖️ Verificar el Balanceo de Carga

### 1. Health Check

```bash
# Verificar endpoint de salud de Nginx
curl http://localhost:3000/health
# Respuesta esperada: OK
```

### 2. Ver distribución del tráfico

```bash
# Hacer múltiples peticiones y ver en qué instancia se procesan
for i in {1..10}; do
  curl -s http://localhost:3000/api/health
  echo " - Request $i"
done
```

### 3. Ver logs de las instancias

```bash
# Ver logs de ambas apps en paralelo
docker-compose logs -f app1 app2
```

---

## 🔧 Comandos Útiles

### Reiniciar servicios

```bash
# Reiniciar un servicio específico
docker-compose restart nginx
docker-compose restart app1
docker-compose restart app2

# Reiniciar todos los servicios
docker-compose restart
```

### Detener y eliminar

```bash
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: elimina datos)
docker-compose down -v

# Detener, eliminar todo y limpiar datos
docker-compose down -v
rm -rf primary_data replica_data
```

### Escalar instancias (sin Docker Swarm)

Para agregar más instancias de la app, edita `docker-compose.yml` y agrega más servicios (`app3`, `app4`, etc.) y actualiza `nginx.conf` para incluirlos en el upstream.

---

## ⚠️ Solución de Problemas

### La réplica no inicia

```bash
# Verificar logs de la réplica
docker-compose logs postgres_replica

# Si hay problemas, eliminar datos de la réplica y reiniciar
docker-compose down
rm -rf replica_data
docker-compose up -d
```

### Error de conexión a la base de datos

```bash
# Verificar que el primary esté saludable
docker-compose exec postgres_primary pg_isready -U root -d creditCommunity

# Verificar variables de entorno de la app
docker-compose exec app1 env | grep -E "(DB|DATABASE|POSTGRES)"
```

### Nginx no balancea correctamente

```bash
# Verificar configuración de Nginx
docker-compose exec nginx nginx -t

# Recargar configuración sin reiniciar
docker-compose exec nginx nginx -s reload
```

---

## 📊 Monitoreo

### Estado de Nginx

```bash
# Estadísticas de Nginx (requiere curl desde otro contenedor)
docker-compose exec nginx curl http://localhost/nginx_status
```

### Uso de recursos

```bash
# Ver uso de recursos de cada contenedor
docker stats
```

---

## 🔐 Consideraciones de Seguridad

> [!WARNING]
> Esta configuración está diseñada para **desarrollo y pruebas**. Para producción, considera:

1. **Cambiar todas las contraseñas** por unas seguras
2. **Restringir acceso a pgAdmin** solo a IPs específicas
3. **Configurar SSL/TLS** en Nginx para HTTPS
4. **Limitar el rango de IPs** en `pg_hba.conf`
5. **Usar Docker secrets** para credenciales sensibles
6. **Configurar backups** automáticos de la base de datos

---

## 📝 Notas Adicionales

- El **Primary DB** maneja todas las operaciones de escritura
- La **Replica DB** puede usarse para lecturas (read replicas) para escalar lecturas
- **Nginx** distribuye tráfico usando round-robin por defecto
- Los **datos persisten** en `primary_data/` y `replica_data/`
- La replicación es **asíncrona** por defecto
