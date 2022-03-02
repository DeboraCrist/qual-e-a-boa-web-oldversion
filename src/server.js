const express = require("express");
const server = express();
const port = 3000;
const path = require("path");
const session = require("express-session");

const registroRota = require("./routes/rotaRegistro");
const pessoaRota = require("./routes/rotaPessoa");
const estabelecimentoRota = require("./routes/rotaEstabelecimento");
const loginRota = require("./routes/rotaLogin");
const buscaEventosRota = require("./routes/eventos/rotaBuscaEventos");
const editaEventosRota = require("./routes/eventos/rotaEditaEventos");
const registraEventoRota = require("./routes/eventos/rotaRegistraEventos");
const agendaRota = require("./routes/rotaAgenda");
const homeRota = require("./routes/rotaHome");
const termosRota = require("./routes/rotaTermos");
const sobreNosRota = require("./routes/rotaSobre");

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
server.use(registraEventoRota);
server.use(editaEventosRota);
server.use(buscaEventosRota);
server.use(agendaRota);
server.use(homeRota);
server.use(termosRota);
server.use(sobreNosRota);

server.listen(port, () => console.log("Servidor rodando na porta "+ port));