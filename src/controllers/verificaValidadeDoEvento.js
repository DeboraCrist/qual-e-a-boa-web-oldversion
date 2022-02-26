const verificaValidadeEvento = async (idEstabelecimento) => {
    const {Evento} = require("../../models/Evento");

    var hoje = new Date();
    var dia = hoje.getDate();
    var mes = hoje.getMonth()+1;
    var ano = hoje.getFullYear();
    var horaAtual = new Date(new Date().getTime() + 4*60*60*1000).toLocaleTimeString();

    if (mes < 10) {
        hoje = ano + "-0" + mes + "-" + dia;
    }
    if (dia < 10) {
        hoje = ano + "-" + mes + "-0" + dia;
    } 
    if (dia < 10 && mes < 10) {
        hoje = ano + "-0" + mes + "-0" + dia;
    }

    const eventos = await Evento.findAll({});
    if (eventos.length == 0) {
        return false;
    } else {
        for (var i = 0; i < eventos.length; i++) {
            console.log("Nome: "+ eventos[i].titulo + eventos[i].horaDoEvento + " | " + horaAtual +"||||"+ eventos[i].dataDoEvento + " | " + hoje);
            if (eventos[i].dataDoEvento <= hoje) {
                //verifica se o evento ja passou da data e atualiza seu status para false indicando que o evento acabou
                console.log(">>>Nome: "+ eventos[i].titulo);
                Evento.update(
                    {   
                        statusEvento: false,
                    },
                    {where: {id: eventos[i].id}}
                ).then(() => {
                    console.log("OK");
                }).catch((error) => {
                    console.log("ERRO: "+ error);
                });
            }
        }
    }
}

module.exports = verificaValidadeEvento;