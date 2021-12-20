const express = require("express");
const server = express();
const port = 3000;
const router = require("./routes");
const path = require("path");

//responsavel por entregar os arquivos estaticos
server.use(express.static(path.join(__dirname, "styles"))); //local dos styles
server.use(express.static(path.join(__dirname, "images"))); //local das imgs

server.use(router);

server.listen(port, () => console.log("Servidor rodando na porta "+ port));