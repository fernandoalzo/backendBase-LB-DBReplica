const express = require("express");
const router = express.Router();
const passport = require("passport");

const RolesServices = require("../../SERVICES/roles/roles.services");
const service = new RolesServices();
const validatorHandler = require("../../MIDDLEWARES/validators/validator.handler");
const {
  roleIdSchema,
  createRoleSchema,
  updateRoleSchema,
} = require("../../SCHEMAS/roles/roles.schema");
const { checkRole } = require("../../MIDDLEWARES/auth/checkRole.handler");
const { config } = require("../../CONFIG/config");

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
  validatorHandler(roleIdSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const rtaTest = await service.findOneWithRelations(parseInt(id));
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
  validatorHandler(createRoleSchema, "body"),
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
  validatorHandler(roleIdSchema, "params"),
  validatorHandler(updateRoleSchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const rtaTest = await service.update(parseInt(id), data);
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
  validatorHandler(roleIdSchema, "params"),
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
