require('dotenv').config()
const express = require("express");
const app = express();
const saltedMd5 = require('salted-md5');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {getStorage, ref, getDownloadURL } = require("firebase/storage");
const firebase = require("../services/firebase");

const bodyParser = require("body-parser");
const {Pessoa} = require("../../models/Pessoa");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

var admin = require("firebase-admin");
app.locals.bucket = admin.storage().bucket();
const upload = multer({storage: multer.memoryStorage()});

let alertas = [];

//meus middlewares
const verificaPessoaLogada = require("../middlewares/confirmaPessoaLogada");

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

router.get("/usuarioCliente", verificaPessoaLogada,async (req, res) => {
    const dadosLogin = await Pessoa.findAll({
        where: {id: req.session.dadosLogin.id}
    });

    res.render("paginaInicialUsuario.html", {dadosLogin: dadosLogin[0], alertas: alertas});
    alertas = [];
});

router.post("/editaPerfilUser/:idPessoa", verificaPessoaLogada, (req, res) => {
    Pessoa.update(
        {
            nomePessoa: req.body.nome,
            sobreNome: req.body.sobrenome,
            cepPessoa: req.body.cep,
            cidadePessoa: req.body.cidade,
            estadoPessoa: req.body.estado,
            vacinas: req.body.selecionaVacina,
        }, {
            where: {id: req.session.dadosLogin.id}
        }
    ).then(() => {
        console.log("atualizado")
        res.redirect("/usuarioCliente");
    }).catch((erro) => {
        console.log(erro);
        alertas.push({msg: "Erro ao tentar atualizar os dados."})
        res.redirect("/usuarioCliente");
    });
});

router.post("/editarFotoPessoa", verificaPessoaLogada, upload.single('novaFoto'), async (req, res) => {
    const img = saltedMd5(req.file.originalname, 'SUPER-S@LT!');
    const formatoDoArquivo = path.extname(req.file.originalname);

    if (formatoDoArquivo != ".png" && formatoDoArquivo != ".jpeg" && formatoDoArquivo != ".jpg") {
        alertas.push({msg: "Não Aceitamos esse formato de arquivo"});
        res.redirect("/usuarioCliente");
    } else {
        const nomeImg = img + formatoDoArquivo;
        app.locals.bucket.file(nomeImg).createWriteStream().end(req.file.buffer);

        //delay para dar tempo da imagem ser sincronizanda dentro do firebase storage
        await delay(3000);

        const storage = getStorage();
        getDownloadURL(ref(storage, nomeImg)).then((url) => {
            Pessoa.update(
                {
                    urlImagem: url
                }, {
                    where: {id: req.session.dadosLogin.id}
                }
            ).then(() => {
                res.redirect("/usuarioCliente");
            }).catch((erro) => {
                alertas.push({msg: "Erro ao tentar atualizar a foto de perfil"});
                res.redirect("/usuarioCliente");
            });
        }).catch((error) => {
            console.log(error);
            res.send(error)
        });
    }
});

router.post("/atualizarPassaporte", verificaPessoaLogada, upload.single('fotoPassaporte'),async (req, res) => {
    const img = saltedMd5(req.file.originalname, 'SUPER-S@LT!');
    const formatoDoArquivo = path.extname(req.file.originalname);

    if (formatoDoArquivo != ".png" && formatoDoArquivo != ".jpeg" && formatoDoArquivo != ".jpg") {
        alertas.push({msg: "Não Aceitamos esse formato de arquivo"});
        res.redirect("/usuarioCliente");
    } else {
        const nomeImg = img + formatoDoArquivo;
        app.locals.bucket.file(nomeImg).createWriteStream().end(req.file.buffer);

        //delay para dar tempo da imagem ser sincronizanda dentro do firebase storage
        await delay(3000);

        const storage = getStorage();
        getDownloadURL(ref(storage, nomeImg)).then((url) => {
            Pessoa.update(
                {
                    passaPorte: url,
                }, {
                    where: {id: req.session.dadosLogin.id}
                }
            ).then(() => {
                res.redirect("/usuarioCliente");
            }).catch((erro) => {
                alertas.push({msg: "Erro ao tentar atualizar imagem de Passaporte."})
                res.redirect("/usuarioCliente");
            })
        }).catch((error) => {
            console.log(error);
            res.send(error)
        });
    }
});

module.exports = router;