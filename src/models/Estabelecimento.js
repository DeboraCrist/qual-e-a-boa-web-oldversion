const db = require("./db");

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
    bio: {
        type: db.Sequelize.TEXT
    },
    url_imagem: {
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
    tipoDeConta: {
        type: db.Sequelize.INTEGER,
        allowNull: false
    }
});

//descomente a linha a seguir para criar a tabela no seu DB caso ela ainda não exista
//Estabelecimento.sync({force: true});
//Se a tabela a cima ja existir dentro do seu DB mantenha o comando a cima comentado

module.exports = Estabelecimento;