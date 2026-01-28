const boom = require("@hapi/boom");

const { models } = require("../../LIBRARIES/db/sequelize");

class RolesServices {
  async findAll() {
    const allRoles = await models.Role.findAll();
    return allRoles;
  }

  async findOne(id) {
    const role = await models.Role.findByPk(id);
    if (!role) {
      throw boom.notFound("Role not found");
    }
    return role;
  }

  async findOneByRoleName(roleName) {
    const role = await models.Role.findOne({
      where: { name: roleName },
    });
    if (!role) {
      throw boom.notFound("Role not found");
    }
    return role;
  }

  async findOneWithRelations(id) {
    const role = await models.Role.findByPk(id, {
      include: ["users"],
    });
    if (!role) {
      throw boom.notFound("Role not found");
    }
    return role;
  }

  async create(data) {
    const newRole = await models.Role.create(data);
    return newRole;
  }

  async update(id, updatedData) {
    const role = await this.findOne(id);
    const rtaUpdateRole = await role.update(updatedData);
    return rtaUpdateRole;
  }

  async delete(id) {
    const role = await this.findOne(id);
    const rtaDeleteRole = await role.destroy();
    return rtaDeleteRole;
  }
}

module.exports = RolesServices;
