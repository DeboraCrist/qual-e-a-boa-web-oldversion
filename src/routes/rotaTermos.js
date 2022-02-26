const express = require("express");
const router = express.Router();

router.get("/ola", (req, res) => {
    res.send("Ola");
})

module.exports = router;