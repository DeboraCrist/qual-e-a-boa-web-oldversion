const db = require("./db");
const {Estabelecimento} = require("./Estabelecimento");

const Evento = db.sequelize.define("eventos", {
    titulo: {
        type: db.Sequelize.STRING(50),
        allowNull: false,
    },
    urlImagem: {
        type: db.Sequelize.STRING,
        allowNull: false,
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
    tipoDeEvento: {
        type: db.Sequelize.STRING(100),
        allowNull: false
    },
    valorEntrada: {
        type: db.Sequelize.REAL,
    },
    capacidade: {
        type: db.Sequelize.INTEGER,
    },
    dataDoEvento: {
        type: db.Sequelize.DATEONLY,
        allowNull: false,
    },
    horaDoEvento: {
        type: db.Sequelize.TIME,
        allowNull: false,
    },
    confirmacoes: {
        type: db.Sequelize.INTEGER,
    },
    idEstabelecimento: {
        type: db.Sequelize.INTEGER,
        references : {
            model: "estabelecimentos",
            foreignKey: "id",
        },
    }
});

Evento.associate = (models) => {
    Evento.belongsTo(models.Estabelecimento, {
        foreignKey: "idEstabelecimento",
    });
}

Estabelecimento.associate = (models) => {
    Estabelecimento.hasMany(models.Evento, {
        foreignKey: "idEstabelecimento",
    });
}

//Evento.sync({force:true});

module.exports = {
    Evento : Evento,
}