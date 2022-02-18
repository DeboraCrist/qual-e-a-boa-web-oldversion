'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.changeColumn('pessoas', 'passaPorte', {
    type: Sequelize.BLOB('long'),
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('pessoas', 'passaPorte', {
      type: Sequelize.STRING
    });
  }
};
