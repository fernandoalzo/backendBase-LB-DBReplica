# 🚀 Deploying to Railway

This guide explains how to deploy the Load Balanced Application + Database Replication setup to **Railway.app**.

## 📋 Prerequisites

1.  A [Railway](https://railway.app/) account.
2.  Your project pushed to GitHub.
3.  The [Railway CLI](https://docs.railway.app/guides/cli) (optional, but helpful).

## 🛠 Deployment Steps

1.  **Create a New Project on Railway**
    - Go to your Railway Dashboard.
    - Click **"New Project"** -> **"Deploy from GitHub repo"**.
    - Select your repository.

2.  **Configure the Service**
    - Railway might try to auto-detect the setup. If it doesn't default to Docker Compose or picks the wrong file:
    - Go to **Settings** > **Service** > **Watch Paths** (or standard "General" settings for the repo).
    - **CRITICAL**: Railway searches for `docker-compose.yml` by root. Since our file is nested, we need to point it to the correct path.
    - **Actually**, the easiest way for nested compose files is to use the Railway CLI or "Monorepo" settings. 
    - **Recommended**: In Railway settings for the service, set the **Root Directory** to `/`. 
    - Railway checks for `docker-compose.yml`. Since we created a specialized file `Docker/appWithLBDBWithReplica/docker-compose.railway.yml`, you should tell Railway to use this file.
    - *Note*: As of late 2024, Railway supports setting a custom Docker Compose file path in the Service Settings under **"Source"** -> **"Docker Compose File"**, or you can rename/move it.
    - **Alternative**: You can use the `railway up` command pointing to the file, but for GitOps:
        1.  In Railway, go to **Settings**.
        2.  Find **"Docker Compose File"** (if available) or **"Build"** settings.
        3.  Enter: `Docker/appWithLBDBWithReplica/docker-compose.railway.yml`.

3.  **Environment Variables**
    - Go to the **Variables** tab.
    - Add the variables defined in your `.env` file. You can bulk import them.
    - **Required Variables**:
        - `DB_NAME`
        - `DB_USER`
        - `DB_PASSWORD`
        - `DB_REPLICA_PASSWORD`
        - `JWT_SECRET`
        - `JWT_EXPIRES_MINUTES`
        - `API_KEY`
        - `ADMIN_NAME`, `DOCUMENT_ID`, `EMAIL`, etc. (all user admin Configs)
        - `DB_PRIMARY_CONTAINER_NAME` (e.g., `postgres_primary`)
        - `DB_REPLICA_CONTAINER_NAME` (e.g., `postgres_replica`)
        - `APP1_CONTAINER_NAME` (e.g., `app1`)
        - `APP2_CONTAINER_NAME` (e.g., `app2`)
        - `NGINX_CONTAINER_NAME` (e.g., `nginx`)
        - `DOCKER_SUBNET` (e.g., `172.18.0.0/16` - though Railway mostly ignores this for internal networking, it's safer to provide it).

4.  **Networking & Ports**
    - Railway will expose one port publicly.
    - We want the **Nginx** container to be the public entry point.
    - Ensure the `nginx` service is the one exposed on port `80` (mapped to Railway's dynamic port).

## 📁 Storage (Volumes)

The `docker-compose.railway.yml` is configured to use **Named Volumes** (`primary_data`, `replica_data`) instead of local paths. This ensures:
- Database data persists across deployments (within the same service lifespan/volume).
- **Pro Tip**: For production data, consider using Railway's managed PostgreSQL plugin instead of running it in a container, as it offers better backups and high availability features.

## 🔄 Updates

- Pushing to the `main` branch (or your configured branch) will trigger a redeploy.
- Railway will rebuild the images using the helper Dockerfiles (`Dockerfile.postgres_primary`, etc.) ensuring your config scripts (`initdb`, `nginx.conf`) are always up to date.
