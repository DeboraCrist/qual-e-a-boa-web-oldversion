/**Rotas que possuem ligação com registro de cliente / estabelecimento */
require('dotenv').config()
const express = require("express");
const app = express();
const saltedMd5 = require('salted-md5');
const router = express.Router();
const path = require("path");
const multer = require("multer");
const {getStorage, ref, getDownloadURL } = require("firebase/storage");
const firebase = require("../services/firebase");

const {Pessoa} = require("../../models/Pessoa")
const {RegistraPessoaNaTabela} = require("../controllers/registraPessoaNaTabela");

const {Estabelecimento} = require("../../models/Estabelecimento");
const {RegistraEstabelecimentoNaTabela} = require("../controllers/registraEstabelecimento")

const validaSintaxeEmail = require("../scripts/validaSintaxeEmail.js");

var admin = require("firebase-admin");
var chaveDeServico = require("../chaveDeServico.json");
admin.initializeApp({
    credential: admin.credential.cert(chaveDeServico),
    storageBucket: process.env.BUCKET_URL
});
app.locals.bucket = admin.storage().bucket();
const upload = multer({storage: multer.memoryStorage()});

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let tempEmail;
let tempSenha;

router.get("/", (req, res) => {
    res.render("cadastro.html");
});

router.post("/", async (req, res) => {
    let erros = [];

    tempEmail = req.body.email;
    tempSenha = req.body.senha;

    if (validaSintaxeEmail(tempEmail)) {
        //verifica se esse email existe dentro da tabela de estabelecimentos
        const disponibilidadeEmailEstabelecimento = await Estabelecimento.findOne({where: {email: tempEmail}});
        //verifica se esse email existe dentro da tabela do cliente comuns
        const disponibilidateEmailCliente = await Pessoa.findOne({where: {email: tempEmail}});
        
        if (disponibilidadeEmailEstabelecimento != null || disponibilidateEmailCliente != null) {
            erros.push({msg: "O email informado ja esta em uso"});
            console.log("Email ja esta em uso ou a senha e muito curta");
            res.render("cadastro.html", {erros: erros});
        } else {
            res.render("maisCadastro.html", {email: tempEmail});
        }
    } else {
        erros.push({msg: "Email invalido"})
        res.render("cadastro.html", {erros});
    }
});

router.post("/adicionarPessoa", upload.fields([
    {
        name: "urlImagem", maxCount: 1
    }, {
        name: "passaPorte", maxCount: 1
    }
]),async (req, res) => {
    const imgPerfil = saltedMd5(req.files["urlImagem"][0].originalname, 'SUPER-S@LT!');
    const nomeImgPerfil = imgPerfil + "PerfilUser" + path.extname(req.files["urlImagem"][0].originalname);

    const imgPassaporteSanitario = saltedMd5(req.files["passaPorte"][0].originalname, 'SUPER-S@LT!');
    const nomeImgPassaporteSanitario = imgPassaporteSanitario + "PassaporteSanitario" + path.extname(req.files["passaPorte"][0].originalname);

    app.locals.bucket.file(nomeImgPerfil).createWriteStream().end(req.files["urlImagem"][0].buffer);
    app.locals.bucket.file(nomeImgPassaporteSanitario).createWriteStream().end(req.files["passaPorte"][0].buffer);

    const imagens = [nomeImgPerfil, nomeImgPassaporteSanitario];
    var urls = [];

    await delay(2000);
    var urlPerfil = "";
    var urlPassaporteSanitario = "";
    //PS VOU REMOVER O ADICIONAR DO PASSAPORTE SANITARIO DO REGISTRO E ADICIONAR NO PERFIL DO USER
    imagens.forEach((img) => {
        const storage = getStorage();
        getDownloadURL(ref(storage, img)).then((url) => {
            urls.push(url);
            if (urls.length == 2) {
                if (urls[0].search("PerfilUser")) {
                    urlPerfil = urls[0];
                    urlPassaporteSanitario = urls[1];
                } else {
                    urlPerfil = urls[1];
                    urlPassaporteSanitario = urls[0];
                }
                dadosPessoa = {
                    nomePessoa: req.body.nomePessoa,
                    sobreNome: req.body.sobreNome,
                    email: tempEmail,
                    senha: tempSenha,
                    urlImagem: urlPerfil,
                    passaPorte: urlPassaporteSanitario,
                    idadePessoa: req.body.idadePessoa,
                    dataNasc: req.body.dataNasc,
                    cidadePessoa: req.body.cidade,
                    estadoPessoa: req.body.estado,
                    cepPessoa: req.body.cep,
                    tipoDeConta: 0,
                    vacinas: req.body.selecionaVacina,
                }
                //manda o objeto que foi criado a cima para uma função que vai registrar esses estabelecimento na tabela
                RegistraPessoaNaTabela(dadosPessoa);
                tempEmail = "";
                tempSenha = "";
                res.redirect("/login");
            }
        }).catch((error) => {
            console.log(error);
            res.send(error)
        });
    });
    //quarda os dados de registro de pessoa em um objeto
});

router.post("/adicionarEstabelecimento", upload.single("urlImagemPerfil") ,async (req, res) => {
    const img = saltedMd5(req.file.originalname, 'SUPER-S@LT!');
    const nomeImg = img + path.extname(req.file.originalname);
    app.locals.bucket.file(nomeImg).createWriteStream().end(req.file.buffer);

    await delay(2000);

    const storage = getStorage();
    getDownloadURL(ref(storage, nomeImg)).then((url) => {
        dadosEstabelecimento = {
            nomeDono: req.body.nomeDono,
            nomeEstabelecimento: req.body.nomeEstabelecimento,
            email: tempEmail,
            senha: tempSenha,
            informacaoComplementar: req.body.infoComplementar,
            urlImagemLocal: "None",
            rua: req.body.rua,
            bairro: req.body.bairro,
            numero: req.body.numero,
            cidade: req.body.cidade,
            estado: req.body.estado,
            cep: req.body.cep,
            lotacaoMax: req.body.lotacaoMaxima,
            tipoDeConta: 1
        }
    
        //manda o objeto que foi criado a cima para uma função que vai registrar esses estabelecimento na tabela
        RegistraEstabelecimentoNaTabela(dadosEstabelecimento, url);
        tempEmail = "";
        tempSenha = "";
        res.redirect("/login");
    }).catch((error) => {
        console.log(error);
        res.send(error)
    });
});

module.exports = router;