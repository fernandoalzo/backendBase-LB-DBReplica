const express = require("express");
const router = express.Router();
const passport = require("passport");

const validatorHandler = require("../../MIDDLEWARES/validators/validator.handler");
const { tokenSchema } = require("../../SCHEMAS/auth/token.schema");
const { logInSchema } = require("../../SCHEMAS/auth/logIn.schema");
const AuthService = require("../../SERVICES/auth/auth.service");
const service = new AuthService();

router.post(
  "/login",
  validatorHandler(logInSchema, "body"),
  passport.authenticate("local", { session: false }),
  // loginHandler
  async (req, res, next) => {
    try {
      const user = req.user;
      const token = await service.generateJwtToken(user);
      res.json({
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/validatetoken",
  validatorHandler(tokenSchema, "body"),
  async (req, res, next) => {
    try {
      const { token } = req.body;
      const rtaValidateTOken = await service.validateToken(token);
      res.json(rtaValidateTOken);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
