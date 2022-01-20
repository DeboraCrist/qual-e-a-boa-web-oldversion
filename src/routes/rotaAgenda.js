const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
const {Pessoa} = require("../models/Pessoa");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

//meus middlewares
function verificaUsuarioLogado(req, res, next) {
    if (!req.session.dadosLogin) {
        return res.redirect("/login");
    }

    return next()
}

router.get("/agenda", verificaUsuarioLogado, (req, res) => {
    res.render("agenda.html", {dadosLogin: req.session.dadosLogin})
});

module.exports = router;