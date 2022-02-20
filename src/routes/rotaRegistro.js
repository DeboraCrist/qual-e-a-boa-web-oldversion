/**Rotas que possuem ligação com registro de cliente / estabelecimento */
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const reduzNomeImagem = require("../scripts/reduzNomeImagem")

const {Pessoa} = require("../../models/Pessoa")
const {RegistraPessoaNaTabela} = require("../controllers/registraPessoaNaTabela");

const {Estabelecimento} = require("../../models/Estabelecimento");
const {RegistraEstabelecimentoNaTabela} = require("../controllers/registraEstabelecimento")

const validaSintaxeEmail = require("../scripts/validaSintaxeEmail.js");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const armazenamento = multer.diskStorage({
    destination: (req, arquivo, cb) => {
        cb(null, "src/enviadas/");
    },
    filename: (req, arquivo, cb) => {
        console.log(arquivo);
        cb(null, Date.now() + path.extname(arquivo.originalname));
    }
});

const upload = multer({storage: armazenamento});

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
    const imagemPerfil = req.files["urlImagem"][0].path;
    const passaporteSanitario = req.files["passaPorte"][0].path;

    nomeImagemPerfil = reduzNomeImagem(imagemPerfil);
    nomeImagemPassaporte = reduzNomeImagem(passaporteSanitario);

    //quarda os dados de registro de pessoa em um objeto
    console.log(tempEmail);
    dadosPessoa = {
        nomePessoa: req.body.nomePessoa,
        sobreNome: req.body.sobreNome,
        email: tempEmail,
        senha: tempSenha,
        urlImagem: nomeImagemPerfil,
        passaPorte: nomeImagemPassaporte,
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
});

router.post("/adicionarEstabelecimento", upload.single("urlImagemPerfil") ,async (req, res) => {
    const image = req.file.path;
    nomeImagem = reduzNomeImagem(image);

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
    RegistraEstabelecimentoNaTabela(dadosEstabelecimento, nomeImagem);
    tempEmail = "";
    tempSenha = "";
    res.redirect("/login");
});

module.exports = router;