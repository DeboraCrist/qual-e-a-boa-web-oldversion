'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.addColumn('agendas', 'updatedAt', {
    field: 'updated_at',
    type: Sequelize.DATE,
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('agendas', 'updatedAt', {

    });
  }
};
