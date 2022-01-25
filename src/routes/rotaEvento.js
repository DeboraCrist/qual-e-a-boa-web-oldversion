/** Contem as rotas relacionadas a evento */
const express = require("express");
const router = express.Router();

const top10Eventos = require("../controllers/top10");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const {Evento} = require("../models/Evento");
const {Estabelecimento} = require("../models/Estabelecimento");

//meus middlewares
function verificaUsuarioLogado(req, res, next) {
    if (!req.session.dadosLogin) {
        return res.redirect("/login");
    }

    return next()
}

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
        const todosEventos = await Evento.findAll({});

        res.render("eventos.html", {dadosLogin: req.session.dadosLogin, dadosEventos: todosEventos});
});

/*Quando o usuario usa filtro ele e redirecionado para essa rota*/
router.get("/eventos/:estado/:cidade", verificaPessoaLogada, async (req, res) => {
    const estado = req.params.estado;
    const cidade = req.params.cidade;

    const dadosFiltradosEventos = await Evento.findAll({
        where: {
            estado: estado,
            cidade: cidade,
        }
    })

    res.render("eventos.html", {dadosLogin: req.session.dadosLogin, dadosEventos: dadosFiltradosEventos})
});

router.get("/eventos/top10", verificaPessoaLogada, async (req, res) => {
    const todosEventos = await Evento.findAll({});

    var top10 = top10Eventos(todosEventos);

    res.render("top10.html", {dadosLogin: req.session.dadosLogin, top10Eventos: top10});
});

router.get("/eventos/detalhes/:id/:titulo", verificaUsuarioLogado,async (req, res) => {
    const idEvento = req.params.id;

    const detalheEvento = await Evento.findOne({
        where: {id: idEvento}
    });

    res.render("detalhesEvento.html", {dadosLogin: req.session.dadosLogin, dadosEventos: detalheEvento});
});

router.get("/eventos/ativos", verificaEstabelecimentoLogado, async (req, res) => {
    const eventosDoEstabelecimento = await Evento.findAll({
        where: {
            idEstabelecimento: req.session.dadosLogin.id,
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
    }).then(() => {
            console.log("criado");
            res.redirect("/eventos/ativos");
    }).catch((error) => {
            console.log("Erro: "+ error);
            res.redirect("/eventos/ativos");
    });

});

router.put("/editaEvento", (req, res) => {

});

module.exports = router;