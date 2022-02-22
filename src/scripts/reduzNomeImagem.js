const reduzNomeImagem = (nome) => {
    aux = nome.indexOf("s/");
    return nome.slice(aux+2, nome.length);
}

module.exports = reduzNomeImagem;