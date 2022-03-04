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

const {Pessoa} = require("../../models/Pessoa");
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

let erros = [];

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const validaCidadeEstado = (cidade, estado) => {
    if (cidade == "..." || estado == "...") {
        return false;
    } else {
        return true;
    }
}

let tempEmail;
let tempSenha;

router.get("/", (req, res) => {
    res.render("cadastro.html", {erros});
    erros = [];
});

router.post("/", async (req, res) => {
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
    const paginaAnterior = req.header("Referer") || "/";
    var nomeImgPassaporteSanitario = "";
    var temPassaporte = false;
    const imagens = [];
    
    const imgPerfil = saltedMd5(req.files["urlImagem"][0].originalname, 'SUPER-S@LT!');
    const nomeImgPerfil = imgPerfil + "PerfilUser" + path.extname(req.files["urlImagem"][0].originalname);
    imagens.push(nomeImgPerfil);

    if (req.files["passaPorte"] == undefined) {
        nomeImgPassaporteSanitario = "https://triunfo.pe.gov.br/pm_tr430/wp-content/uploads/2018/03/sem-foto.jpg";
    } else {
        var imgPassaporteSanitario = saltedMd5(req.files["passaPorte"][0].originalname, 'SUPER-S@LT!');
        nomeImgPassaporteSanitario = imgPassaporteSanitario + "PassaporteSanitario" + path.extname(req.files["passaPorte"][0].originalname);
        app.locals.bucket.file(nomeImgPassaporteSanitario).createWriteStream().end(req.files["passaPorte"][0].buffer);
        imagens.push(nomeImgPassaporteSanitario);
        temPassaporte = true;
    }

    app.locals.bucket.file(nomeImgPerfil).createWriteStream().end(req.files["urlImagem"][0].buffer);
    var urls = [];

    await delay(2000);
    var urlPerfil = "";
    var urlPassaporteSanitario = "";

    if (!validaCidadeEstado(req.body.cidade, req.body.estado)) {
        erros.push({msg: "ERRO ao registrar conta: CIDADE ou Estado invalido"});
        res.redirect(paginaAnterior);
    }

    imagens.forEach((img) => {
        const storage = getStorage();
        getDownloadURL(ref(storage, img)).then((url) => {
            urls.push(url);
            if (!temPassaporte) {
                urls.push(nomeImgPassaporteSanitario);
            }
            if (urls.length == 2) {
                console.log(urls);
                if (urls[0].indexOf("PerfilUser" != -1)) {
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
});

router.post("/adicionarEstabelecimento", upload.single("urlImagemPerfil") ,async (req, res) => {
    const img = saltedMd5(req.file.originalname, 'SUPER-S@LT!');
    const formatoDoArquivo = path.extname(req.file.originalname);
    const paginaAnterior = req.header("Referer") || "/";

    if (!validaCidadeEstado(req.body.cidade, req.body.estado)) {
        erros.push({msg: "ERRO ao registrar conta: CIDADE ou Estado invalido"});
        res.redirect(paginaAnterior);
    }

    if (formatoDoArquivo != ".png" && formatoDoArquivo != ".jpeg" && formatoDoArquivo != ".jpg") {
        erros.push({msg: "Não Aceitamos esse formato de arquivo"});
        res.redirect(paginaAnterior);
    } else {
        const nomeImg = img + formatoDoArquivo;
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
    }
});

module.exports = router;