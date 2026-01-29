const boom = require("@hapi/boom");
const logger = require("../../UTILS/logger");

function checkRole(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      next();
    } else {
      logger.warn(`[checkRole.handler.js] ⚠️ Unauthorized role access attempt by user: ${user.sub}, role: ${user.role}, required: [${roles.join(", ")}]`);
      next(
        boom.unauthorized(
          "User Role is not allowed for this action, your role is: " + user.role
        )
      );
    }
  };
}

module.exports = { checkRole };

