const db = require("./db");
const {Estabelecimento} = require("./Estabelecimento");

const Galeria = db.sequelize.define("galerias", {
    id: {
        type: db.Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    foto: {
      type: db.Sequelize.BLOB('long'),
      },
    idEstabelecimento: {
      type: db.Sequelize.INTEGER,
      references : {
        model: "estabelecimentos",
        foreignKey: "id",
      },
    },
    createdAt: {
      field: 'created_at',
      type: db.Sequelize.DATE,
    },
    updatedAt: {
      field: 'updated_at',
      type: db.Sequelize.DATE,
    }
});

Galeria.associate = (models) => {
    Galeria.belongsTo(models.Estabelecimento, {
        foreignKey: "idEstabelecimento",
    });
}

Estabelecimento.associate = (models) => {
    Estabelecimento.hasMany(models.Galeria, {
        foreignKey: "idEstabelecimento",
    });
}

module.exports = Galeria;