const sequelize = require("../database/Sequelize")
const { QueryTypes } = require('sequelize');

// Obter resumo de gastos mensais por usuário
const obterResumoGastosMensais = async (req, res) => {
  const { usuarioId } = req.params;

  if (!usuarioId) {
    return res.status(400).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório' });
  }

  try {
    // Consultar a VIEW vw_ResumoGastosMensais para pegar o resumo de gastos mensais do usuário
    const resumoGastos = await sequelize.query(
      `SELECT * FROM vw_ResumoGastosMensais WHERE idUser = :usuarioId`,
      {
        type: QueryTypes.SELECT,
        replacements: { usuarioId }
      }
    );

    if (!resumoGastos.length) {
      return res.status(404).json({ sucesso: false, mensagem: 'Nenhum resumo de gastos encontrado para este usuário' });
    }

    res.status(200).json({
      sucesso: true,
      dados: resumoGastos
    });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao obter resumo de gastos mensais', erro: error.message });
  }
};

module.exports = { obterResumoGastosMensais };
