const sequelize = require('../../database/Sequelize'); // Aponte para a instância Sequelize correta

const createView = async () => {
  try {
    await sequelize.query(`
      CREATE OR REPLACE VIEW vw_ResumoGastosMensais AS
      SELECT 
        user.idUser AS idUser,
        user.name AS name,
        YEAR(expenses.date) AS Ano,
        MONTH(expenses.date) AS Mes,
        category.name AS category,
        SUM(expenses.value) AS TotalGasto
      FROM 
        User user
        INNER JOIN Expenses expenses ON user.idUser = expenses.idUser
        INNER JOIN Category category ON expenses.idCategory = category.idCategory
      GROUP BY 
        user.idUser, user.name, YEAR(expenses.date), MONTH(expenses.date), category.name;
    `);
    console.log('VIEW vw_ResumoGastosMensais criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar a VIEW:', error);
  }
};

module.exports = createView;
