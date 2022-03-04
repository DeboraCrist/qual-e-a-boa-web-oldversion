let estado = document.getElementsByName("estado");
let cidade = document.getElementsByName("cidade");
let cep = document.getElementsByName("cep");
let index = 0;

const retornadadosCEP = (conteudo) => {
    if(conteudo.erro) {
        alert("CEP INVALIDO")
        for (index = 0; index < estado.length; index++) {
            estado[index].value=("...");
            cidade[index].value=("...");  
            cep[index].value=("");   
        }
        
    } else {
        for (index = 0; index < estado.length; index++) {
            estado[index].value=(conteudo.uf);
            cidade[index].value=(conteudo.localidade);
        }
    }
}

const consultarCEP = (cep) => {
    if (cep != "" || cep != null) {
        if (cep.length == 9 || cep.length == 8) {
            for (index = 0; index < estado.length; index++) {
                estado[index].value=("...");
                cidade[index].value=("...");   
            }

            let script = document.createElement("script");

            script.src = "https://viacep.com.br/ws/"+ cep + "/json/?callback=retornadadosCEP";

            document.body.appendChild(script);
        } else {
            alert("CEP INVALIDO")
            for (index = 0; index < estado.length; index++) {
                estado[index].value=("...");
                cidade[index].value=("...");
                cep[index].value=(""); 
            } 
        }
    } else {
        for (index = 0; index < estado.length; index++) {
            estado[index].value=("...");
            cidade[index].value=("...");   
            cep[index].value=(""); 
        }
    }
}