const express = require("express");
const router = express.Router();
const passport = require("passport");

const UsersServices = require("../../SERVICES/users/users.services");
const service = new UsersServices();
const validatorHandler = require("../../MIDDLEWARES/validators/validator.handler");
const {
  createClientSchema,
  updateClientSchema,
  userIdSchema,
} = require("../../SCHEMAS/users/users.schema");
const { checkRole } = require("../../MIDDLEWARES/auth/checkRole.handler");
const { config } = require("../../CONFIG/config");

router.get(
  "/usersinfo",
  passport.authenticate("jwt", { session: false }),
  checkRole(config.userRoles.role1, config.userRoles.role2),
  async (req, res, next) => {
    try {
      const rtaTest = await service.usersInfo();
      res.status(200).json(rtaTest);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/findall",
  passport.authenticate("jwt", { session: false }),
  checkRole(config.userRoles.role1, config.userRoles.role2),
  async (req, res, next) => {
    try {
      const rtaTest = await service.findAll();
      res.status(200).json(rtaTest);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/findone/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole(config.userRoles.role1, config.userRoles.role2),
  validatorHandler(userIdSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const rtaTest = await service.findOne(parseInt(id));
      res.status(200).json(rtaTest);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  checkRole(config.userRoles.role1),
  validatorHandler(createClientSchema, "body"),
  async (req, res, next) => {
    try {
      const data = req.body;
      const rtaTest = await service.create(data);
      res.status(200).json(rtaTest);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole(config.userRoles.role1, config.userRoles.role2),
  validatorHandler(userIdSchema, "params"),
  validatorHandler(updateClientSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const rtaTest = await service.update(parseInt(id), updatedData);
      res.status(200).json(rtaTest);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  checkRole(config.userRoles.role1),
  validatorHandler(userIdSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const rtaTest = await service.delete(parseInt(id));
      res.status(200).json(rtaTest);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
