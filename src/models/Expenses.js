const { DataTypes } = require("sequelize");
const sequelize = require("../database/Sequelize");
const Category = require("./Category");
const User = require("./User");

const Expenses = sequelize.define('Expenses', {
    idExpenses: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idCategory: {
        type: DataTypes.INTEGER,
        references: {
            model: "Category",
            key: "idCategory",
        },
    },
    idUser: {
        type: DataTypes.INTEGER,
        references: {
            model: "User",
            key: "idUser",
        },
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
    tableName: 'expenses',
  });

  Expenses.belongsTo(Category, { foreignKey: "idCategory" });
  Expenses.belongsTo(User, { foreignKey: "idUser" });

  module.exports = Expenses;