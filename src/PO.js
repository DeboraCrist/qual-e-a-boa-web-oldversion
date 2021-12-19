//local aonde e feita a criação/abertura/envio do request
function fazPost(url, body){
    let request = new XMLHttpRequest()
    request.open("POST",url,true)
    request.setRequestHeader("Content-type","application/json")//um cabeçalho da requisição que mostra o que esta sendo enviado 
    request.send(JSON.stringify(body))
  
  //vai printar na tela o conteudo que sera retorndado
    request.onload = function(){
          console.log(this.responseText)
    }
    return request.responseText
  }
  
  function InforUsuario() {
      //utilizado para não recarregar a pagina 
      event.preventDefault()
  
      let url = "http://127.0.0.1:5000/users"
      //captura um elemento html e as entradas 
      let nome = document.getElementById("name")
      let email = document.getElementById("email")
      let data = document.getElementById("data")
      let bio = document.getElementById("bio")
  
      console.log(nome)
      console.log(email)
      console.log(data)
      console.log(bio)
  
  //Um objeto javascrit que enviado ao servidor 
      body = {
          "name": nome,
          "email": email,
          "data": data,
          "bio":bio,
      }
  
      fazPost(url, body)
  }