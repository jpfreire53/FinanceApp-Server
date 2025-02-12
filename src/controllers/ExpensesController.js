const Expenses = require("../models/Expenses")

// Função auxiliar para validações
const validarGasto = (description, value, date, idCategory, idUser) => {
  if (!description || !value || !date || !idCategory || !idUser) {
    return 'Todos os campos são obrigatórios: description, value, date, idCategory, idUser';
  }
  if (isNaN(value)) {
    return 'value deve ser um número válido';
  }
  return null;
};

// Adicionar novo gasto
const adicionarGasto = async (req, res) => {
  const { description, value, date, idCategory, idUser } = req.body;
  const erroValidacao = validarGasto(description, value, date, idCategory, idUser);
  if (erroValidacao) {
    return res.status(400).json({ sucesso: false, mensagem: erroValidacao });
  }

  try {
    const novoGasto = await Expenses.create({ description, value, date, idCategory, idUser });
    res.status(201).json({ sucesso: true, mensagem: 'Gasto adicionado com sucesso', dados: novoGasto });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao adicionar gasto', erro: error.message });
  }
};

// Obter gastos por usuário
const obterGastosPorUsuario = async (req, res) => {
  const { idUser } = req.params;
  if (!idUser) {
    return res.status(400).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório' });
  }

  try {
    const gastos = await Expenses.findAll({ where: { idUser: idUser } });
    if (!gastos.length) {
      return res.status(404).json({ sucesso: false, mensagem: 'Nenhum gasto encontrado para este usuário' });
    }
    res.status(200).json({ sucesso: true, dados: gastos });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar gastos', erro: error.message });
  }
};

const obterGastosPaginadoPorUsuario = async (req, res) => {    
  try {
      const { idUser } = req.params;
      let { page, limit } = req.query;
      
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 10;

      const offset = (page - 1) * limit;

      const { rows:gastos, count: total  } = await Expenses.findAndCountAll({ 
          limit,
          offset,
          order: [["createdAt", "DESC"]],
          where: { 
              idUser: idUser
          }
      });
      if (!gastos.length) {
          return res.status(404).json({ sucesso: false, mensagem: 'Nenhum gasto encontrado para este usuário' });
      }

      res.status(200).json({ 
          sucesso: true, 
          dados: gastos,
          paginacao: {
              total,
              page,
              totalPage: Math.ceil(total / limit),
              perPage: limit
          } 
      });
  } catch (error) {
      res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar os gastos', erro: error.message });
  }
}

module.exports = { adicionarGasto, obterGastosPorUsuario, obterGastosPaginadoPorUsuario };
