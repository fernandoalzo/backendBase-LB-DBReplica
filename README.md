# 🚀 Backend Base With Uploader

A robust Node.js backend application with file upload capabilities, PostgreSQL database integration, and authentication, fully dockerized for easy deployment.

## ✨ Features

- 🔐 JWT Authentication & Authorization
- 📁 File Upload System
- 🗄️ PostgreSQL Database with Sequelize ORM
- 📝 API Documentation with Swagger
- 🐋 Fully Dockerized deployment
- 🔄 Easy migrations with Sequelize CLI

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://www.docker.com/) (v20.10 or later)
- [Docker Compose](https://docs.docker.com/compose/) (v2.0 or later)

## 🚀 Docker Installation (Recommended)

This application is fully dockerized, making deployment quick and straightforward.

1. **Clone the repository**
   ```bash
   git clone https://github.com/fernandoalzo/BackendBaseWithUploader.git
   cd BackendBaseWithUploader
   ```

2. **Start all services with Docker Compose**
   ```bash
   cd Docker
   docker-compose <.env file path> up -d
   ```

   This single command will set up:
   - PostgreSQL database container
   - pgAdmin container (for database management)
   - Node.js application container

3. **Access your services**
   - 🌐 Backend API: http://localhost:3000
   - 📊 pgAdmin: http://localhost:5050
     - Login with: `root@mail.com` / `12345`
   - 📚 Swagger API docs: http://localhost:3000/api-docs/

4. **Run database migrations (if needed)**
   ```bash
   docker exec -it credit_community_app npm run migrations:run
   ```

## 🔍 Docker Service Details

The application consists of three main Docker services:

| Service   | Description                | Port      | Container Name           |
|-----------|----------------------------|-----------|--------------------------|
| app       | Node.js backend service    | 3000      | credit_community_app     |
| postgres  | PostgreSQL database server | 5432      | backend_base_db          |
| pgadmin   | Database management tool   | 5050      | backend_base_pgadmin     |

## 🛠️ Docker Commands

```bash
# Start all services
docker-compose <.env file path> up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Rebuild and restart services
docker-compose up -d --build

# Run a command inside the app container
docker exec -it credit_community_app <command>
```

## 🔧 Environment Variables

All environment variables are preconfigured in the `.env` file. Key Docker-related variables include:

- `DOCKER_SUBNET`: Docker network subnet configuration
- `DOCKER_GATEWAY`: Docker network gateway
- `DB_STATIC_IP`: Static IP for database container
- `PGADMIN_STATIC_IP`: Static IP for pgAdmin container
- `APP_STATIC_IP`: Static IP for application container
- `DB_CONTAINER_NAME`: Name of the database container
- `DB_USER`: Database username (default: root)
- `DB_PASSWORD`: Database password (default: 12345)
- `DB_HOST`: Database host (points to the database container)
- `DB_NAME`: Database name

## 📁 File Upload

The application includes a file upload system that stores files in the `/uploads` directory, which is mounted as a Docker volume.

## 📝 License

This project is licensed under the ISC License.

---

�� Happy Coding! 💻 