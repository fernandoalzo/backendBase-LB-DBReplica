# 🚀 High Availability Backend Base (LB + DB Replica)

A production-ready, highly available Node.js backend architecture. This project features a Load Balanced application cluster and a PostgreSQL Database with Primary-Replica replication, ensuring both scalability and data redundancy.

## 🏗️ System Architecture

This project implements a robust High Availability (HA) stack:

```mermaid
graph TD
    User((User)) --> LB[Nginx Load Balancer]
    subgraph "App Cluster"
        LB --> App1[Express App Instance 1]
        LB --> App2[Express App Instance 2]
    end
    subgraph "Database Cluster"
        App1 -- "Writes (Primary)" --> DB_P[(PostgreSQL Primary)]
        App2 -- "Writes (Primary)" --> DB_P
        App1 -- "Reads (Replica)" --> DB_R[(PostgreSQL Replica)]
        App2 -- "Reads (Replica)" --> DB_R
        DB_P -- "Streaming Replication" --> DB_R
    end
    DB_P --> pgAdmin[pgAdmin 4]
```

## ✨ Features

- ⚖️ **Load Balancing**: Nginx distributes traffic across multiple application instances via Round-Robin.
- 🚀 **Horizontal Scalability**: Easily scale application instances to handle higher loads.
- 💾 **DB Replication**: PostgreSQL Primary-Replica setup. 
    - **Writes**: Directed to the Primary instance.
    - **Reads**: Load-balanced to the Replica instance to reduce primary load.
- 🔐 **JWT Authentication**: Secure token-based auth with passport-jwt.
- 📁 **File Upload System**: Integrated multer-based uploader with volume persistence.
- 📝 **API Documentation**: Live Swagger documentation.
- 🐋 **Fully Dockerized**: Completely automated deployment with Docker Compose.

## 🛠️ Prerequisites

- [Docker](https://www.docker.com/) (v20.10 or later)
- [Docker Compose](https://docs.docker.com/compose/) (v2.0 or later)
- `.env` file with required configuration (see [Environment Variables](#-environment-variables))

## 🚀 Quick Start (Production/HA Mode)

1. **Clone the repository**
   ```bash
   git clone https://github.com/fernandoalzo/backendBase-LB-DBReplica.git
   cd backendBase-LB-DBReplica
   ```

2. **Deploy the HA Stack**
   ```bash
   cd Docker/appWithLBDBWithReplica
   docker-compose up -d --build
   ```

3. **Access Services**
   - 🌐 **Public API (via LB)**: http://localhost:3000
   - � **Swagger Docs**: http://localhost:3000/api-docs
   - � **pgAdmin**: http://localhost:5050
   - 🏥 **LB Health Check**: http://localhost:3000/health

## 🔍 Service Inventory

| Service | Role | Port (Ext/Int) |
| :--- | :--- | :--- |
| **nginx** | Load Balancer | 3000 / 80 |
| **app1** | App Instance 1 | Exposed / 3000 |
| **app2** | App Instance 2 | Exposed / 3000 |
| **postgres_primary** | Primary DB (Writes) | 5432 / 5432 |
| **postgres_replica** | Replica DB (Reads) | 5433 / 5432 |
| **pgadmin** | DB Management | 5050 / 80 |

## 🛠️ Useful Commands

```bash
# View Load Balancer logs
docker-compose logs -f nginx

# View App logs (combined)
docker-compose logs -f app1 app2

# Check DB Replication Status (on Primary)
docker exec -it credit_community_db_primary gosu postgres psql -c "select * from pg_stat_replication;"

# Run Migrations
docker exec -it credit_community_app_1 npm run migrations:run
```

## 🔧 Environment Variables

The HA setup relies on these key variables in your `.env`:

| Variable | Description |
| :--- | :--- |
| `PRIMARY_DB_HOST` | Hostname of the primary DB (e.g., `postgres_primary`) |
| `REPLICA_DB_HOST` | Hostname of the replica DB (e.g., `postgres_replica`) |
| `DB_PORT` | Port for both DBs (default: 5432) |
| `DOCKER_SUBNET` | Network subnet for the project |
| `JWT_SECRET` | Secret key for token signing |

## 📁 File Persistence

Files are stored in the `/uploads` directory at the project root. In the HA setup, this directory is shared across all app instances as a Docker volume to ensure consistency.

## 📝 License

This project is licensed under the ISC License.

---
🚀 **Built for Performance & Reliability** �