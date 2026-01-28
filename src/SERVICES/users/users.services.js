const boom = require("@hapi/boom");
const bcrypt = require("bcryptjs");

const { models } = require("../../LIBRARIES/db/sequelize");
const RolesServices = require("../roles/roles.services");
const rolesServices = new RolesServices();
class UsersServices {
  async usersInfo() {
    const users = await models.User.findAll();
    const numUsers = users.length;
    return {
      totalUsers: numUsers,
    };
  }

  async findAll() {
    const allUsers = await models.User.findAll({
      include: [
        {
          model: models.Role,
          as: "role",
          attributes: ["name"],
        },
      ],
    });
    return allUsers;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id, {
      include: ["role"],
    });
    if (!user) {
      throw boom.notFound("User not found");
    }
    return user;
  }

  async findOneByUsername(username) {
    const user = await models.User.findOne({
      where: { username },
      include: ["role"],
    });
    if (!user) {
      throw boom.notFound("User not found");
    }
    return user;
  }

  async create(data) {
    const role = await rolesServices.findOne(data.roleId);
    const passwordHash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: passwordHash,
    });
    return newUser;
  }

  async update(id, updatedData) {
    const user = await this.findOne(id);
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }
    const rtaUpdateUser = await user.update(updatedData);
    return rtaUpdateUser;
  }

  async delete(id) {
    const user = await this.findOne(id);
    const rtaDeleteUser = await user.destroy();
    return {
      msg: "User deleted",
    };
  }
}

module.exports = UsersServices;
