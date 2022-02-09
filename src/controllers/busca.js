let link = document.getElementById("link-estado");
let linkBuscaNome = document.getElementById("link-busca-nome");

const buscaEstado = () => {
    var selecionaEstado = document.getElementById("exampleFormControlSelect1");
    var estadoSelecionado = selecionaEstado.options[selecionaEstado.selectedIndex].value;

    link.href = "/eventos/encerrados/busca/"+ estadoSelecionado;
};

const buscaNome = () => {
    var nome = document.getElementById("nome").value

    linkBuscaNome.href = "/eventos/encerrados/buscaNome/"+ nome;
}

document.getElementById("buscarbtn").addEventListener("click", buscaEstado);
document.getElementById("botaoBusca").addEventListener("click", buscaNome);