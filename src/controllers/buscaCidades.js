/**Consulta em uma API do IBGE todos os municipios do estado selecionado */
let listaMunicipios = document.getElementById("exampleFormControlSelect2");
let link = document.getElementById("link-filtro");

const getUrl = (url) => {
    let req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send()
    return req.responseText;
}

const limpaOpcoesMunicipios = (elemento) => {
    while (elemento.lastChild) {
        elemento.removeChild(elemento.lastChild);
    }

}

const consultaEstados = () => {
    var selecionaEstado = document.getElementById("exampleFormControlSelect1");
    var estadoSelecionado = selecionaEstado.options[selecionaEstado.selectedIndex].value;

    if (estadoSelecionado == "Escolha o estado") {
        limpaOpcoesMunicipios(listaMunicipios);
        var vazio = new Option("...");
        listaMunicipios.appendChild(vazio);

    } else {
        dadoMunicipios = getUrl("https://servicodados.ibge.gov.br/api/v1/localidades/estados/"+ estadoSelecionado +"/municipios");
        municipios = JSON.parse(dadoMunicipios);

        limpaOpcoesMunicipios(listaMunicipios);

        for(var contador = 0; contador < municipios.length; contador++) {

            var municipioOpcao = new Option(municipios[contador].nome);
            listaMunicipios.appendChild(municipioOpcao);
        }

    }
}

const busca = () => {
    var selecionaEstado = document.getElementById("exampleFormControlSelect1");
    var estadoSelecionado = selecionaEstado.options[selecionaEstado.selectedIndex].value;

    var selecionaCidade = document.getElementById("exampleFormControlSelect2");
    var cidadeSelecionada = selecionaCidade.options[selecionaCidade.selectedIndex].value;

    link.href = "/eventos/"+ estadoSelecionado +"/"+ cidadeSelecionada +""
}

document.getElementById("exampleFormControlSelect1").addEventListener('click', consultaEstados);
document.getElementById("botaoDeBusca").addEventListener('click', busca)