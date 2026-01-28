const { Model, DataTypes, Sequelize } = require("sequelize");

const USER_TABLE = "users";
const { ROLE_TABLE } = require("./../roles/role.model");

const UserModelSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  documentId: {
    allowNull: false,
    type: DataTypes.BIGINT,
    unique: true,
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  phone: {
    allowNull: false,
    type: DataTypes.BIGINT,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  address: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  enabled: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
  reputation: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  verified: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
  // relations
  roleId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ROLE_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
};

class User extends Model {
  static associate(models) {
    this.belongsTo(models.Role, {
      as: "role",
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: "User",
      timestamps: true,
    };
  }
}

module.exports = { USER_TABLE, UserModelSchema, User };
