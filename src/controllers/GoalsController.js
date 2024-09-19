const Goals = require("../models/Goals")

// Função auxiliar para validações
const validarMeta = (name, targetValue, startDate, endDate, idUser) => {
  if (!name || !targetValue || !startDate || !endDate || !idUser) {
    return 'Todos os campos são obrigatórios: name, targetValue, startDate, endDate, idUser';
  }
  if (isNaN(targetValue)) {
    return 'Valor alvo deve ser um número válido';
  }
  return null;
};

// Criar nova meta
const criarMeta = async (req, res) => {
  const { name, targetValue, startDate, endDate, idUser } = req.body;
  const erroValidacao = validarMeta(name, targetValue, startDate, endDate, idUser);
  if (erroValidacao) {
    return res.status(400).json({ sucesso: false, mensagem: erroValidacao });
  }

  try {
    const novaMeta = await Goals.create({ name, targetValue, startDate, endDate, idUser });
    res.status(201).json({ sucesso: true, mensagem: 'Meta criada com sucesso', dados: novaMeta });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar meta', erro: error.message });
  }
};

// Obter metas por usuário
const obterMetasPorUsuario = async (req, res) => {
  const { idUser } = req.params;
  if (!idUser) {
    return res.status(400).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório' });
  }

  try {
    const metas = await Goals.findAll({ where: { idUser: idUser } });
    if (!metas.length) {
      return res.status(404).json({ sucesso: false, mensagem: 'Nenhuma meta encontrada para este usuário' });
    }
    res.status(200).json({ sucesso: true, dados: metas });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar metas', erro: error.message });
  }
};

module.exports = { criarMeta, obterMetasPorUsuario };
