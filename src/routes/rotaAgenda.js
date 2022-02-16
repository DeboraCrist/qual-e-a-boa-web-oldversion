const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const {Pessoa} = require("../../models/Pessoa");
const {Estabelecimento} = require("../../models/Estabelecimento");
const {Agenda} = require("../../models/Agenda");
const {registraNaAgendaPessoa} = require("../controllers/registraNaAgendaPessoa");
const {registraNaAgendaEstabelecimento} = require("../controllers/registraNaAgendaEstabelecimento");

//meus middlewares
const verificaUsuarioLogado = require("../middlewares/confirmaClienteLogado");

router.get("/agenda", verificaUsuarioLogado, async (req, res) => {
    if (req.session.dadosLogin.tipoDeConta == 1) {
        const dadosAgenda = await Agenda.findAll({
            where: {
                idEstabelecimento: req.session.dadosLogin.id,
            }
        });  
        
        res.render("agenda.html", {dadosLogin: req.session.dadosLogin, dadosAgenda: dadosAgenda});
    } else {
        const dadosAgenda = await Agenda.findAll({
            where: {
                idPessoa: req.session.dadosLogin.id,
            }
        });  
        
        console.log("+++" + dadosAgenda.length)

        res.render("agenda.html", {dadosLogin: req.session.dadosLogin, dadosAgenda: dadosAgenda});
    }
});

router.post("/criaEvento", async (req, res) => {
    const tipoDeConta = req.session.dadosLogin.tipoDeConta;

    if (tipoDeConta == 1) {
        const idDoEstabelecimento = await Estabelecimento.findOne({
            attributes: ['id'],
            where: {
                id: req.session.dadosLogin.id,
            }
        });

        const dadosEvento = {
            nome: req.body.nome,
            data: req.body.data,
            bio: req.body.bio,
        }

        registraNaAgendaEstabelecimento(dadosEvento, idDoEstabelecimento);
    } else {
        const idDaPessoa = await Pessoa.findOne({
            where: {
                id: req.session.dadosLogin.id,
            }
        });

        const dadosEvento = {
            nome: req.body.nome,
            data: req.body.data,
            bio: req.body.bio,
        }

        registraNaAgendaPessoa(dadosEvento, idDaPessoa);
    }
    res.redirect("/agenda")
});
/////////
router.get("/deletarLembrete/:idLembrete", verificaUsuarioLogado, async (req, res) => {
    const idLembrete = req.params.idLembrete;
    const tipoDeConta = req.session.dadosLogin.tipoDeConta;

    if (tipoDeConta == 1) {
        Agenda.destroy({
            where: {
                [Op.and]: [
                    {id: idLembrete},
                    {idEstabelecimento: req.session.dadosLogin.id},
                ]
            }
        }).then(() => {
            res.redirect("/agenda");
        }).catch((error) => {
            res.redirect("/agenda");
        });
    } else {
        Agenda.destroy({
            where: {
                [Op.and]: [
                    {id: idLembrete},
                    {idPessoa: req.session.dadosLogin.id},
                ]
            }
        }).then(() => {
            res.redirect("/agenda");
        }).catch((error) => {
            res.redirect("/agenda");
        });
    }
});

module.exports = router;