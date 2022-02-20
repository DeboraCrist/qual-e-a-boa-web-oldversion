const RegistraPessoaNaTabela = (dadosPessoa) => {
    const {Pessoa} = require("../../models/Pessoa");

    const criptografia = require("../scripts/criptografia");
    const {criptografar} = require("../scripts/criptografia");

    Pessoa.create({
        nomePessoa: dadosPessoa.nomePessoa,
        sobreNome: dadosPessoa.sobreNome,
        email: dadosPessoa.email,
        senha: criptografia.criptografar(dadosPessoa.senha),
        idadePessoa: dadosPessoa.idadePessoa,
        urlImagem: dadosPessoa.urlImagem,
        passaPorte: dadosPessoa.passaPorte,
        dataNasc: dadosPessoa.dataNasc,
        cidadePessoa: dadosPessoa.cidadePessoa,
        estadoPessoa: dadosPessoa.estadoPessoa,
        cepPessoa: dadosPessoa.cepPessoa,
        tipoDeConta: dadosPessoa.tipoDeConta, //Define 0 pois é um user de pessoa
        vacinas: dadosPessoa.vacinas,
    }).then(() => {
        console.log("deu bom");
    }).catch((error) => {
        console.log("Erro: "+ error);
    });
}

module.exports = {
    RegistraPessoaNaTabela: RegistraPessoaNaTabela,
};