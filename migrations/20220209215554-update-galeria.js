'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.changeColumn('galerias', 'foto', {
    type: Sequelize.BLOB('long'),
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('galerias', 'foto', {
      type: Sequelize.BLOB
    });
  }
};
