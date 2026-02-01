const express = require("express");
const routerAPI = require("./ROUTES/routes");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
const compression = require("compression");
const {
  filesUploadsError,
} = require("./MIDDLEWARES/uploads/filesUploadsError.handler");

const {
  ormErrorHandler,
  errorHandler,
  boomErrorHandler,
} = require("./MIDDLEWARES/errors/error.handler");

const { setupApiDocumentation } = require("./DOCUMENTATION/index");
const { config } = require("./CONFIG/config");
const logger = require("./UTILS/logger");

const app = express();
// ✅ *** CORRECCIÓN IMPORTANTE ***
// Express por defecto NO confía en proxies reversos (como Railway, Nginx o Heroku).
// Esto causa que 'express-rate-limit' no pueda obtener la IP real del cliente
// y arroje el error 'X-Forwarded-For' que vimos en los logs.
// Al habilitar 'trust proxy', Express tomará correctamente la IP original.
app.set('trust proxy', true);
const port = config.port;
// Compression
app.use(compression({
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));
// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Request limit reached!" },
});
// CORS
const options = {
  origin: "*",
};

logger.info("[index.js] 🚀 Initializing Express application...");
app.use(express.json());
logger.debug("[index.js] ✅ JSON body parser configured");
app.use(limiter);
logger.debug("[index.js] ✅ Rate limiter configured (500 req/15min)");
app.use(cors(options));
logger.debug("[index.js] ✅ CORS configured");
require("./AUTH");
logger.debug("[index.js] ✅ Authentication strategies loaded");
setupApiDocumentation(app);
logger.debug("[index.js] ✅ API documentation configured");

routerAPI(app);
logger.debug("[index.js] ✅ API routes configured");

app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(filesUploadsError);
app.use(errorHandler);
logger.debug("[index.js] ✅ Error handlers configured");

app.listen(port, () => {
  logger.info("[index.js] ✅ Server started successfully");
  logger.info(`[index.js] 🌐 Server listening on port: ${port}`);
  logger.info(`[index.js] 📚 API Documentation: http://localhost:${port}/api-docs`);
});

