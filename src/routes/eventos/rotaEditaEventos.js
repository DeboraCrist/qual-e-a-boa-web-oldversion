require('dotenv').config()
const express = require("express");
const app = express();
const saltedMd5 = require('salted-md5');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {getStorage, ref, getDownloadURL } = require("firebase/storage");
const firebase = require("../../services/firebase");

var admin = require("firebase-admin");
app.locals.bucket = admin.storage().bucket();
const upload = multer({storage: multer.memoryStorage()});

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const {Evento} = require("../../../models/Evento");

//meus middlewares
const verificaEstabelecimentoLogado = require("../../middlewares/confirmaEstabelecimentoLogado");
const atualizaEvento = require("../../controllers/atualizaEvento");

router.post("/editaEvento/:idEvento", verificaEstabelecimentoLogado, upload.single('urlImagemLocal'), async (req, res) => {
    const idEvento = req.params.idEvento;
    const img = saltedMd5(req.file.originalname, 'SUPER-S@LT!');
    const formatoDoArquivo = path.extname(req.file.originalname);

    if (formatoDoArquivo != ".png" && formatoDoArquivo != ".jpeg" && formatoDoArquivo != ".jpg") {
        alertas.push({msg: "Erro ao tentar atualizar o evento"});
        res.redirect("/eventos/ativos");
    } else {
        const nomeImg = img + formatoDoArquivo;
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
    }
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

module.exports = router;