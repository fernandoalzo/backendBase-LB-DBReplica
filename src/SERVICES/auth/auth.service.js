const jwt = require("jsonwebtoken");
const boom = require("@hapi/boom");
const { config } = require("../../CONFIG/config");

class AuthService {
  async validateToken(token) {
    try {
      const tokenDecoded = jwt.verify(token, config.jwtSecret, {
        algorithm: "HS512",
      });
      return {
        valid: true,
        expired: false,
        tokenDecoded,
      };
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return {
          valid: false,
          expired: true,
          decoded: null,
        };
      }
      return {
        valid: false,
        expired: false,
        decoded: null,
      };
    }
  }

  async generateJwtToken(user) {
    const payload = {
      sub: user.id,
      username: user.username,
      enabled: user.enabled,
      role: user.dataValues.role.dataValues.name,
      exp: Math.floor(Date.now() / 1000) + config.jwtExpiration * 60,
    };
    return jwt.sign(payload, config.jwtSecret, { algorithm: "HS512" });
  }
}

module.exports = AuthService;
