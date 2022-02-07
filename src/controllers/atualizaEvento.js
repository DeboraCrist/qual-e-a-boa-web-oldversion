const atualizaEvento = (idEvento, novosDadosEvento) => {
    const {Evento} = require("../../models/Evento");

    Evento.update(
        {   
            titulo: novosDadosEvento.nomeEvento,
            urlImagem: novosDadosEvento.urlImagemLocal,
            cidade: novosDadosEvento.cidade,
            estado: novosDadosEvento.estado,
            cep: novosDadosEvento.cep,
            tipoDeEvento: novosDadosEvento.tipoEvento,
            horaDoEvento: novosDadosEvento.horario,
            capacidade: novosDadosEvento.capacidadePessoa,
            dataDoEvento: novosDadosEvento.novaData,
            valorEntrada: novosDadosEvento.novoValor
        },
        {where: {id: idEvento}}
    );
};

module.exports = atualizaEvento;