/** Contem as rotas relacionadas a evento */
const express = require("express");
const router = express.Router();

const top10Eventos = require("../controllers/top10");

const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

const Evento = require("../models/Evento");
//meus middlewares
function verificaUsuarioLogado(req, res, next) {
    if (!req.session.dadosLogin) {
        return res.redirect("/login");
    }

    return next()
}