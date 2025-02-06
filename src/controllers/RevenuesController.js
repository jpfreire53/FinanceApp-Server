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

const obterReceitarPaginadaPorUsuario = async (req, res) => {    
    try {
        const { idUser } = req.params;
        let { page, limit } = req.query;
        
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        const offset = (page - 1) * limit;

        const { rows:receitas, count: total  } = await Revenues.findAndCountAll({ 
            limit,
            offset,
            order: [["createdAt", "DESC"]],
            where: { 
                idUser: idUser
            }
        });
        if (!receitas.length) {
            return res.status(404).json({ sucesso: false, mensagem: 'Nenhuma receita encontrada para este usuário' });
        }

        res.status(200).json({ 
            sucesso: true, 
            dados: receitas,
            paginacao: {
                total,
                page,
                totalPage: Math.ceil(total / limit),
                perPage: limit
            } 
        });
    } catch (error) {
        res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar receitas', erro: error.message });
    }
}

module.exports = { criarReceita, obterReceitarMesAnoPorUsuario, obterReceitarPaginadaPorUsuario };
