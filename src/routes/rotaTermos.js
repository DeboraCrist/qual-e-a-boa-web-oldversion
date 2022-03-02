const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

router.get("/termosDeUso", (req, res) => {
    res.render("termosDeUso.html", {dadosLogin: req.session.dadosLogin});
});

router.get("/politicas", (req, res) => {
    res.render("politicaDePrivacidade.html", {dadosLogin: req.session.dadosLogin});
})

module.exports = router;