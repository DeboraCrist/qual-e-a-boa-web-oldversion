const desmarcapresenca = async (idEvento) => {
    const {PessoaEvento} = require("../../models/pessoaEvento");
    const {Evento} = require("../../models/Evento");

    PessoaEvento.destroy({
        where: {
            idEventos: idEvento
        }
    })

    Evento.increment(
        "confirmacoes", {by: -1, where: {id: idEvento}}
    ).then(() => {
        console.log("DEU BOM")
    }).catch((error) => {
        console.log(error);
    });
}

module.exports = desmarcapresenca;