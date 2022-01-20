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

router.post("/registraEvento", (req, res) => {
    const dadosLoginId = await Estabelecimento.findOne({
        where: {
            id: req.session.dadosLogin.id
        }
    });

    Evento.create({
        idEstabelecimento: dadosLoginId.id,
        titulo: req.body.titulo, 
        urlImagem:req.body.urlImagem, 
        rua:req.body.rua, 
        bairro:req.body.bairro, 
        numero:req.body.numero, 
        cidade:req.body.cidade, 
        estado:req.body.estado, 
        cep:req.body.cep, 
        tipoDeEvento:req.body.tipoDeEvento, 
        valorEntrada:req.body.valorEntrada, 
        capacidade:req.body.capacidade, 
        dataDoEvento:req.body.dataDoEvento, 
        horaDoEvento:req.body.horaDoEvento,
        
    }).then(() => {
            console.log("criado");
    }).catch((error) => {
            console.log("Erro: "+ error);
    });

})
//Evento.sync({force: true});

module.exports = Evento;