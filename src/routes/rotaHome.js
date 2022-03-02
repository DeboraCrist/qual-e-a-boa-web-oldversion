const express = require("express");
const router = express.Router();

const {Pessoa} = require("../../models/Pessoa");
const {Estabelecimento} = require("../../models/Estabelecimento");

const {Evento} = require("../../models/Evento");
const {PessoaEvento} = require("../../models/pessoaEvento");
const top10Eventos = require("../controllers/top10");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const verificaClienteLogado = require("../middlewares/confirmaClienteLogado");

router.get("/home", verificaClienteLogado, async (req, res) => {
    const todosEventos = await Evento.findAll({
        where: {statusEvento: true}
    });

    const pessoaEvento = await PessoaEvento.findAll({
        where: {
            idPessoa: req.session.dadosLogin.id,
        }
    });

    var top10 = top10Eventos(todosEventos);

    res.render("home.html", {dadosLogin: req.session.dadosLogin, dadosEventos: top10, pessoaEvento: pessoaEvento});
});

module.exports = router;