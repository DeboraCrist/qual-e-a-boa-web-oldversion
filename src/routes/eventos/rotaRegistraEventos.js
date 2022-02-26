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
const {Estabelecimento} = require("../../../models/Estabelecimento");

//meus middlewares
const verificaEstabelecimentoLogado = require("../../middlewares/confirmaEstabelecimentoLogado");

router.post("/registraEvento", verificaEstabelecimentoLogado, upload.single('urlImagemLocal'), async (req, res) => {
    const img = saltedMd5(req.file.originalname, 'SUPER-S@LT!');
    const formatoDoArquivo = path.extname(req.file.originalname);

    if (formatoDoArquivo != ".png" && formatoDoArquivo != ".jpeg" && formatoDoArquivo != ".jpg") {
        alertas.push({msg: "Não Aceitamos esse formato de arquivo"});
        res.redirect("/eventos/ativos");
    } else {
        const nomeImg = img + formatoDoArquivo;
        app.locals.bucket.file(nomeImg).createWriteStream().end(req.file.buffer);

        const dadosLoginId = await Estabelecimento.findOne({
            where: {
                id: req.session.dadosLogin.id
            }
        });
    
        await delay(4000);
    
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
    }
});

module.exports = router;