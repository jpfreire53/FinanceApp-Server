const { DataTypes } = require("sequelize");
const sequelize = require("../database/Sequelize");
const User = require("./User");

const Goals = sequelize.define('Goals', {
    idGoals: {
        type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
    },
    idUser: {
        type: DataTypes.INTEGER,
        references: {
            model: "User",
            key: "idUser",
        },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    targetValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'goals',
  });

  Goals.belongsTo(User, { foreignKey: "idUser" });

  module.exports = Goals;