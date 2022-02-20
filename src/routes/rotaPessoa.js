const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const reduzNomeImagem = require("../scripts/reduzNomeImagem")

const bodyParser = require("body-parser");
const {Pessoa} = require("../../models/Pessoa");
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

let alertas = [];

//meus middlewares
const verificaPessoaLogada = require("../middlewares/confirmaPessoaLogada");

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
        res.redirect("/login");
    }).catch((erro) => {
        console.log(erro);
        alertas.push({msg: "Erro ao tentar atualizar os dados."})
        res.redirect("/usuarioCliente");
    });
});

router.post("/editarFotoPessoa", verificaPessoaLogada, upload.single('novaFoto'), (req, res) => {
    const image = req.file.path;
    nomeImagem = reduzNomeImagem(image);

    Pessoa.update(
        {
            urlImagem: nomeImagem
        }, {
            where: {id: req.session.dadosLogin.id}
        }
    ).then(() => {
        res.redirect("/usuarioCliente");
    }).catch((erro) => {
        alertas.push({msg: "Erro ao tentar atualizar a foto de perfil"});
        res.redirect("/usuarioCliente");
    });
});

router.post("/atualizarPassaporte", verificaPessoaLogada, upload.single('fotoPassaporte'), (req, res) => {
    const imagemPassaporte = req.file.path;
    const nomeImagemPassaporte = reduzNomeImagem(imagemPassaporte);

    Pessoa.update(
        {
            passaPorte: nomeImagemPassaporte,
        }, {
            where: {id: req.session.dadosLogin.id}
        }
    ).then(() => {
        res.redirect("/usuarioCliente");
    }).catch((erro) => {
        alertas.push({msg: "Erro ao tentar atualizar imagem de Passaporte."})
        res.redirect("/usuarioCliente");
    })
});

module.exports = router;