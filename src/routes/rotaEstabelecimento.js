const express = require("express");
const router = express.Router();
const multer = require("multer");

const {Evento} = require("../../models/Evento");
const Galeria = require("../../models/Galeria");
const {Estabelecimento} = require("../../models/Estabelecimento");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const upload = multer({storage:multer.memoryStorage()});

let alertas = [];

//meus middlewares
const verificaEstabelecimentoLogado = require("../middlewares/confirmaEstabelecimentoLogado");
const { Op } = require("sequelize");

router.get("/usuarioEstabelecimento", verificaEstabelecimentoLogado, async (req, res) => {
    const eventosDoEstabelecimento = await Evento.findAll({
        where: {
            statusEvento: true,
            idEstabelecimento: req.session.dadosLogin.id,
        }
    });

    const fotosGaleria = await Galeria.findAll({
        where: {
            idEstabelecimento: req.session.dadosLogin.id,
        }
    });

    const dadosLogin = await Estabelecimento.findAll({
        where: {
            id: req.session.dadosLogin.id
        }
    });

    res.render('paginaInicialComercial.html', {dadosLogin: dadosLogin[0], dadosEventos: eventosDoEstabelecimento, fotosGaleria: fotosGaleria, alertas: alertas});
    alertas = [];
});

router.get("/editarEstabelecimento", verificaEstabelecimentoLogado, (req, res) => {
    res.render('editaEstabelecimento.html', {dadosLogin: req.session.dadosLogin});
    res.redirect("/login");
});

router.post("/adicionarFoto", verificaEstabelecimentoLogado, upload.single('arquivoFoto'), async (req, res) => {
    const image = req.file.buffer.toString('base64');

    const dadosLoginId = await Estabelecimento.findOne({
        where: {
            id: req.session.dadosLogin.id
        }
    });

    Galeria.create({
        foto: image,
        idEstabelecimento: dadosLoginId.id,
    }).then(() => {
        res.redirect("/usuarioEstabelecimento");
    }).catch((erro) => {
        console.log(erro);
        alertas.push({msg: "Erro ao enviar a imagem"})
        res.redirect("/usuarioEstabelecimento");
    });
});

router.post("/removerFotos", verificaEstabelecimentoLogado, async (req, res) => {
    const idFotos = Object.keys(req.body);

    Galeria.destroy({
        where: {
            [Op.and]: [
                {id: idFotos},
                {idEstabelecimento: req.session.dadosLogin.id}
            ]
        }
    }).then(() => {
        res.redirect("/usuarioEstabelecimento");
    }).catch((erro) => {
        alertas.push({msg: "ERRO ao tentar deletar as imagens"});
        res.redirect("/usuarioEstabelecimento");
    })
});

module.exports = router;