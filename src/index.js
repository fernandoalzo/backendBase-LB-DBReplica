const express = require("express");
const routerAPI = require("./routes/routes");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");
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

const app = express();
const port = config.port;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { msg: "Request limit reached!" },
});
const options = {
  origin: "*",
};
app.use(express.json());
app.use(limiter);
app.use(cors(options));
require("./AUTH");
setupApiDocumentation(app);

routerAPI(app);

app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(filesUploadsError);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Aplicacion Activa. Puerto: " + port);
  console.log(`API Documentation available at:`);
  console.log(`- Home: http://localhost:${config.port}/api-docs`);
});
