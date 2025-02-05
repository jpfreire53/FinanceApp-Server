const { Op, Sequelize } = require("sequelize");
const Revenues = require("../models/Revenues");

const validarReceita = (idUser, description, value, date) => {
    if (!idUser || !description || !value || !date) {
        return 'Todos os campos são obrigatórios: idUser, description, value, date';
    }
    if (isNaN(value)) {
        return 'Valor deve ser um número válido';
    }
    return null;
}

const criarReceita = async (req, res) => {
    const { idUser, description, value, date } = req.body;
    const erroValidacao = validarReceita(idUser, description, value, date);
    if (erroValidacao) {
        return res.status(400).json({ sucesso: false, mensagem: erroValidacao });
    }
    try {
        const novaReceita = await Revenues.create({ idUser, description, value, date });
        res.status(201).json({ sucesso: true, mensagem: 'Receita criada com sucesso', dados: novaReceita });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar receita', erro: error.message });
    }
}

const obterReceitarMesAnoPorUsuario = async (req, res) => {
    const { idUser, year, month } = req.params;
    if (!idUser) {
        return res.status(400).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório' });
    }

    try {
        const receitas = await Revenues.findAll({ 
            where: { 
                [Op.and]: [
                    Sequelize.literal(`YEAR(date) = ${year}`),
                    Sequelize.literal(`MONTH(date) = ${month}`)
                ],
                idUser: idUser
            }
        });
        if (!receitas.length) {
            return res.status(404).json({ sucesso: false, mensagem: 'Nenhuma receita encontrada para este usuário' });
        }

        res.status(200).json({ sucesso: true, dados: receitas });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar receitas', erro: error.message });
    }
}

module.exports = { criarReceita, obterReceitarMesAnoPorUsuario };
