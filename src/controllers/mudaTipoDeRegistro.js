const ativaCampoComercial = () => {
    let formularioComercial = document.querySelector("#formulario_comercial");
    let formularioCliente = document.querySelector("#formulario-pessoal");

    if (formularioComercial.style.display === "block") {
        formularioComercial.style.display = "none";
        formularioCliente.style.display = "block"
        
    } else {
        formularioComercial.style.display = "block";
        formularioCliente.style.display = "none"

    }
}

const ativaCampoPessoal= () => {
    let formularioComercial = document.querySelector("#formulario_comercial");
    let formularioCliente = document.querySelector("#formulario-pessoal");

    if (formularioCliente.style.display === "block") {
        formularioComercial.style.display = "block";
        formularioCliente.style.display = "none"
        
    } else {
        formularioComercial.style.display = "none";
        formularioCliente.style.display = "block"

    }
}

const opcaoComercial = document.getElementById("flexRadioDefault1").addEventListener('click', ativaCampoComercial);
const opcaoPessoal = document.getElementById("flexRadioDefault2").addEventListener('click', ativaCampoPessoal);