const express = require("express");
const router = express.Router();

const { criarUsuario, obterUsuarios, obterUsuarioPorId, loginUsuario, editarUsuario } = require('../controllers/UserController');
const { criarCategoria, obterCategorias, obterCategoriasPorIdUser } = require('../controllers/CategoryController');
const { adicionarGasto, obterGastosPorUsuario } = require('../controllers/ExpensesController');
const { criarMeta, obterMetasPorUsuario } = require('../controllers/GoalsController');
const { obterResumoGastosMensais } = require('../controllers/MonthlyExpensesController');
const { criarReceita, obterReceitarMesAnoPorUsuario, obterReceitarPaginadaPorUsuario } = require("../controllers/RevenuesController");


router.post('/api/user/create', criarUsuario); // Rota para criar usuário
router.get('/api/user', obterUsuarios); // Rota para obter todos os usuários
router.get('/api/user/:id', obterUsuarioPorId); // Rota para obter usuário por ID
router.post('/api/user/login', loginUsuario); // Rota para login de usuário
router.put('/api/user/edit/:id', editarUsuario)

router.post('/api/category/create', criarCategoria); // Rota para criar categoria
router.get('/api/category', obterCategorias); // Rota para obter todas as categorias
router.get('/api/category/:idUser', obterCategoriasPorIdUser); // Rota para obter todas as categorias por usuário

router.post('/api/expenses/create', adicionarGasto); // Rota para adicionar gasto
router.get('/api/expenses/user/:idUser', obterGastosPorUsuario); // Rota para obter gastos por usuário

router.post('/api/goals/create', criarMeta); // Rota para criar meta
router.get('/api/goals/user/:idUser', obterMetasPorUsuario); // Rota para obter metas por usuário

router.post('/api/revenues/create', criarReceita); // Rota para criar receita
router.get('/api/revenues/user/:idUser/:year/:month', obterReceitarMesAnoPorUsuario); // Rota para obter receitas por usuário
router.get('/api/revenues/user/:idUser', obterReceitarPaginadaPorUsuario); // Rota para obter receitas por usuário

router.get('/gastos/mensais/:usuarioId', obterResumoGastosMensais); // Rota para obter o resumo de gastos mensais de um usuário específico


module.exports = router;