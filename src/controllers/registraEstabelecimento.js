const RegistraEstabelecimentoNaTabela = (dadosEstabelecimento, image) => {
    const {Estabelecimento} = require("../../models/Estabelecimento");

    const criptografia = require("../scripts/criptografia");
    const {criptografar} = require("../scripts/criptografia");

    Estabelecimento.create({
        nomeDono: dadosEstabelecimento.nomeDono,
        nomeEstabelecimento: dadosEstabelecimento.nomeEstabelecimento,
        email: dadosEstabelecimento.email,
        senha: criptografia.criptografar(dadosEstabelecimento.senha),
        informacaoComplementar: dadosEstabelecimento.informacaoComplementar,
        urlImagemPerfil: image,
        urlImagemLocal: dadosEstabelecimento.urlImagemLocal,
        rua: dadosEstabelecimento.rua,
        bairro: dadosEstabelecimento.bairro,
        numero: dadosEstabelecimento.numero,
        cidade: dadosEstabelecimento.cidade,
        estado: dadosEstabelecimento.estado,
        cep: dadosEstabelecimento.cep,
        lotacaoMax: dadosEstabelecimento.lotacaoMax,
        tipoDeConta: dadosEstabelecimento.tipoDeConta //Define 1 pois é um user de estabelecimento
    }).then(() => {
        console.log("Registrado");
    }).catch((error) => {
        console.log("Erro: "+ error);
    });
}

module.exports = {
    RegistraEstabelecimentoNaTabela: RegistraEstabelecimentoNaTabela
}