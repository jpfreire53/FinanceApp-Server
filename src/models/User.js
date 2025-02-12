const { DataTypes } = require("sequelize");
const sequelize = require("../database/Sequelize");

const User = sequelize.define(
    "User",
    {
        idUser: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        firstTime: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
		}
    },
    {
        tableName: "user"
    }
)

module.exports = User;