const { config } = require("../../CONFIG/config");
const RolesServices = require("../roles/roles.services");
const rolesServices = new RolesServices();
const UsersServices = require("../users/users.services");
const usersServices = new UsersServices();

class SetUpServices {
  async InitialSetUp() {
    const userRoles = config.userRoles;
    await Promise.all(
      Object.entries(userRoles).map(async ([key, value]) => {
        await rolesServices.create({
          name: value,
        });
      })
    );
    const role = await rolesServices.findOneByRoleName(config.userRoles.role1);

    const userAdmin = { ...config.userAdmin, roleId: role.dataValues.id };
    const rtaCreateUser = await usersServices.create(userAdmin);
    return { msg: "Initial setup completed", user: rtaCreateUser };
  }
}

module.exports = SetUpServices;
