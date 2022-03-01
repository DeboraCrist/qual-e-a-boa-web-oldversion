const express = require("express");
const router = express.Router();

router.get("/termosDeUso", (req, res) => {
    res.render("termosDeUso.html");
});

router.get("/politicas", (req, res) => {
    res.render("politicaDePrivacidade.html");
})

module.exports = router;