/** Contem as rotas relacionadas a evento */
const express = require("express");
const router = express.Router();

const top10Eventos = require("../controllers/top10");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const {Evento} = require("../models/Evento");
const {Estabelecimento} = require("../models/Estabelecimento");

const verificaValidadeEvento = require("../controllers/verificaValidadeDoEvento");

//meus middlewares

//verifica que tipo de usuario esta logado
function verificaPessoaLogada (req, res, next) {
    if (!req.session.dadosLogin) {
        return res.redirect("/login");
    } else if (req.session.dadosLogin != "undefined" && req.session.dadosLogin.tipoDeConta == 1) {
        //a conta de estabelecimento não pode ter acesso a rota então quando tenta entrar ela é redirecionada pro perfil
        return res.redirect("/usuarioEstabelecimento");
    }

    return next();
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

router.get("/eventos", verificaPessoaLogada, async (req, res) => {
    verificaValidadeEvento(req.session.dadosLogin.id);

    const todosEventos = await Evento.findAll({
        where: {statusEvento: true}
    });

    res.render("eventos.html", {dadosLogin: req.session.dadosLogin, dadosEventos: todosEventos});
});

/*Quando o usuario usa filtro ele e redirecionado para essa rota*/
router.get("/eventos/:estado/:cidade", verificaPessoaLogada, async (req, res) => {
    verificaValidadeEvento(req.session.dadosLogin.id);

    const estado = req.params.estado;
    const cidade = req.params.cidade;

    const dadosFiltradosEventos = await Evento.findAll({
        where: {
            estado: estado,
            cidade: cidade,
            statusEvento: true,
        }
    })

    res.render("eventos.html", {dadosLogin: req.session.dadosLogin, dadosEventos: dadosFiltradosEventos})
});

router.get("/eventos/top10", verificaPessoaLogada, async (req, res) => {
    const todosEventos = await Evento.findAll({
        where: {statusEvento: true}
    });

    var top10 = top10Eventos(todosEventos);

    res.render("top10.html", {dadosLogin: req.session.dadosLogin, top10Eventos: top10});
});

router.get("/eventos/ativos", verificaEstabelecimentoLogado, async (req, res) => {
    verificaValidadeEvento(req.session.dadosLogin.id);

    const eventosDoEstabelecimento = await Evento.findAll({
        where: {
            idEstabelecimento: req.session.dadosLogin.id,
            statusEvento: true,
        }
    });

    res.render("criarevento.html", {dadosLogin: req.session.dadosLogin, dadosEventos: eventosDoEstabelecimento});
});

router.post("/registraEvento", verificaEstabelecimentoLogado, async (req, res) => {
    const dadosLoginId = await Estabelecimento.findOne({
        where: {
            id: req.session.dadosLogin.id
        }
    });

    Evento.create({
        idEstabelecimento: dadosLoginId.id,
        titulo: req.body.nomeEvento, 
        urlImagem:req.body.urlImagemLocal, 
        cidade:req.body.cidade, 
        estado:req.body.estado, 
        cep:req.body.cep, 
        tipoDeEvento:req.body.tipoEvento, 
        valorEntrada:req.body.valor,
        confirmacoes: 0,
        capacidade:req.body.capacidadePessoa, 
        dataDoEvento:req.body.dataEvento, 
        horaDoEvento:req.body.Horario,
        statusEvento:true
    }).then(() => {
            console.log("criado");
            res.redirect("/eventos/ativos");
    }).catch((error) => {
            console.log("Erro: "+ error);
            res.redirect("/eventos/ativos");
    });
});

router.post("/editaEvento/:idEvento", verificaEstabelecimentoLogado, (req, res) => {
    const idEvento = req.params.idEvento;

    const {
        nomeEvento, tipoEvento, horario, cidade, estado, cep, capacidadePessoa, urlImagemLocal, novoValor, novaData} = req.body

    Evento.update(
        {   
            titulo: nomeEvento,
            urlImagem: urlImagemLocal,
            cidade: cidade,
            estado: estado,
            cep: cep,
            tipoDeEvento: tipoEvento,
            horaDoEvento: horario,
            capacidade: capacidadePessoa,
            dataDoEvento: novaData,
            valorEntrada: novoValor
        },
        {where: {id: idEvento}}
    ).then(() => {
        res.redirect("/eventos/ativos");
    }).catch((error) => {
        console.log(error);
        res.redirect("/eventos/ativos");
    });
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

module.exports = router;