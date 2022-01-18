const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

router.get("/usuarioCliente", (req, res) => {
    if (req.session.dadosLogin) {
        res.render("paginaInicialUsuario.html", {dadosLogin: req.session.dadosLogin});
    } else {
        res.redirect("/login");
    }
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
            nomeUsuario: req.body.nomeUsuario, 
        },{
            where: email = "teste@Editargmail.com"
        }
    )
});

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
            nomeUsuario: req.body.nomeUsuario, 
        },{
            where: email = "teste@Editargmail.com"
        }
    )
});

module.exports = router;