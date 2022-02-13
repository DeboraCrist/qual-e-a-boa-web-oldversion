/** Contem as rotas relacionadas a evento */
const express = require("express");
const router = express.Router();
const multer = require("multer");

const top10Eventos = require("../controllers/top10");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const upload = multer({storage:multer.memoryStorage()});

const {Evento} = require("../../models/Evento");
const {Pessoa} = require("../../models/Pessoa")
const {Estabelecimento} = require("../../models/Estabelecimento");
const {PessoaEvento} = require("../../models/pessoaEvento")

const verificaValidadeEvento = require("../controllers/verificaValidadeDoEvento");
const marcaPresencaEvento = require("../controllers/marcaPresencaEvento");
const desmarcapresenca = require("../controllers/desmarcaPresencaEvento");


//meus middlewares
const verificaEstabelecimentoLogado = require("../middlewares/confirmaEstabelecimentoLogado");
const verificaPessoaLogada = require("../middlewares/confirmaPessoaLogada");
const atualizaEvento = require("../controllers/atualizaEvento");

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
            estado: estado,
            cidade: cidade,
            statusEvento: true,
        }
    })

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

    res.render("criarevento.html", {dadosLogin: req.session.dadosLogin, dadosEventos: eventosDoEstabelecimento});
});

router.post("/registraEvento", verificaEstabelecimentoLogado, upload.single('urlImagemLocal'), async (req, res) => {
    const image = req.file.buffer.toString("base64");

    const dadosLoginId = await Estabelecimento.findOne({
        where: {
            id: req.session.dadosLogin.id
        }
    });

    Evento.create({
        idEstabelecimento: dadosLoginId.id,
        titulo: req.body.nomeEvento, 
        urlImagem: image, 
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

router.post("/editaEvento/:idEvento", verificaEstabelecimentoLogado, upload.single('urlImagemLocal'), (req, res) => {
    const idEvento = req.params.idEvento;
    const image = req.file.buffer.toString("base64");

    const novosDadosEvento = {nomeEvento, tipoEvento, horario, cidade, estado, cep, capacidadePessoa, novoValor, novaData} = req.body

    atualizaEvento(idEvento, novosDadosEvento, image);
    res.redirect("/eventos/ativos");
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

router.get("/deletarEvento/:idEvento", verificaEstabelecimentoLogado, async (req, res) => {
    const idEvento = req.params.idEvento;

    Evento.destroy({
        where: {
            id: idEvento,
            idEstabelecimento: req.session.dadosLogin.id,
        }
    }).then(() => {
        res.redirect("/eventos/ativos");
    }).catch((error) => {
        res.redirect("/eventos/ativos");
    });
});

router.get("/marcapresenca/:idEvento", verificaPessoaLogada,async (req, res) => {
    const idEvento = req.params.idEvento;
    const idPessoaLogada = req.session.dadosLogin.id

    marcaPresencaEvento(idEvento, idPessoaLogada).then(() => {
        res.redirect("/eventos")
    }).catch((error) => {
        res.send("ERRO")
    });;
});

router.get("/desmarcapresenca/:idEvento", verificaPessoaLogada, async (req, res) => {
    const idEvento = req.params.idEvento;

    desmarcapresenca(idEvento).then(() => {
        res.redirect("/eventos")
    }).catch((error) => {
        res.send("ERRO")
    });
})

module.exports = router;