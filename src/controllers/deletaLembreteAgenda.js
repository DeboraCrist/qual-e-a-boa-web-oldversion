const link = document.getElementById("deletarLembreteLink");

const deletaLembrete = async () => {
    var selecionaLembrete = document.getElementById("selecionaLembrete");
    var lembreteSelecionado = selecionaLembrete.options[selecionaLembrete.selectedIndex].value;

    link.href = "/deletarLembrete/" + lembreteSelecionado;
}

document.getElementById("botaoDeletar").addEventListener("click", deletaLembrete)