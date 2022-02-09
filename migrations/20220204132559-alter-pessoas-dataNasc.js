'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.changeColumn('pessoas', 'dataNasc', {
    type: Sequelize.DATEONLY
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('pessoas', 'dataNasc', {
      type: Sequelize.DATE
    });
  }
};
