'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('galerias', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      foto: {
        type: Sequelize.BLOB,
      },
      idEstabelecimento: {
        type: Sequelize.INTEGER,
        references : {
          model: "estabelecimentos",
          foreignKey: "id",
        },
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('galerias');
  }
};
