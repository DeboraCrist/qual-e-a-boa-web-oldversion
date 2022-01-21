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
    tipoDeEvento: {
        type: db.Sequelize.INTEGER,
        allowNull: false
    },
    valorEntrada: {
        type: db.Sequelize.REAL,
    },
    capacidade: {
        type: db.Sequelize.INTEGER,
    },
    dataDoEvento: {
        type: db.Sequelize.DATE,
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
const RegistraEventoNaTabela = (dadosPessoa) => {
    Evento.create({
        idEstabelecimento: dadosLoginId.id,
        titulo: dadosPessoa.titulo, 
        urlImagem:dadosPessoa.urlImagem, 
        rua:dadosPessoa.rua, 
        bairro:dadosPessoa.bairro, 
        numero:dadosPessoa.numero, 
        cidade:dadosPessoa.cidade, 
        estado:dadosPessoa.estado, 
        cep:dadosPessoa.cep, 
        tipoDeEvento:dadosPessoa.tipoDeEvento, 
        valorEntrada:dadosPessoa.valorEntrada, 
        capacidade:dadosPessoa.capacidade, 
        dataDoEvento:dadosPessoa.dataDoEvento, 
        horaDoEvento:dadosPessoa.horaDoEvento,
    }).then(() => {
        console.log("Criado");
    }).catch((error) => {
        console.log("Erro: "+ error);
    });
}


module.exports = {
    Evento : Evento,
    RegistraEventoTabela : RegistraEventoNaTabela,

}