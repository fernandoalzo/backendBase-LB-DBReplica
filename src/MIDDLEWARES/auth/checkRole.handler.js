const boom = require("@hapi/boom");

function checkRole(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (roles.includes(user.role)) {
      next();
    } else {
      next(
        boom.unauthorized(
          "User Role is not allowed for this action, your role is: " + user.role
        )
      );
    }
  };
}

module.exports = { checkRole };
