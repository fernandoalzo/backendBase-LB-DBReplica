const { Strategy } = require("passport-local");
const boom = require("@hapi/boom");
const bcrypt = require("bcryptjs");

const UsersService = require("../../SERVICES/users/users.services");
const logger = require("../../UTILS/logger");
const usersService = new UsersService();

const LocalStrategy = new Strategy(
  {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true, // Esta opción permite pasar toda la solicitud a la función de verificación
  },
  async (req, username, password, done) => {
    try {
      logger.info(`[local.strategy.js] 🔐 Login attempt for user: ${username}`);
      const user = await usersService.findOneByUsername(username);
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        logger.warn(`[local.strategy.js] ⚠️ Invalid password for user: ${username}`);
        return done(boom.unauthorized("Invalid username or password"), false);
      }
      if (!user.enabled) {
        logger.warn(`[local.strategy.js] ⚠️ Disabled user attempted login: ${username}`);
        done(boom.unauthorized("User Disabled"), false);
      }
      delete user.dataValues.password;
      logger.info(`[local.strategy.js] ✅ Successful login for user: ${username}`);
      done(null, user);
    } catch (error) {
      logger.error(`[local.strategy.js] ❌ Login error for user ${username}: ${error.message}`);
      done(error);
    }
  }
);

module.exports = LocalStrategy;

