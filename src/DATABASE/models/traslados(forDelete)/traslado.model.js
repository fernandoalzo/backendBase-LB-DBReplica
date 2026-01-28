const { Model, DataTypes } = require("sequelize");

const TRASLADO_TABLE = "traslados";

const trasladoModelSchema = {
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
    area: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    empresa: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    fechaMovimiento: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    fechaDevolucion: {
        allowNull: false,
        type: DataTypes.STRING,
    }
};

class Traslado extends Model {
    static associate(models) {
        this.belongsToMany(models.Equipo, {
            as: 'equipos',
            through: 'traslado_equipo',
            foreignKey: 'trasladoId',
            otherKey: 'equipoId'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TRASLADO_TABLE,
            modelName: "Traslado",
            timestamps: true,
        };
    }
}

module.exports = { TRASLADO_TABLE, trasladoModelSchema, Traslado };