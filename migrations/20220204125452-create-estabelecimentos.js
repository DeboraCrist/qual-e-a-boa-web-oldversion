'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('estabelecimentos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nomeDono: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      nomeEstabelecimento: {
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
      informacaoComplementar: {
        type: Sequelize.TEXT
      },
      urlImagemPerfil: {
        type: Sequelize.STRING
      },
      urlImagemLocal: {
        type: Sequelize.STRING
      },
      rua: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      bairro: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      numero: {
        type: Sequelize.STRING(100),
        allowNull: false
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
      lotacaoMax: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      tipoDeConta: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('estabelecimentos');
  }
};
