/** Contem as rotas relacionadas a evento */
require('dotenv').config()
const express = require("express");
const app = express();
const saltedMd5 = require('salted-md5');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {getStorage, ref, getDownloadURL } = require("firebase/storage");
const firebase = require("../services/firebase");
const sorteiaEvento = require("../scripts/sorteiaEvento");

const top10Eventos = require("../controllers/top10");

var admin = require("firebase-admin");
app.locals.bucket = admin.storage().bucket();
const upload = multer({storage: multer.memoryStorage()});

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const {Evento} = require("../../models/Evento");
const {Estabelecimento} = require("../../models/Estabelecimento");
const {PessoaEvento} = require("../../models/pessoaEvento");

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

    res.render("criarevento.html", {dadosLogin: req.session.dadosLogin, dadosEventos: eventosDoEstabelecimento});
});

router.post("/registraEvento", verificaEstabelecimentoLogado, upload.single('urlImagemLocal'), async (req, res) => {
    const img = saltedMd5(req.file.originalname, 'SUPER-S@LT!');
    const nomeImg = img + path.extname(req.file.originalname);
    app.locals.bucket.file(nomeImg).createWriteStream().end(req.file.buffer);


    const dadosLoginId = await Estabelecimento.findOne({
        where: {
            id: req.session.dadosLogin.id
        }
    });

    await delay(2000);

    const storage = getStorage();
    getDownloadURL(ref(storage, nomeImg)).then((url) => {
        Evento.create({
            idEstabelecimento: dadosLoginId.id,
            titulo: req.body.nomeEvento, 
            urlImagem: url, 
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
    }).catch((error) => {
        console.log(error);
        res.send(error)
    });
});

router.post("/editaEvento/:idEvento", verificaEstabelecimentoLogado, upload.single('urlImagemLocal'), async (req, res) => {
    const idEvento = req.params.idEvento;
    const img = saltedMd5(req.file.originalname, 'SUPER-S@LT!');
    const nomeImg = img + path.extname(req.file.originalname);
    app.locals.bucket.file(nomeImg).createWriteStream().end(req.file.buffer);

    const novosDadosEvento = {nomeEvento, tipoEvento, horario, cidade, estado, cep, capacidadePessoa, novoValor, novaData} = req.body

    await delay(2000);

    const storage = getStorage();
    getDownloadURL(ref(storage, nomeImg)).then((url) => {
        atualizaEvento(idEvento, novosDadosEvento, url);
        res.redirect("/eventos/ativos");
    }).catch((error) => {
        console.log(error);
        res.send(error)
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
        res.redirect("/eventos");
    }).catch((error) => {
        res.send("ERRO")
    });
});

router.get("/desmarcapresenca/:idEvento", verificaPessoaLogada, async (req, res) => {
    const idEvento = req.params.idEvento;

    desmarcapresenca(idEvento).then(() => {
        res.redirect("/eventos")
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