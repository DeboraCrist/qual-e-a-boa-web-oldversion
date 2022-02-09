'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('agendas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      data: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      //Caso seja um estabelecimento criando
      idEstabelecimento: {
        type: Sequelize.INTEGER,
        references: {
          model: "estabelecimentos",
          foreignKey: "id",
        }
      },
      //Caso seja uma pessoa criando
      idPessoa: {
        type: Sequelize.INTEGER,
        references: {
          model: "pessoas",
          foreignKey: "id",
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('agendas');
  }
};
