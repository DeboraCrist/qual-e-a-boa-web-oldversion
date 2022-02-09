const verificaValidadeEvento = async (idEstabelecimento) => {
    const {Evento} = require("../../models/Evento");

    var hoje = new Date();
    var dia = hoje.getDate();
    var mes = hoje.getMonth()+1;
    var ano = hoje.getFullYear();
    var hora = hoje.getHours();
    var minuto = hoje.getMinutes();
    var segundos = hoje.getSeconds();
    var horaAtual;

    if (mes < 10) {
        hoje = ano + "-0" + mes + "-" + dia;
    }
    if (dia < 10) {
        hoje = ano + "-" + mes + "-0" + dia;
    } 
    if (dia < 10 && mes < 10) {
        hoje = ano + "-0" + mes + "-0" + dia;
    } 

    if (hora < 10) {
        horaAtual = "0"+ hora + ":" + minuto + ":" + segundos;
    }
    if (minuto < 10) {
        horaAtual = hora + ":0" + minuto + ":" + segundos;
    }
    if (segundos < 10) {
        horaAtual = hora + ":" + minuto + ":0" + segundos;
    } 
     
    if (hora < 10 && minuto < 11 && segundos < 11) {
        horaAtual = "0" + hora + ":0" + minuto + ":0" + segundos;
    }

    console.log(hoje);
    console.log(">"+horaAtual);

    const eventos = await Evento.findAll({});

    console.log("ATE AQ OK")
    if (eventos.length == 0) {
        console.log("OII")
        return false;
    } else {
        for (var i = 0; i < eventos.length; i++) {
            console.log(eventos[i].horaDoEvento + " | " + horaAtual +"||||"+ eventos[i].dataDoEvento + " | " + hoje);
            if (eventos[i].dataDoEvento == hoje && eventos[i].horaDoEvento <= horaAtual) {
                //verifica se o evento ja passou da data e atualiza seu status para false indicando que o evento acabou
                Evento.update(
                    {   
                        statusEvento: false,
                    },
                    {where: {id: eventos[i].id}}
                ).then(() => {
                    //att deu certo
                    return true;
                }).catch((error) => {
                    //att deu errado
                    return false
                });

                return true;
            }
        }
    }
}

module.exports = verificaValidadeEvento;