const db = require("./db");

const criptografia = require("../scripts/criptografia");
const {criptografar} = require("../scripts/criptografia");

const Estabelecimento = db.sequelize.define("estabelecimentos", {
    nomeDono: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    nomeEstabelecimento: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    email: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    senha: {
        type: db.Sequelize.STRING,
        allowNull: false
    },
    informacaoComplementar: {
        type: db.Sequelize.TEXT
    },
    urlImagemPerfil: {
        type: db.Sequelize.STRING
    },
    urlImagemLocal: {
        type: db.Sequelize.STRING
    },
    rua: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    bairro: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    numero: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    cidade: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    estado: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    cep: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    lotacaoMax: {
        type: db.Sequelize.INTEGER,
        allowNull: true
    },
    tipoDeConta: {
        type: db.Sequelize.INTEGER,
        allowNull: false
    }
});


//descomente a linha a seguir para criar a tabela no seu DB caso ela ainda não exista

//Estabelecimento.sync({force: true});
//Se a tabela a cima ja existir dentro do seu DB mantenha o comando a cima comentado

const RegistraEstabelecimentoNaTabela = (dadosEstabelecimento) => {
    Estabelecimento.create({
        nomeDono: dadosEstabelecimento.nomeDono,
        nomeEstabelecimento: dadosEstabelecimento.nomeEstabelecimento,
        email: dadosEstabelecimento.email,
        senha: criptografia.criptografar(dadosEstabelecimento.senha),
        informacaoComplementar: dadosEstabelecimento.informacaoComplementar,
        urlImagemPerfil: dadosEstabelecimento.urlImagemPerfil,
        urlImagemLocal: dadosEstabelecimento.urlImagemLocal,
        rua: dadosEstabelecimento.rua,
        bairro: dadosEstabelecimento.bairro,
        numero: dadosEstabelecimento.numero,
        cidade: dadosEstabelecimento.cidade,
        estado: dadosEstabelecimento.estado,
        cep: dadosEstabelecimento.cep,
        lotacaoMax: dadosEstabelecimento.lotacaoMax,
        tipoDeConta: dadosEstabelecimento.tipoDeConta //Define 1 pois é um user de estabelecimento
    }).then(() => {
        console.log("Registrado");
    }).catch((error) => {
        console.log("Erro: "+ error);
    });
}
const AtualizarDadosUser = (dadoUser)=> {
    PerfilUser.update({
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
    Estabelecimento : Estabelecimento,
    RegistraEstabelecimentoNaTabela : RegistraEstabelecimentoNaTabela,
    AtualizarDadosUser : AtualizarDadosUser,
}
