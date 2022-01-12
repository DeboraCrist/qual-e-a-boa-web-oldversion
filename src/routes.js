const express = require("express");
const router = express.Router();
const path = require("path");
const criptografia = require("./scripts/criptografia");
const session = require("express-session");

const { Estabelecimento } = require("./models/Estabelecimento");
const { RegistraEstabelecimentoNaTabela } = require("./models/Estabelecimento");
const { Pessoa } = require("./models/Pessoa");
const { RegistraPessoaNaTabela } = require("./models/Pessoa");
const validaSintaxeEmail = require("./scripts/validaSintaxeEmail");

/*Responsavel por pegar os dados vindo do client*/
const bodyParser = require("body-parser");
const { render } = require("express/lib/response");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

let tempEmail = "";
let tempSenha = "";

router.use(session({
    secret: "wkndawdnwouidnawdnawonds", //é uma chave que cria uma sessão
    resave: true,
    saveUninitialized: true,
}));

//Rotas
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

//sistema de login em desenvolvimento
router.post("/login", async (req, res) => {
    const dadosLogin = await Estabelecimento.findOne({
        where: {
            email: req.body.email
        }
    });

    const dadosLoginCliente = await Pessoa.findOne({
        where: {
            email: req.body.email
        }
    });

    if (dadosLogin != null) {
        var senhaDescriptografada = criptografia.descriptografar(dadosLogin.senha);
        if (senhaDescriptografada == req.body.senha) {
            req.session.dadosLogin = dadosLogin;
            res.redirect("/usuarioEstabelecimento");
        }
    } else if (dadosLoginCliente != null) {
        var senhaDescriptografada2 = criptografia.descriptografar(dadosLoginCliente.senha);

        if (senhaDescriptografada2 == req.body.senha) {
            req.session.dadosLogin = dadosLoginCliente;
            res.redirect("/usuarioCliente");
        }
    } else {
        console.log("Senha ou Email incorretos");
        res.redirect("/login");
    }
});

router.get("/login", (req, res) => {
    res.render("login.html");
})

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
    res.redirect("/login");

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

router.get("/paginaInicialUsuario"),async (req, res) =>{
    const dadosLogin =  await dadosUser.findOne({
            attributes: ['email'] ['senha'],
            where:{
                email: "teste@Editargmail.com"
            }
    });
    res.render("paginaInicialUsuario.html", {dadosLogin: dadosLogin})

}
router.post("/atualizarPerfilUser",(req,res) => {
    dadoUser.update(
        {
            urlImagemUserPerfil: req.body.urlImagemUserPerfil,
            nomeUsuario: req.body.nomeUsuario,
            sobreNomeUser:req.body.sobreNomeUser,
            email: req.body.email,
            senha: req.body.senha,
            cidade:req.body.cidade,
            estado:req.body.estado,
            dataDeAniversario:req.body.dataDeAniversario,
            urlImagemVacinaçao:req.body.urlImagemVacinaçao,
            nomeUsuario: req.body.nomeUsuario, 
        },{
            where: email = "teste@Editargmail.com"
        }
    )
});

router.get("/usuarioCliente", (req, res) => {
    if (req.session.dadosLogin) {
        res.render("paginaInicialUsuario.html", {dadosLogin: req.session.dadosLogin});
    } else {
        res.redirect("/login");
    }
})

router.get("/usuarioEstabelecimento", (req, res) => {
    if (req.session.dadosLogin) {
        res.render('paginaInicialComercial.html', {dadosLogin: req.session.dadosLogin});
    } else {
        res.redirect("/login");
    }
});

router.get("/editarEstabelecimento", (req, res) => {
    if (req.session.dadosLogin) {
        res.render('editaEstabelecimento.html', {dadosLogin: req.session.dadosLogin});
    } else {
        res.redirect("/login");
    }
});

router.post("/editarEstabelecimento", (req, res) => {

});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;