const express = require("express");
const server = express();
const port = 3000;
const path = require("path");
const session = require("express-session");

const registroRota = require("./routes/rotaRegistro");
const pessoaRota = require("./routes/rotaPessoa");
const estabelecimentoRota = require("./routes/rotaEstabelecimento");
const loginRota = require("./routes/rotaLogin");
const eventoRota = require("./routes/rotaEvento");
const agendaRota = require("./routes/rotaAgenda");

server.use(session({
    secret: "wkndawdnwouidnawdnawonds", //é uma chave que cria uma sessão
    resave: true,
    saveUninitialized: true,
}));

server.engine('html', require('ejs').renderFile);
server.set('view engine', 'html');
server.set('views', path.join(__dirname, '/views'));

//responsavel por entregar os arquivos estaticos
server.use(express.static(path.join(__dirname, "styles"))); //local dos styles
server.use(express.static(path.join(__dirname, "images"))); //local das imgs
server.use(express.static(path.join(__dirname, "enviadas")));
server.use(express.static(path.join(__dirname, "controllers"))); //local dos controllers
server.use(express.static(path.join(__dirname, "models")));

server.use(registroRota);
server.use(pessoaRota);
server.use(estabelecimentoRota);
server.use(loginRota);
server.use(eventoRota);
server.use(agendaRota);


server.listen(port, () => console.log("Servidor rodando na porta "+ port));