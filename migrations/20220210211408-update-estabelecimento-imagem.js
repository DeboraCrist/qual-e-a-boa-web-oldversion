'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.changeColumn('estabelecimentos', 'urlImagemPerfil', {
    type: Sequelize.BLOB('long'),
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('estabelecimentos', 'urlImagemPerfil', {
      type: Sequelize.STRING
    });
  }
};
