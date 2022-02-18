const db = require("./db");

const Pessoa = db.sequelize.define("pessoas", {
    id: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nomePessoa: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    sobreNome: {
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
    urlImagem: {
        type: db.Sequelize.BLOB('long')
    },
    passaPorte: {
        type: db.Sequelize.BLOB('long')
    },
    idadePessoa: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    dataNasc: {
        type: db.Sequelize.DATEONLY,
        allowNull: false
    },
    cidadePessoa: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    estadoPessoa: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    cepPessoa: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    tipoDeConta: {
        type: db.Sequelize.INTEGER,
        allowNull: false
    }
});

//descomente a linha a seguir para criar a tabela no seu DB caso ela ainda não exista
//Pessoa.sync({force: true});
//Se a tabela a cima ja existir dentro do seu DB mantenha o comando a cima comentado

/*const RegistraPessoaNaTabela = (dadosPessoa) => {
    Pessoa.create({
        nomePessoa: dadosPessoa.nomePessoa,
        sobreNome: dadosPessoa.sobreNome,
        email: dadosPessoa.email,
        senha: criptografia.criptografar(dadosPessoa.senha),
        idadePessoa: dadosPessoa.idadePessoa,
        urlImagem: dadosPessoa.urlImagem,
        passaPorte: dadosPessoa.passaPorte,
        dataNasc: dadosPessoa.dataNasc,
        cidadePessoa: dadosPessoa.cidadePessoa,
        estadoPessoa: dadosPessoa.estadoPessoa,
        cepPessoa: dadosPessoa.cepPessoa,
        tipoDeConta: dadosPessoa.tipoDeConta //Define 0 pois é um user de pessoa
    }).then(() => {
        console.log("deu bom");
    }).catch((error) => {
        console.log("Erro: "+ error);
    });
}
*/

module.exports = {
    Pessoa : Pessoa,
}