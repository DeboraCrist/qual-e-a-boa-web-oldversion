'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('pessoaEventos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      idPessoa: {
        type: Sequelize.INTEGER,
        references : {
          model: "pessoas",
          foreignKey: "id",
        },
        onDelete: "CASCADE"
      },
      idEventos: {
        type: Sequelize.INTEGER,
        references : {
          model: "eventos",
          foreignKey: "id",
        },
        onDelete: "CASCADE"
      }
    });
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('pessoaEventos');
  }
};
