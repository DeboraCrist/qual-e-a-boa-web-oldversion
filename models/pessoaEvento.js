const db = require("./db");
const {Evento} = require("./Evento");
const {Pessoa} = require("./Pessoa");

const PessoaEvento = db.sequelize.define ("pessoaEventos", {
    id: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      idPessoa: {
        type: db.Sequelize.INTEGER,
        references : {
          model: "pessoas",
          foreignKey: "id",
        },
        onDelete: "CASCADE"
      },
      idEventos: {
        type: db.Sequelize.INTEGER,
        references : {
          model: "eventos",
          foreignKey: "id",
        },
        onDelete: "CASCADE"
      }
});

PessoaEvento.associate = (models) => {
    PessoaEvento.belongsTo(models.Pessoa, {
        foreignKey: "idPessoa"
    });
}

PessoaEvento.associate = (models) => {
    PessoaEvento.belongsTo(models.Evento, {
        foreignKey: "idEventos"
    });
}

module.exports = {
    PessoaEvento: PessoaEvento
}