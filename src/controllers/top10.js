const top10Eventos = (todosEventos) => {
    var listaTop10 = [];

    for (var i = 0; i < todosEventos.length; i++) {
        listaTop10.push(todosEventos[i]);
    }

    var i, j, min, aux;
    for (i = 0; i < listaTop10.length; i++) {
        min = i;
        for (j = i+1; j < listaTop10.length; j++) {
            if(listaTop10[j].confirmacoes < listaTop10[min].confirmacoes) {
                min = j;
            }
        }

        if (i != min) {
            aux = listaTop10[i];
            listaTop10[i] = listaTop10[min];
            listaTop10[min] = aux;
        }
    }

    listaTop10 = listaTop10.reverse();
    
    return listaTop10;
};

module.exports = top10Eventos;