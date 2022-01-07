const express = require("express");
const router = express.Router();
const path = require("path");
const criptografia = require("./scripts/criptografia");

const { Estabelecimento } = require("./models/Estabelecimento");
const { RegistraEstabelecimentoNaTabela } = require("./models/Estabelecimento");
const { Pessoa } = require("./models/Pessoa");
const { RegistraPessoaNaTabela } = require("./models/Pessoa");
const validaSintaxeEmail = require("./scripts/validaSintaxeEmail");

/*Responsavel por pegar os dados vindo do client*/
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

let tempEmail = "";
let tempSenha = "";

//Rotas
router.get("/", (req, res) => {
    res.render("cadastro.html");
});

router.post("/registro", async (req, res) => {
    tempEmail = req.body.email;
    tempSenha = req.body.senha;

    if (validaSintaxeEmail(tempEmail)) {
        //verifica se esse email existe dentro da tabela de estabelecimentos
        const disponibilidadeEmailEstabelecimento = await Estabelecimento.findOne({where: {email: tempEmail}});
        //verifica se esse email existe dentro da tabela do cliente comuns
        const disponibilidateEmailCliente = await Pessoa.findOne({where: {email: tempEmail}});
        
        if (disponibilidadeEmailEstabelecimento != null || disponibilidateEmailCliente != null) {
            console.log("Email ja esta em uso ou a senha e muito curta");
            res.redirect("/");
        } else {
            res.render("maisCadastro.html", {email: tempEmail});
        }
    } else {
        console.log("Sintaxe de email invalida");
        res.redirect("/");
    }
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
    console.log(tempEmail);
    dadosEstabelecimento = {
        nomeDono: req.body.nomeDono,
        nomeEstabelecimento: req.body.nomeEstabelecimento,
        email: tempEmail,
        senha: tempSenha,
        informacaoComplementar: req.body.infoComplementar,
        urlImagemPerfil: req.body.urlImagemPerfil,
        urlImagemLocal: req.body.urlImagemLocal,
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
    RegistraEstabelecimentoNaTabela(dadosEstabelecimento);
    tempEmail = "";
    tempSenha = "";
    res.redirect("/");

});


router.post("/adicionarPessoa", async (req, res) => {
    //quarda os dados de registro de pessoa em um objeto
    console.log(tempEmail);
    dadosPessoa = {
        nomePessoa: req.body.nomePessoa,
        sobreNome: req.body.sobreNome,
        email: tempEmail,
        senha: tempSenha,
        urlImagem: req.body.urlImagem,
        passaPorte: req.body.passaPorte,
        idadePessoa: req.body.idadePessoa,
        dataNasc: req.body.dataNasc,
        cidadePessoa: req.body.cidade,
        estadoPessoa: req.body.estado,
        cepPessoa: req.body.cep,
        tipoDeConta: 0
    }

    console.log(req.body.cidade);
    console.log(req.body.estado);

    //manda o objeto que foi criado a cima para uma função que vai registrar esses estabelecimento na tabela
    RegistraPessoaNaTabela(dadosPessoa);
    tempEmail = "";
    tempSenha = "";
    res.redirect("/");
});

module.exports = router;