const express = require("express");
const router = express.Router();
const criptografia = require("../scripts/criptografia");
const session = require("express-session");

const {Pessoa} = require("../../models/Pessoa")
const {Estabelecimento} = require("../../models/Estabelecimento");

let erros = [];

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

router.use(session({
    secret: "wkndawdnwouidnawdnawonds", //é uma chave que cria uma sessão
    resave: true,
    saveUninitialized: true,
}));

router.get("/login", (req, res) => {
    res.render("login.html", {erros: erros});
    erros.pop();
});

router.post("/login", async (req, res) => {
    const dadosLogin = await Estabelecimento.findOne({
        where: {
            email: req.body.email,
            senha: criptografia.criptografar(req.body.senha)
        }
    });

    const dadosLoginCliente = await Pessoa.findOne({
        where: {
            email: req.body.email,
            senha: criptografia.criptografar(req.body.senha)
        }
    });

    console.log(dadosLogin + "|" + dadosLoginCliente );
    if (dadosLogin != null) {
        req.session.dadosLogin = dadosLogin;
        res.redirect("/usuarioEstabelecimento");
    } else if (dadosLoginCliente != null) {
        req.session.dadosLogin = dadosLoginCliente;
        res.redirect("/usuarioCliente");
    } else {
        erros.push({msg: "Email ou Senha Incorretos"})
        console.log("Senha ou Email incorretos");
        res.redirect("/login");
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;