const express = require("express");
const router = express.Router();
const path = require("path");
const criptografia = require("./scripts/criptografia");

const { Estabelecimento } = require("./models/Estabelecimento");
const { RegistraEstabelecimentoNaTabela } = require("./models/Estabelecimento");

/*Responsavel por pegar os dados vindo do client*/
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

//Rotas
router.get("/", (req, res) => {
    res.render("cadastro.html");
});

router.get("/registrarEstabelecimento", (req, res) => {
    res.sendFile(path.join(__dirname, "/views", "registro_estabelecimento.html"));
});

router.get("/registro", (req, res) => {
    res.render("maisCadastro");
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
    //quarda os dados de registro de estabelecimento em um objeto
    dadosEstabelecimento = {
        nomeDono: req.body.nomeDono,
        nomeEstabelecimento: req.body.nomeEstabelecimento,
        email: req.body.email,
        senha: req.body.senha,
        bio: req.body.bio,
        url_imagem: req.body.url_imagem,
        rua: req.body.rua,
        bairro: req.body.bairro,
        numero: req.body.numero,
        cidade: req.body.cidade,
        tipoDeConta: 1
    }

    const disponibilidadeEmail = await Estabelecimento.findOne({where: {email: req.body.email}});
    if (disponibilidadeEmail === null) {
        //manda o objeto que foi criado a cima para uma função que vai registrar esses estabelecimento na tabela
        RegistraEstabelecimentoNaTabela(dadosEstabelecimento);
        res.redirect("/");
    } else {
        console.log("Email ja esta em uso ou a senha e muito curta");
        res.redirect("/registrarEstabelecimento");
    }
});

module.exports = router;