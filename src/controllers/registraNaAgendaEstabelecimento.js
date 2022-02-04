const registraNaAgendaEstabelecimento = (dadosEvento, idCriador) => {
    const {Agenda} = require("../../models/Agenda")

    Agenda.create({
        nome: dadosEvento.nome,
        data: dadosEvento.data,
        bio: dadosEvento.bio,
        idEstabelecimento: idCriador.id
    }).then(() => {
        console.log("Registrado");
    }).catch((error) => {
        console.log("Erro: "+ error);
    })
}

module.exports = {
    registraNaAgendaEstabelecimento: registraNaAgendaEstabelecimento,
}