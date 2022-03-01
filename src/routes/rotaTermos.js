const express = require("express");
const router = express.Router();

router.get("/termosDeUso", (req, res) => {
    res.render("termosDeUso.html");
})

module.exports = router;