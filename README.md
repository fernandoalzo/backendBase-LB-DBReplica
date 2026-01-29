# 🚀 Backend de Alta Disponibilidad (LB + Réplica de BD)

Una arquitectura backend en Node.js de alta disponibilidad lista para producción. Este proyecto cuenta con un clúster de aplicaciones con balanceo de carga y una base de datos PostgreSQL con replicación Primaria-Réplica, garantizando tanto la escalabilidad como la redundancia de datos.

## 🏗️ Arquitectura del Sistema

![Arquitectura de Alta Disponibilidad](docs/architecture.png)

<details>
<summary>📐 Ver Diagrama Técnico Mermaid</summary>

```mermaid
graph TD
    %% Node Definitions
    User(("👤 Usuario"))
    LB[["⚖️ Balanceador de Carga Nginx"]]
    
    subgraph cluster_app ["🚀 Capa de Aplicación (Alta Disponibilidad)"]
        style cluster_app fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,stroke-dasharray: 5 5
        App1["📦 Instancia Node.js 1"]
        App2["📦 Instancia Node.js 2"]
    end

    subgraph cluster_db ["🗄️ Capa de Persistencia (Replicada)"]
        style cluster_db fill:#fff7ed,stroke:#ea580c,stroke-width:2px,stroke-dasharray: 5 5
        DB_P[("🔥 DB Primaria (Escritura)")]
        DB_R[("❄️ DB Réplica (Lectura)")]
        PGA[["📊 pgAdmin 4"]]
    end

    %% Connections
    User -->|HTTPS| LB
    LB -->|Round Robin| App1
    LB -->|Round Robin| App2

    App1 ==>|Escr. (Write)| DB_P
    App2 ==>|Escr. (Write)| DB_P
    
    App1 -.->|Lect. (Read)| DB_R
    App2 -.->|Lect. (Read)| DB_R

    DB_P -- "Streaming Asíncrono" --> DB_R
    DB_P --- PGA

    %% Styling
    classDef default font-family:Inter,font-size:14px;
    classDef lb fill:#eff6ff,stroke:#2563eb,stroke-width:2px;
    classDef app fill:#f0fdf4,stroke:#16a34a,stroke-width:2px;
    classDef db fill:#fffbeb,stroke:#d97706,stroke-width:2px;
    classDef user fill:#faf5ff,stroke:#7c3aed,stroke-width:2px;

    class LB lb;
    class App1,App2 app;
    class DB_P,DB_R db;
    class User user;
```
</details>

## ✨ Características

- ⚖️ **Balanceo de Carga**: Nginx distribuye el tráfico entre múltiples instancias de la aplicación mediante Round-Robin.
- 🚀 **Escalabilidad Horizontal**: Escala fácilmente las instancias de la aplicación para manejar mayores cargas de trabajo.
- 💾 **Replicación de BD**: Configuración PostgreSQL Primaria-Réplica. 
    - **Escrituras**: Dirigidas exclusivamente a la instancia Primaria.
    - **Lecturas**: Balanceadas hacia la instancia Réplica para optimizar el rendimiento.
- 🔐 **Autenticación JWT**: Seguridad robusta basada en tokens con passport-jwt.
- 📁 **Gestión de Archivos**: Sistema de carga basado en multer con persistencia en volúmenes Docker.
- 📝 **Documentación API**: Swagger UI integrado para pruebas y referencia técnica.
- 🐋 **Totalmente Dockerizado**: Despliegue automatizado y reproducible con Docker Compose.

## 🛠️ Prerrequisitos

- [Docker](https://www.docker.com/) (v20.10 o posterior)
- [Docker Compose](https://docs.docker.com/compose/) (v2.0 o posterior)
- Archivo `.env` configurado (ver [Variables de Entorno](#-variables-de-entorno))

## 🚀 Inicio Rápido (Modo Producción/HA)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/fernandoalzo/backendBase-LB-DBReplica.git
   cd backendBase-LB-DBReplica
   ```

2. **Desplegar la Infraestructura HA**
   ```bash
   cd Docker/appWithLBDBWithReplica
   docker-compose --env-file <ruta al archivo .env> up -d
   ```

3. **Acceso a los Servicios**
   - 🌐 **API Pública (vía LB)**: http://localhost:3000
   - 📚 **Documentación Swagger**: http://localhost:3000/api-docs
   - 📊 **pgAdmin**: http://localhost:5050
   - 🏥 **Health Check del LB**: http://localhost:3000/health

## 🔍 Inventario de Servicios

| Servicio | Rol | Puerto (Ext/Int) |
| :--- | :--- | :--- |
| **nginx** | Balanceador de Carga | 3000 / 80 |
| **app1** | Instancia de App 1 | Expuesto / 3000 |
| **app2** | Instancia de App 2 | Expuesto / 3000 |
| **postgres_primary** | BD Primaria (Escritura) | 5432 / 5432 |
| **postgres_replica** | BD Réplica (Lectura) | 5433 / 5432 |
| **pgadmin** | Gestión de BD | 5050 / 80 |

## 🛠️ Comandos Útiles

```bash
# Ver logs del Balanceador de Carga
docker-compose logs -f nginx

# Ver logs de las aplicaciones (combinados)
docker-compose logs -f app1 app2

# Verificar estado de replicación (en la Primaria)
docker exec -it credit_community_db_primary gosu postgres psql -c "select * from pg_stat_replication;"

# Ejecutar Migraciones
docker exec -it credit_community_app_1 npm run migrations:run
```

## 🔧 Variables de Entorno

La infraestructura HA depende de estas variables clave en tu archivo `.env`:

| Variable | Descripción |
| :--- | :--- |
| `PRIMARY_DB_HOST` | Host de la base de datos primaria (ej. `postgres_primary`) |
| `REPLICA_DB_HOST` | Host de la base de datos réplica (ej. `postgres_replica`) |
| `DB_PORT` | Puerto de conexión para ambas DBs (defecto: 5432) |
| `DOCKER_SUBNET` | Subred de red para el proyecto Docker |
| `JWT_SECRET` | Clave secreta para la firma de tokens JWT |

## 📁 Persistencia de Archivos

Los archivos se almacenan en el directorio `/uploads` en la raíz del proyecto. En la configuración HA, este directorio se comparte entre todas las instancias de la aplicación mediante volúmenes Docker para garantizar la consistencia.

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

---
🚀 **Diseñado para Alto Rendimiento y Fiabilidad** 🚀
�