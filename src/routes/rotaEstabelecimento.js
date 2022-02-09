const express = require("express");
const router = express.Router();

const {Evento} = require("../../models/Evento");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

//meus middlewares
const verificaEstabelecimentoLogado = require("../middlewares/confirmaEstabelecimentoLogado");

router.get("/usuarioEstabelecimento", verificaEstabelecimentoLogado, async (req, res) => {
    const eventosDoEstabelecimento = await Evento.findAll({
        where: {
            statusEvento: true,
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