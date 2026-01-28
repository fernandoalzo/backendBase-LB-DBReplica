const { Model, DataTypes } = require("sequelize");

const EVIDENCIA_TABLE = "evidencia";

const evidenciaModelSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    tipo: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    nombre: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    equipoId: {
        field: 'equipoId',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'equipo',
            key: 'id'
        }
    }
};

class Evidencia extends Model {
    static associate(models) {
        this.belongsTo(models.Equipo, {
            as: "equipo",
            foreignKey: "equipoId",
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: EVIDENCIA_TABLE,
            modelName: "Evidencia",
            timestamps: true,
        };
    }
}

module.exports = { EVIDENCIA_TABLE, evidenciaModelSchema, Evidencia };
