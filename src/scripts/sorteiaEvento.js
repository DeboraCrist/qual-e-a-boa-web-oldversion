const sorteiaEvento = (eventos) => {
    const posicaoSorteada = Math.floor(Math.random() * (eventos.length - 0)) + 0;

    return eventos[posicaoSorteada].id;
}

module.exports = sorteiaEvento;