const { DataTypes } = require("sequelize");
const sequelize = require("../database/Sequelize");

const Revenues = sequelize.define(`Revenues`, {
    idRevenues: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idUser : {
        type: DataTypes.INTEGER,
        references: {
            model: `User`,
            key: `idUser`
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: `Revenues`
});

module.exports = Revenues;