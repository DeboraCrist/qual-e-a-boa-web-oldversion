const express = require("express");
const router = express.Router();

const {Pessoa} = require("../../models/Pessoa");
const {Estabelecimento} = require("../../models/Estabelecimento");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const verificaPessoaLogada = require("../middlewares/confirmaPessoaLogada");
const verificaEstabelecimentoLogado = require("../middlewares/confirmaEstabelecimentoLogado");

router.get("/homePessoa", verificaPessoaLogada, (req, res) => {
    res.render("homeUsuario.html", {dadosLogin: req.session.dadosLogin});
});

router.get("/homeEstabelecimento", verificaEstabelecimentoLogado, (req, res) => {
    res.render("homeComercial.html", {dadosLogin: req.session.dadosLogin});
});

module.exports = router;