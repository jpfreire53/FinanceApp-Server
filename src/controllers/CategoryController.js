const Category = require("../models/Category");
const Utils = require("../utils/Utils");

// Criar nova categoria
const criarCategoria = async (req, res) => {
  const { data } = req.body;
  const encryptData = Utils.decryptData(data)
  const decryptJSON = JSON.parse(encryptData)

  if (!decryptJSON.name || !decryptJSON.idUser) {
    return res.status(400).json({ sucesso: false, mensagem: 'Nome da categoria é obrigatório' });
  }

  try {
    const categoriaExistente = await Category.findOne({ where: { name: decryptJSON.name } });
    if (categoriaExistente) {
      return res.status(409).json({ sucesso: false, mensagem: 'Categoria já existe' });
    }

    const novaCategoria = await Category.create({ name: decryptJSON.name, idUser: decryptJSON.idUser });
    res.status(201).json({ sucesso: true, mensagem: 'Categoria criada com sucesso', dados: novaCategoria });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar categoria', erro: error.message });
  }
};

// Obter todas as categorias
const obterCategorias = async (req, res) => {
  try {
    const categorias = await Category.findAll();
    res.status(200).json({ sucesso: true, dados: categorias });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar categorias', erro: error.message });
  }
};

const obterCategoriasPorIdUser = async (req, res) => {
  const { idUser } = req.params;
  if (!idUser) {
    return res.status(400).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório' });
  }

  try {
    const categorias = await Category.findAll({ where: { idUser: idUser } });
    if (!categorias.length) {
      return res.status(404).json({ sucesso: false, mensagem: 'Nenhum gasto encontrado para este usuário' });
    }
    res.status(200).json({ sucesso: true, dados: categorias });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar categorias', erro: error.message });
  }
};

module.exports = { criarCategoria, obterCategorias, obterCategoriasPorIdUser };
