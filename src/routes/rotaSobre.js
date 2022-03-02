const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

router.get("/sobrenos", (req, res) => {
    res.render("sobrenos.html", {dadosLogin: req.session.dadosLogin})
})

module.exports = router;