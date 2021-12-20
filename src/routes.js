const express = require("express");
const router = express.Router();
const path = require("path");
const criptografia = require("./scripts/criptografia");
const { criptografar } = require("./scripts/criptografia");

const Estabelecimento = require("./models/Estabelecimento");

/*Responsavel por pegar os dados vindo do client*/
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

//Rotas
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/views", "index.html"));
});

router.get("/registrarEstabelecimento", (req, res) => {
    res.sendFile(path.join(__dirname, "/views", "registro_estabelecimento.html"));
});

//sistema de login em desenvolvimento
router.post("/login", async (req, res) => {
    const dadosLogin = await Estabelecimento.findOne({
        attributes: ['senha'],
        where: {
            email: req.body.email
        }
    });
    console.log(dadosLogin.senha);
    if (dadosLogin != null) {
        var senhaDescriptografada = criptografia.descriptografar(dadosLogin.senha);
        if (senhaDescriptografada == req.body.senha) {
            res.sendFile(path.join(__dirname, "/views", "menuPrincipal.html"));
        }
    } else {
        console.log("Senha ou Email incorretos");
        res.redirect("/");
    }
});

//rota post responsavel por registrar os dados que forma coletados do front usando o body-parser no banco de dados (tabela de estabelecimento)
router.post("/adicionarEstabelecimento", async (req, res) => {
    const disponibilidadeEmail = await Estabelecimento.findOne({where: {email: req.body.email}});
    if (disponibilidadeEmail === null) {
        Estabelecimento.create({
            nomeDono: req.body.nomeDono,
            nomeEstabelecimento: req.body.nomeEstabelecimento,
            email: req.body.email,
            senha: criptografia.criptografar(req.body.senha),
            bio: req.body.bio,
            url_imagem: req.body.url_imagem,
            rua: req.body.rua,
            bairro: req.body.bairro,
            numero: req.body.numero,
            cidade: req.body.cidade,
            tipoDeConta: 1 //Define 1 pois é um user de estabelecimento
        }).then(() => {
            res.redirect("/");
        }).catch((error) => {
            console.log("Erro: "+ error);
        })
    } else {
        console.log("Email ja esta em uso ou a senha e muito curta");
        res.redirect("/registrarEstabelecimento");
    }
});

module.exports = router;