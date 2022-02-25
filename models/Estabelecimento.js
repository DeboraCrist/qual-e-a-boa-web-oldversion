const db = require("./db");


const Estabelecimento = db.sequelize.define("estabelecimentos", {
    id: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
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
        type: db.Sequelize.BLOB('long')
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

module.exports = {
    Estabelecimento : Estabelecimento,
}
