const express = require("express");
const router = express.Router();
const criptografia = require("../scripts/criptografia");
const session = require("express-session");

const {Pessoa} = require("../../models/Pessoa")
const {Estabelecimento} = require("../../models/Estabelecimento");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

router.use(session({
    secret: "wkndawdnwouidnawdnawonds", //é uma chave que cria uma sessão
    resave: true,
    saveUninitialized: true,
}));

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
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;