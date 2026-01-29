const { Sequelize } = require("sequelize");

const { config } = require("../../CONFIG/config");
const setUpModels = require("./../../DATABASE/models/models");
const logger = require("../../UTILS/logger");

// ☠️☠️☠️ WARNING ☠️☠️☠️
// Using sequelize.sync() in production with an existing database can cause:
// - Data loss when tables are dropped and recreated
// - Schema conflicts with existing tables
// - Accidental deletion of columns or indices
// - Performance issues during application startup
// 
// For production deployment with existing data:
// 1. ALWAYS backup your database before deployment
// 2. Consider using migrations instead of sync()
// 3. Set NODE_ENV=production in your environment variables
// ☠️☠️☠️ YOU HAVE BEEN WARNED ☠️☠️☠️

class DatabaseSingleton {
  static #instance;

  constructor() {
    if (DatabaseSingleton.#instance) {
      throw new Error("Ya existe una instancia de DatabaseSingleton");
    }

    logger.info("[sequelize.js] 🔌 Initializing database connection...");
    logger.info(`[sequelize.js] 📍 Primary (Write) Host: ${config.primaryDbHost}:${config.dbPort}`);
    logger.info(`[sequelize.js] 📍 Replica (Read) Host: ${config.replicaDbHost}:${config.dbPort}`);
    logger.info(`[sequelize.js] 📦 Database: ${config.dbName}`);

    // Replication configuration: 
    // - WRITE operations go to PRIMARY host
    // - READ operations go to REPLICA host
    this.sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
      dialect: "postgres",
      logging: (msg) => logger.debug(`[sequelize.js] 🗃️  SQL: ${msg}`),
      dialectOptions: {
        useUTC: false,
      },
      timezone: "America/Bogota",
      replication: {
        // Write operations (INSERT, UPDATE, DELETE) use the primary database
        write: {
          host: config.primaryDbHost,
          port: config.dbPort,
          username: config.dbUser,
          password: config.dbPassword,
        },
        // Read operations (SELECT) use the replica database
        read: [
          {
            host: config.replicaDbHost,
            port: config.dbPort,
            username: config.dbUser,
            password: config.dbPassword,
          },
        ],
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

    // Test database connection
    this.#testConnection();

    setUpModels(this.sequelize);
    logger.info("[sequelize.js] 📐 Database models initialized successfully");

    // 👇👇👇 DANGER: COMMENT OUT OR REMOVE THIS LINE IN PRODUCTION 👇👇👇
    this.sequelize.sync()
      .then(() => logger.info("[sequelize.js] ✅ Database synchronized successfully"))
      .catch((err) => logger.error("[sequelize.js] ❌ Database sync failed:", err));
    // ☝️☝️☝️ DANGER: COMMENT OUT OR REMOVE THIS LINE IN PRODUCTION ☝️☝️☝️

    DatabaseSingleton.#instance = this;
  }

  async #testConnection() {
    try {
      await this.sequelize.authenticate();
      logger.info("[sequelize.js] ✅ Database connection established successfully");
    } catch (error) {
      logger.error("[sequelize.js] ❌ Unable to connect to the database:", error.message);
      throw error;
    }
  }

  static getInstance() {
    if (!DatabaseSingleton.#instance) {
      DatabaseSingleton.#instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.#instance.sequelize;
  }
}

module.exports = DatabaseSingleton.getInstance();
