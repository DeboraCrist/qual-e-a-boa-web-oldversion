const db = require("./db");

const {Estabelecimento} = require("./Estabelecimento");
const {Pessoa} = require("./Pessoa");

const Agenda = db.sequelize.define("agendas", {
    id: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: db.Sequelize.STRING(50),
        allowNull: false,
    },
    data: {
        type: db.Sequelize.DATEONLY,
        allowNull: false,
    },
    bio: {
        type: db.Sequelize.TEXT,
        allowNull: true,
    },
    //Caso seja um estabelecimento criando
    idEstabelecimento: {
        type: db.Sequelize.INTEGER,
        references: {
            model: "estabelecimentos",
            foreignKey: "id",
        }
    },
    //Caso seja uma pessoa criando
    idPessoa: {
        type: db.Sequelize.INTEGER,
        references: {
            model: "pessoas",
            foreignKey: "id",
        }
    }
});

Agenda.associate = (models) => {
    Agenda.belongsTo(models.Estabelecimento, {
        foreignKey: "idEstabelecimento",
    });
}

Estabelecimento.associate = (models) => {
    Estabelecimento.hasMany(models.Agenda, {
        foreignKey: "idEstabelecimento",
    });
}

Agenda.associate = (models) => {
    Agenda.belongsTo(models.Pessoa, {
        foreignKey: "idPessoa",
    });
}

Pessoa.associate = (models) => {
    Pessoa.hasMany(models.Agenda, {
        foreignKey: "idPessoa",
    });
}

module.exports = {
    Agenda: Agenda,
}