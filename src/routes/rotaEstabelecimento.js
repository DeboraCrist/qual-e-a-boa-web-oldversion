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

//meus middlewares
const verificaEstabelecimentoLogado = require("../middlewares/confirmaEstabelecimentoLogado");

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
    })

    res.render('paginaInicialComercial.html', {dadosLogin: req.session.dadosLogin, dadosEventos: eventosDoEstabelecimento, fotosGaleria: fotosGaleria});
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
    });
})

module.exports = router;