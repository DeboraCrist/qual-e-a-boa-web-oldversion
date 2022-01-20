const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const {Pessoa} = require("../models/Pessoa");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

//meus middlewares

//verifica que tipo de usuario esta logado
function verificaPessoaLogada (req, res, next) {
    if (!req.session.dadosLogin) {
        return res.redirect("/login");
    } else if (req.session.dadosLogin != "undefined" && req.session.dadosLogin.tipoDeConta == 1) {
        //a conta de estabelecimento não pode ter acesso a rota então quando tenta entrar ela é redirecionada pro perfil
        return res.redirect("/usuarioEstabelecimento");
    }

    return next();
}

router.get("/usuarioCliente", verificaPessoaLogada, (req, res) => {
    res.render("paginaInicialUsuario.html", {dadosLogin: req.session.dadosLogin});
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


module.exports = router;

