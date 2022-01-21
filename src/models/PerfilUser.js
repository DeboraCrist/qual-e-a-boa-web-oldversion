const db = require("./db");
  function AtualizarDadosUser() {
      //utilizado para não recarregar a pagina 
      event.preventDefault()
  

      //captura um elemento html e as entradas 
      let nome = document.getElementById("name")
      let sobrenome = document.getElementById("name")

      
      let idade = document.getElementById("number")
      let data_de_aniversario = document.getElementById("data")
      let cidade = document.getElementById("name")
      let estado = document.getElementById("name")
      

      console.log(idade)
      console.log(data_de_aniversario)
      console.log(cidade)
      console.log(estado)
    
  //Um objeto javascrit que enviado ao servidor 
        body = {
          "name": nome,
          "sobrenome": sobrenome,

          "number": idade,
          "data_de_aniversario": data,
          "name": cidade,
          "name": estado,
          
      }
  
      fazPost(url, body)
  }
  const AtualizarDadosUser = (dadoUser)=> {
    dadoUser.AtualizarDadosUser({
            urlImagemUserPerfil: dadoUser.urlImagemUserPerfil,
            nomeUsuario: dadoUser.nomeUsuario,
            sobreNomeUser:dadoUser.sobreNomeUser,
            email: dadoUser.email,
            senha: dadoUser.senha,
            cidade:dadoUser.cidade,
            estado:dadoUser.estado,
            dataDeAniversario:dadoUser.dataDeAniversario,
            urlImagemVacinaçao:dadoUser.urlImagemVacinaçao,
            nomeUsuario: dadoUser.nomeUsuario, 
        }).then(() => {
            console.log("Atualizado");
        }).catch((error) => {
            console.log("Erro: "+ error);
        });
}
module.exports = {
  AtualizarDadosUser : AtualizarDadosUser,
}    