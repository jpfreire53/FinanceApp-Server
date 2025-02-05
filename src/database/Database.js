const sequelize = require("./Sequelize");

const User = require("../models/User");
const Expenses = require("../models/Expenses");
const Category = require("../models/Category");
const Goals = require("../models/Goals");
const Revenues = require("../models/Revenues");
const createView = require("../models/Views/MonthlyExpenses");

const syncTables = async () => {
    await User.sync();
    await Goals.sync();
    await Category.sync();
    await Expenses.sync();
    await Revenues.sync();
    await createView();
    console.log("Sucesso ao sincronizar tabelas!");
}

const database = {
    syncDatabase: async () => {
        try {
            await sequelize.authenticate();
            console.log("Banco de dados inicializado com sucesso!");

            await syncTables();
        } catch (error) {
            console.log(`Eroo ao iniciar o banco de dados: ${error.message}`);
        }
    }
} 

module.exports = database;