'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.addColumn('estabelecimentos', 'updatedAt', {
    field: 'updated_at',
    type: Sequelize.DATE,
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('estabelecimentos', 'updatedAt', {

    });
  }
};
