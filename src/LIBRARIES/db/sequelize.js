const { Sequelize } = require("sequelize");

const { config } = require("../../CONFIG/config");
const setUpModels = require("./../../DATABASE/models/models");

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

    // Replication configuration: 
    // - WRITE operations go to PRIMARY host
    // - READ operations go to REPLICA host
    this.sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword, {
      dialect: "postgres",
      logging: true,
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

    setUpModels(this.sequelize);
    // 👇👇👇 DANGER: COMMENT OUT OR REMOVE THIS LINE IN PRODUCTION 👇👇👇
    this.sequelize.sync();
    // ☝️☝️☝️ DANGER: COMMENT OUT OR REMOVE THIS LINE IN PRODUCTION ☝️☝️☝️

    DatabaseSingleton.#instance = this;
  }

  static getInstance() {
    if (!DatabaseSingleton.#instance) {
      DatabaseSingleton.#instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.#instance.sequelize;
  }
}

module.exports = DatabaseSingleton.getInstance();
