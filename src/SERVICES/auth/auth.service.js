const jwt = require("jsonwebtoken");
const boom = require("@hapi/boom");
const { config } = require("../../CONFIG/config");
const logger = require("../../UTILS/logger");

class AuthService {
  async validateToken(token) {
    try {
      logger.debug("[auth.service.js] 🔍 Validating JWT token...");
      const tokenDecoded = jwt.verify(token, config.jwtSecret, {
        algorithm: "HS512",
      });
      logger.debug(`[auth.service.js] ✅ Token valid for user: ${tokenDecoded.sub}`);
      return {
        valid: true,
        expired: false,
        tokenDecoded,
      };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        logger.warn("[auth.service.js] ⚠️ Token expired");
        return {
          valid: false,
          expired: true,
          decoded: null,
        };
      }
      logger.warn(`[auth.service.js] ⚠️ Invalid token: ${error.message}`);
      return {
        valid: false,
        expired: false,
        decoded: null,
      };
    }
  }

  async generateJwtToken(user) {
    logger.debug(`[auth.service.js] 🔑 Generating JWT token for user: ${user.id}`);
    const payload = {
      sub: user.id,
      username: user.username,
      enabled: user.enabled,
      role: user.dataValues.role.dataValues.name,
      exp: Math.floor(Date.now() / 1000) + config.jwtExpiration * 60,
    };
    const token = jwt.sign(payload, config.jwtSecret, { algorithm: "HS512" });
    logger.info(`[auth.service.js] ✅ Token generated for user: ${user.username}`);
    return token;
  }
}

module.exports = AuthService;

