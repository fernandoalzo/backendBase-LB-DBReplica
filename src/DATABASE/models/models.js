const { User, UserModelSchema } = require("./users/user.model");
const { Role, RoleModelSchema } = require("./roles/role.model");

function setUpModels(sequelize) {
  User.init(UserModelSchema, User.config(sequelize));
  Role.init(RoleModelSchema, Role.config(sequelize));

  Role.associate(sequelize.models);
  User.associate(sequelize.models);
}

module.exports = setUpModels;
