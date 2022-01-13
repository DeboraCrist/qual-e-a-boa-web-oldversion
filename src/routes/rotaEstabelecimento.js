const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

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

module.exports = router;