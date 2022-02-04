'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('pessoas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nomePessoa: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      sobreNome: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      senha: {
        type: Sequelize.STRING,
        allowNull: false
      },
      urlImagem: {
        type: Sequelize.STRING
      },
      passaPorte: {
        type: Sequelize.STRING
      },
      idadePessoa: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      dataNasc: {
        type: Sequelize.DATE,
        allowNull: false
      },
      cidadePessoa: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      estadoPessoa: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      cepPessoa: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      tipoDeConta: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('pessoas');
  }
};
