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

//meus middlewares
const verificaPessoaLogada = require("../middlewares/confirmaPessoaLogada");
const e = require("express");

router.get("/usuarioCliente", verificaPessoaLogada,async (req, res) => {
    const dadosLogin = await Pessoa.findAll({
        where: {id: req.session.dadosLogin.id}
    });

    res.render("paginaInicialUsuario.html", {dadosLogin: dadosLogin[0]});
});

router.get("/paginaInicialUsuario"),async (req, res) =>{
    const dadosLogin =  await dadosUser.findOne({
            attributes: ['email'] ['senha'],
            where:{
                email: "testeEditar@gmail.com"
            }
    });
    res.render("paginaInicialUsuario.html", {dadosLogin: dadosLogin})
}


router.post("/atualizarPerfilUser",(req,res) => {
    Pessoa.update(
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
             
        }).then(() => {
            console.log("atualizado");
            res.redirect("/PefilUser/");
    }).catch((error) => {
            console.log("Erro: "+ error);
            res.redirect("/PefilUser/");
    });
});
router.post("/editaPerfilUser/:idPessoa", (req, res) => {
    const idPessoa = req.params.idPessoa;

<<<<<<< HEAD
    const novosDadosUser = {urlImagemUserPerfil ,nomeUsuario, sobreNomeUser, email, senha, cidade, estado, dataDeAniversario, urlImagemVacinaçao} = req.body

    atualizarPerfilUser(idPessoa, novosDadosUser);
    res.redirect("/PerfilUser/");
=======
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
        console.log(erro);
        res.redirect("/usuarioCliente");
    })
>>>>>>> c6694dce392ece50868b98d573181f22187be619
});

module.exports = router;

