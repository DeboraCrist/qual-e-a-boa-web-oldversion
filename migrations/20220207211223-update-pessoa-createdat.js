'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.addColumn('pessoas', 'createdAt', {
    field: 'created_at',
    type: Sequelize.DATE,
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('pessoas', 'createdAt', {

    });
  }
};
