const registraNaAgendaPessoa = (dadosEvento, idCriador) => {
    const {Agenda} = require("../../models/Agenda")

    Agenda.create({
        nome: dadosEvento.nome,
        data: dadosEvento.data,
        bio: dadosEvento.bio,
        idPessoa: idCriador.id
    }).then(() => {
        console.log("Registrado");
    }).catch((error) => {
        console.log("Erro: "+ error);
    })
}

module.exports = {
    registraNaAgendaPessoa: registraNaAgendaPessoa,
}