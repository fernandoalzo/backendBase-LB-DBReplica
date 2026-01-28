const { Strategy } = require("passport-local");
const boom = require("@hapi/boom");
const bcrypt = require("bcryptjs");

const UsersService = require("../../SERVICES/users/users.services");
const usersService = new UsersService();

const LocalStrategy = new Strategy(
  {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true, // Esta opción permite pasar toda la solicitud a la función de verificación
  },
  async (req, username, password, done) => {
    try {
      const user = await usersService.findOneByUsername(username);
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return done(boom.unauthorized("Invalid username or password"), false);
      }
      if (!user.enabled) {
        done(boom.unauthorized("User Disabled"), false);
      }
      delete user.dataValues.password;
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

module.exports = LocalStrategy;
