const boom = require("@hapi/boom");
const bcrypt = require("bcryptjs");

const { models } = require("../../LIBRARIES/db/sequelize");
const RolesServices = require("../roles/roles.services");
const logger = require("../../UTILS/logger");
const rolesServices = new RolesServices();

class UsersServices {
  async usersInfo() {
    logger.debug("[users.services.js] 📊 Fetching users info...");
    const users = await models.User.findAll();
    const numUsers = users.length;
    logger.debug(`[users.services.js] 📊 Total users: ${numUsers}`);
    return {
      totalUsers: numUsers,
    };
  }

  async findAll() {
    logger.debug("[users.services.js] 📋 Fetching all users...");
    const allUsers = await models.User.findAll({
      include: [
        {
          model: models.Role,
          as: "role",
          attributes: ["name"],
        },
      ],
    });
    logger.debug(`[users.services.js] 📋 Found ${allUsers.length} users`);
    return allUsers;
  }

  async findOne(id) {
    logger.debug(`[users.services.js] 🔍 Finding user by ID: ${id}`);
    const user = await models.User.findByPk(id, {
      include: ["role"],
    });
    if (!user) {
      logger.warn(`[users.services.js] ⚠️ User not found: ${id}`);
      throw boom.notFound("User not found");
    }
    return user;
  }

  async findOneByUsername(username) {
    logger.debug(`[users.services.js] 🔍 Finding user by username: ${username}`);
    const user = await models.User.findOne({
      where: { username },
      include: ["role"],
    });
    if (!user) {
      logger.warn(`[users.services.js] ⚠️ User not found: ${username}`);
      throw boom.notFound("User not found");
    }
    return user;
  }

  async create(data) {
    logger.info(`[users.services.js] ➕ Creating new user: ${data.username}`);
    const role = await rolesServices.findOne(data.roleId);
    const passwordHash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: passwordHash,
    });
    logger.info(`[users.services.js] ✅ User created successfully: ${newUser.id}`);
    return newUser;
  }

  async update(id, updatedData) {
    logger.info(`[users.services.js] ✏️ Updating user: ${id}`);
    const user = await this.findOne(id);
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }
    const rtaUpdateUser = await user.update(updatedData);
    logger.info(`[users.services.js] ✅ User updated successfully: ${id}`);
    return rtaUpdateUser;
  }

  async delete(id) {
    logger.info(`[users.services.js] 🗑️ Deleting user: ${id}`);
    const user = await this.findOne(id);
    const rtaDeleteUser = await user.destroy();
    logger.info(`[users.services.js] ✅ User deleted successfully: ${id}`);
    return {
      msg: "User deleted",
    };
  }
}

module.exports = UsersServices;

