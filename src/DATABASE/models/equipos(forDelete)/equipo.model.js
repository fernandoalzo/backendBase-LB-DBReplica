const { Model, DataTypes } = require("sequelize");

const EQUIPO_TABLE = "equipo";

const equipoModelSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    serial: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    estado: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    placa: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    centro: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    categoria: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    descripcion: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    marca: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    modelo: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    clasificacionRie: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    registroSanitario: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    notas: {
        allowNull: false,
        type: DataTypes.STRING,
    }
};

class Equipo extends Model {
    static associate(models) {
        this.hasMany(models.Evidencia, {
            as: "evidencias",
            foreignKey: "equipoId",
        });
        this.belongsToMany(models.Traslado, {
            as: 'traslados',
            through: 'traslado_equipo',
            foreignKey: 'equipoId',
            otherKey: 'trasladoId'
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: EQUIPO_TABLE,
            modelName: "Equipo",
            timestamps: true,
        };
    }
}

module.exports = { EQUIPO_TABLE, equipoModelSchema, Equipo };
