/**Rotas que possuem ligação com registro de cliente / estabelecimento */
const express = require("express");
const router = express.Router();

const {Pessoa} = require("../models/Pessoa.js")
const {RegistraPessoaNaTabela} = require("../models/Pessoa.js");

const {Estabelecimento} = require("../models/Estabelecimento.js");
const {RegistraEstabelecimentoNaTabela} = require("../models/Estabelecimento.js")

const validaSintaxeEmail = require("../scripts/validaSintaxeEmail.js");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

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
    res.redirect("/login");
});

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
    res.redirect("/login");

});

module.exports = router;