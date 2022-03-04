require('dotenv').config()
const express = require("express");
const app = express();
const saltedMd5 = require('salted-md5');
const router = express.Router();
const path = require("path")
const multer = require("multer");
const {getStorage, ref, getDownloadURL } = require("firebase/storage");
const firebase = require("../services/firebase");

const {Evento} = require("../../models/Evento");
const Galeria = require("../../models/Galeria");
const {Estabelecimento} = require("../../models/Estabelecimento");

var admin = require("firebase-admin");
app.locals.bucket = admin.storage().bucket();
const upload = multer({storage: multer.memoryStorage()});

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

router.post("/adicionarFoto", verificaEstabelecimentoLogado, upload.single('arquivoFoto'), async (req, res) => {
    const img = saltedMd5(req.file.originalname, 'SUPER-S@LT!');
    const formatoDoArquivo = path.extname(req.file.originalname);

    if (formatoDoArquivo != ".png" && formatoDoArquivo != ".jpeg" && formatoDoArquivo != ".jpg") {
        alertas.push({msg: "Não Aceitamos esse formato de arquivo"});
        res.redirect("/usuarioEstabelecimento");
    } else {
        const nomeImg = img + formatoDoArquivo;
        app.locals.bucket.file(nomeImg).createWriteStream().end(req.file.buffer);

        const dadosLoginId = await Estabelecimento.findOne({
            where: {
                id: req.session.dadosLogin.id
            }
        });
    
        await delay(2000);
    
        const storage = getStorage();
        getDownloadURL(ref(storage, nomeImg)).then((url) => {
            Galeria.create({
                foto: url,
                idEstabelecimento: dadosLoginId.id,
            }).then(() => {
                res.redirect("/usuarioEstabelecimento");
            }).catch((erro) => {
                console.log(erro);
                alertas.push({msg: "Erro ao enviar a imagem"})
                res.redirect("/usuarioEstabelecimento");
            });
        }).catch((error) => {
            console.log(error);
            res.send(error)
        });
    }
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

router.post("/estabelecimento/atualizarDados", verificaEstabelecimentoLogado, (req, res) => {
    Estabelecimento.update(
        {
            nomeDono: req.body.nome,
            nomeEstabelecimento: req.body.nomeEstabelecimento,
            rua: req.body.rua,
            bairro: req.body.bairro,
            numero: req.body.numero,
            cidade: req.body.cidade,
            estado: req.body.estado,
            cep: req.body.cep,
            lotacaoMax: req.body.capacidade,
        }, {
            where: {id: req.session.dadosLogin.id}
        }
    ).then(() => {
        console.log("atualizado")
        res.redirect("/usuarioEstabelecimento");
    }).catch((erro) => {
        console.log(erro);
        alertas.push({msg: "Erro ao tentar atualizar os dados."})
        res.redirect("/usuarioEstabelecimento");
    });
}); 

router.post("/editarFoto", verificaEstabelecimentoLogado, upload.single('novaFoto'), async (req, res) => {
    const img = saltedMd5(req.file.originalname, 'SUPER-S@LT!');
    const formatoDoArquivo = path.extname(req.file.originalname);

    if (formatoDoArquivo != ".png" && formatoDoArquivo != ".jpeg" && formatoDoArquivo != ".jpg") {
        alertas.push({msg: "Não Aceitamos esse formato de arquivo"});
        res.redirect("/usuarioEstabelecimento");
    } else {
        const nomeImg = img + formatoDoArquivo;
        app.locals.bucket.file(nomeImg).createWriteStream().end(req.file.buffer);

        await delay(2000);

        const storage = getStorage();
        getDownloadURL(ref(storage, nomeImg)).then((url) => {
            Estabelecimento.update(
            {
                urlImagemPerfil: url
            }, {
                where: {id: req.session.dadosLogin.id}
            }
            ).then(() => {
                res.redirect("/usuarioEstabelecimento");
            }).catch((erro) => {
                alertas.push({msg: "Erro ao tentar atualizar a foto de perfil"});
                res.redirect("/usuarioEstabelecimento");
            });
        }).catch((error) => {
            console.log(error);
            res.send(error)
        });
    }
});

module.exports = router;