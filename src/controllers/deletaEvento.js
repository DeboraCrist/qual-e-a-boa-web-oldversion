const link = document.getElementById("deletarEvento");

const deletaEvento = async () => {
    var selecionaEvento = document.getElementById("selecionaEvento");
    var eventoSelecionado = selecionaEvento.options[selecionaEvento.selectedIndex].value;

    link.href = "/deletarEvento/" + eventoSelecionado;
}

document.getElementById("botaoDeletar").addEventListener("click", deletaEvento)