const marcaPresencaEvento = async (idEvento, idPessoaLogada) => {
    const {Pessoa} = require("../../models/Pessoa");
    const {PessoaEvento} = require("../../models/pessoaEvento");
    const {Evento} = require("../../models/Evento");

    const dadosLoginId = await Pessoa.findOne({
        where: {
            id: idPessoaLogada
        }
    });

    PessoaEvento.create({
        idPessoa: dadosLoginId.id,
        idEventos: idEvento
    })

    Evento.increment(
        "confirmacoes", {by: 1, where: {id: idEvento}}
    ).then(() => {
        console.log("DEU BOM");
    }).catch((error) => {
        console.log(error);
    });
}

module.exports = marcaPresencaEvento;