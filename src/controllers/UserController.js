const User = require("../models/User")

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utils = require("../utils/Utils");
const SECRET_KEY = 'sua_chave_secreta_aqui';

const SALT_ROUNDS = 10;

// Função auxiliar para validações
const validarUsuario = (name, email, password) => {
  if (!name || !email || !password) {
    return 'name, email e password são obrigatórios';
  }
  return null;
};

const validarLogin = (email, password) => {
  if (!email || !password) {
    return 'Email e Senha são obrigatórios';
  }
  return null;
};

const loginUsuario = async (req, res) => {
  const { data } = req.body;
  const dataEncrypt = Utils.decryptData(data)
  const { email, password } = JSON.parse(dataEncrypt)
  
  // Validação básica de entrada
  const erroValidacao = validarLogin(email, password);
  if (erroValidacao) {
    return res.status(400).json({ sucesso: false, mensagem: erroValidacao });
  }

  try {
    // Procurar usuário por email
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }

    // Verificar se a senha está correta
    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) {
      return res.status(401).json({ sucesso: false, mensagem: 'Senha inválida' });
    }

    // Gerar token JWT
    const token = jwt.sign({ idUser: usuario.idUser, email: usuario.email }, SECRET_KEY, { expiresIn: '1h' });

    // Retornar sucesso e o token
    res.status(200).json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      token: token,
      user: { idUser: usuario.idUser, name: usuario.name, email: usuario.email }
    });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao realizar login', erro: error.message });
  }
};

// Criar um novo usuário
const criarUsuario = async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validação básica de entrada
  const erroValidacao = validarUsuario(name, email, password);
  if (erroValidacao) {
    return res.status(400).json({ sucesso: false, mensagem: erroValidacao });
  }

  try {
    // Verificar se o email já existe
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(409).json({ sucesso: false, mensagem: 'Email já cadastrado' });
    }

    // Criptografar a senha
    const senhaHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Criar o novo usuário com a senha criptografada
    const user = {
      name: name,
      email: email,
      password: senhaHash
    }

    const novoUsuario = await User.create(user);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário criado com sucesso',
      dados: { idUser: novoUsuario.idUser, name: novoUsuario.name, email: novoUsuario.email }
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar usuário', erro: error.message });
  }
};

// Obter todos os usuários
const obterUsuarios = async (req, res) => {
  try {
    const usuarios = await User.findAll();
    res.status(200).json({ sucesso: true, dados: usuarios });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar usuários', erro: error.message });
  }
};

// Obter usuário por ID
const obterUsuarioPorId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório' });
  }

  try {
    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }
    res.status(200).json({ sucesso: true, dados: usuario });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar usuário', erro: error.message });
  }
};

// Editar usuário
const editarUsuario = async (req, res) => {
  const { name, email } = req.body
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ sucesso: false, mensagem: 'ID do usuário é obrigatório' });
  }

  try {
    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }

    usuario.update({
      name,
      email
    });

    usuario.reload();

    res.status(200).json({ sucesso: true, mensagem: "Usuário editado com sucesso." });
  } catch (error) {
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar usuário', erro: error.message });
  }
};

module.exports = { criarUsuario, obterUsuarios, obterUsuarioPorId, loginUsuario, editarUsuario };
