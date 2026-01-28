const express = require("express");

const usersRouter = require("./users/users.router");
const authRouter = require("./auth/auth.router");
const rolesRouter = require("./roles/roles.routes");
const setUpRouter = require("./setUp/setUp.routes");
const uploadsRouter = require("./uploads/upload.routes");


function routerApi(app) {
  const router = express.Router();
  app.use("/api/v1", router);
  router.use("/users", usersRouter);
  router.use("/auth", authRouter);
  router.use("/roles", rolesRouter);
  router.use("/setup", setUpRouter);
  router.use("/uploads", uploadsRouter);
}

module.exports = routerApi;
