const { DataTypes } = require("sequelize");
const sequelize = require("../database/Sequelize");
const User = require("./User");

const Category = sequelize.define(
    'Category', 
    {
        idCategory: {
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
            allowNull: false,
            unique: true
        }
  }, 
  {
    tableName: 'category',
  }
);

Category.belongsTo(User, { foreignKey: "idUser" })

module.exports = Category;