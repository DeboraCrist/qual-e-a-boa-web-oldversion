const express = require("express");
const server = express();
const port = 3000;
const router = require("./routes");
const path = require("path");

server.use(express.static(path.join(__dirname, "styles")));
server.use(express.static(path.join(__dirname, "images")));

server.use(router);

server.listen(port, () => console.log("Servidor rodando na porta "+ port));