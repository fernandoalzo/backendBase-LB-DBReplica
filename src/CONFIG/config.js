require("dotenv").config();

const config = {
  // database config
  port: process.env.PORT,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  primaryDbHost: process.env.PRIMARY_DB_HOST,
  replicaDbHost: process.env.REPLICA_DB_HOST,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,

  // app config
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRES_MINUTES,

  userRoles: {
    // Admin
    role1: process.env.ROLE1,
    // User
    role2: process.env.ROLE2,
  },
  userStatus: {
    // activo
    status1: true,
    // Bloqueado
    status2: false,
  },
  userAdmin: {
    username: process.env.ADMIN_NAME,
    documentId: process.env.DOCUMENT_ID,
    email: process.env.EMAIL,
    phone: process.env.PHONE,
    address: process.env.ADDRESS,
    password: process.env.PASSWORD,
    enabled: process.env.ENABLED,
    reputation: process.env.REPUTATION,
    verified: process.env.VERIFIED,
  },
  uploadsPath: "uploads",
  allowedFilesToUpload: ["png", "jpg", "jpeg", "pdf", ".doc", ".docx", ".xls", ".xlsx"],
  fileSizeMB: 5,
};

module.exports = { config };
