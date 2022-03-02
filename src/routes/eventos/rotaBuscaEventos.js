require('dotenv').config()
const express = require("express");
const router = express.Router();
const firebase = require("../../services/firebase");
const sorteiaEvento = require("../../scripts/sorteiaEvento");
const top10Eventos = require("../../controllers/top10");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const {Evento} = require("../../../models/Evento");
const {PessoaEvento} = require("../../../models/pessoaEvento");

const verificaValidadeEvento = require("../../controllers/verificaValidadeDoEvento");
const marcaPresencaEvento = require("../../controllers/marcaPresencaEvento");
const desmarcapresenca = require("../../controllers/desmarcaPresencaEvento");

//meus middlewares
const verificaEstabelecimentoLogado = require("../../middlewares/confirmaEstabelecimentoLogado");
const verificaPessoaLogada = require("../../middlewares/confirmaPessoaLogada");

let alertas = [];

router.get("/eventos", verificaPessoaLogada, async (req, res) => {
    verificaValidadeEvento(req.session.dadosLogin.id);
    console.log("OK AQ ZZZ")

    const todosEventos = await Evento.findAll({
        where: {statusEvento: true}
    });

    const pessoaEvento = await PessoaEvento.findAll({
        where: {
            idPessoa: req.session.dadosLogin.id,
        }
    });

    console.log("OI")
    res.render("eventos.html", {dadosLogin: req.session.dadosLogin, dadosEventos: todosEventos, pessoaEvento: pessoaEvento});
});

/*Quando o usuario usa filtro ele e redirecionado para essa rota*/
router.get("/eventos/:estado/:cidade", verificaPessoaLogada, async (req, res) => {
    verificaValidadeEvento(req.session.dadosLogin.id);

    const pessoaEvento = await PessoaEvento.findAll({
        where: {
            idPessoa: req.session.dadosLogin.id,
        }
    });

    const estado = req.params.estado;
    const cidade = req.params.cidade;

    const dadosFiltradosEventos = await Evento.findAll({
        where: {
            statusEvento: true,
            estado: estado,
            cidade: cidade,
        }
    });

    res.render("eventos.html", {dadosLogin: req.session.dadosLogin, dadosEventos: dadosFiltradosEventos, pessoaEvento: pessoaEvento})
});

router.get("/eventos/top10", verificaPessoaLogada, async (req, res) => {
    const todosEventos = await Evento.findAll({
        where: {statusEvento: true}
    });

    const pessoaEvento = await PessoaEvento.findAll({
        where: {
            idPessoa: req.session.dadosLogin.id,
        }
    });

    var top10 = top10Eventos(todosEventos);

    res.render("top10.html", {dadosLogin: req.session.dadosLogin, top10Eventos: top10, pessoaEvento: pessoaEvento});
});

router.get("/eventos/ativos", verificaEstabelecimentoLogado, async (req, res) => {
    verificaValidadeEvento(req.session.dadosLogin.id);

    const eventosDoEstabelecimento = await Evento.findAll({
        where: {
            idEstabelecimento: req.session.dadosLogin.id,
            statusEvento: true,
        }
    });

    res.render("criarevento.html", {dadosLogin: req.session.dadosLogin, dadosEventos: eventosDoEstabelecimento, alertas});
    alertas = [];
});

router.get("/eventos/encerrados", verificaEstabelecimentoLogado, async (req, res) => {
    const eventosEncerrados = await Evento.findAll({
        where: {
            idEstabelecimento: req.session.dadosLogin.id,
            statusEvento: false,
        }
    });

    res.render("eventosEncerrados.html", {dadosLogin: req.session.dadosLogin, dadosEventos: eventosEncerrados});
});

router.get("/eventos/encerrados/busca/:estado", verificaEstabelecimentoLogado, async (req, res) => {
    const estado = req.params.estado;
    
    const eventos = await Evento.findAll({
        where: {
            idEstabelecimento: req.session.dadosLogin.id,
            estado: estado,
            statusEvento: false,
        }
    });
    res.render("eventosEncerrados.html", {dadosLogin: req.session.dadosLogin, dadosEventos: eventos});
});

router.get("/eventos/encerrados/buscaNome/:nome", verificaEstabelecimentoLogado, async (req, res) => {
    const nome = req.params.nome;
    const idEstabelecimento = req.session.dadosLogin.id;

    const eventos = await Evento.findAll({
        where: {
            idEstabelecimento: idEstabelecimento,
            titulo: nome,
            statusEvento: false,
        }
    });

    res.render("eventosEncerrados.html", {dadosLogin: req.session.dadosLogin, dadosEventos: eventos});
});

router.get("/marcapresenca/:idEvento", verificaPessoaLogada,async (req, res) => {
    const idEvento = req.params.idEvento;
    const idPessoaLogada = req.session.dadosLogin.id
    const paginaAnterior = req.header("Referer") || "/";

    marcaPresencaEvento(idEvento, idPessoaLogada).then(() => {
        res.redirect(paginaAnterior);
    }).catch((error) => {
        res.send("ERRO")
    });
});

router.get("/desmarcapresenca/:idEvento", verificaPessoaLogada, async (req, res) => {
    const idEvento = req.params.idEvento;
    const paginaAnterior = req.header("Referer") || "/";

    desmarcapresenca(idEvento).then(() => {
        res.redirect(paginaAnterior)
    }).catch((error) => {
        res.send("ERRO")
    });
});

router.get("/surpreendame", verificaPessoaLogada, async (req, res) => {
    const eventos = await Evento.findAll({
        where: {statusEvento: true}
    });

    console.log(eventos);

    const pessoaEvento = await PessoaEvento.findAll({
        where: {
            idPessoa: req.session.dadosLogin.id,
        }
    });

    const eventoSorteado = await Evento.findAll({
        where: {
            id: sorteiaEvento(eventos),
            statusEvento: true,
        }
    });
    
    res.render("eventos.html", {dadosLogin: req.session.dadosLogin ,dadosEventos: eventoSorteado, pessoaEvento});
});

module.exports = router;