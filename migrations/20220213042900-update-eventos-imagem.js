'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.changeColumn('eventos', 'urlImagem', {
    type: Sequelize.BLOB('long'),
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('eventos', 'urlImagem', {
      type: Sequelize.STRING
    });
  }
};
