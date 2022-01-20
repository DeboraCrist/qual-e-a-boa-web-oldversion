const express = require("express");
const router = express.Router();

const Evento = require("../models/Evento");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

//meus middlewares
function verificaUsuarioLogado(req, res, next) {
    if (!req.session.dadosLogin) {
        return res.redirect("/login");
    }

    return next()
}

//verifica que tipo de usuario esta logado
function verificaEstabelecimentoLogado (req, res, next) {
    if (!req.session.dadosLogin) {
        return res.redirect("/login");
    } else if (req.session.dadosLogin != "undefined" && req.session.dadosLogin.tipoDeConta == 0) {
        //a conta de estabelecimento não pode ter acesso a rota então quando tenta entrar ela é redirecionada pro perfil
        return res.redirect("/usuarioCliente");
    }

    return next();
}

router.get("/usuarioEstabelecimento", verificaEstabelecimentoLogado, async (req, res) => {
    const eventosDoEstabelecimento = await Evento.findAll({
        where: {
            idEstabelecimento: req.session.dadosLogin.id,
        }
    });

    res.render('paginaInicialComercial.html', {dadosLogin: req.session.dadosLogin, dadosEventos: eventosDoEstabelecimento});
});

router.get("/editarEstabelecimento", verificaEstabelecimentoLogado, (req, res) => {
    res.render('editaEstabelecimento.html', {dadosLogin: req.session.dadosLogin});
    res.redirect("/login");
});

module.exports = router;