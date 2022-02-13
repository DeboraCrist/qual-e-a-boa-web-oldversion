const express = require("express");
const router = express.Router();
const multer = require("multer");

const bodyParser = require("body-parser");
const {Pessoa} = require("../../models/Pessoa");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const upload = multer({storage:multer.memoryStorage()});

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
    dadoUser.AtualizarDadosUser(
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
             
        },{
            where: email = "testeEditar@gmail.com"
        }
    )
});

router.post("/atualizarPassaporte", verificaPessoaLogada, upload.single('fotoPassaporte'), (req, res) => {
    const imagemPassaporte = req.file.buffer.toString("base64");

    Pessoa.update(
        {
            passaPorte: imagemPassaporte,
        }, {
            where: {id: req.session.dadosLogin.id}
        }
    ).then(() => {
        res.redirect("/usuarioCliente");
    }).catch((erro) => {
        console.log(erro);
        res.redirect("/usuarioCliente");
    })
});

module.exports = router;

