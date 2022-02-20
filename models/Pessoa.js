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
    },
    vacinas: {
        type: db.Sequelize.STRING,
        allowNull: true
    }
});

module.exports = {
    Pessoa : Pessoa,
}