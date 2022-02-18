'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.changeColumn('pessoas', 'urlImagem', {
    type: Sequelize.BLOB('long'),
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('pessoas', 'urlImagem', {
      type: Sequelize.STRING
    });
  }
};
