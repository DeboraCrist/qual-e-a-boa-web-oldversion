  
  function InforUsuario() {
      //utilizado para não recarregar a pagina 
      event.preventDefault()
  
      let url = "localhost:8081"
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