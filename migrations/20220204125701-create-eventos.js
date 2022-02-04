'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('eventos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      titulo: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      urlImagem: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cidade: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      estado: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      cep: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      tipoDeEvento: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      valorEntrada: {
        type: Sequelize.REAL,
      },
      capacidade: {
        type: Sequelize.INTEGER,
      },
      dataDoEvento: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      horaDoEvento: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      confirmacoes: {
        type: Sequelize.INTEGER,
      },
      statusEvento: {
        type: Sequelize.BOOLEAN,
          defaultValue: true,
      },
      idEstabelecimento: {
        type: Sequelize.INTEGER,
        references : {
          model: "estabelecimentos",
          foreignKey: "id",
        },
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('eventos');
  }
};
