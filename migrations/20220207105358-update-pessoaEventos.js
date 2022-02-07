'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.addColumn('pessoaEventos', 'createdAt', {
    field: 'created_at',
    type: Sequelize.DATE,
  });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('pessoaEventos', 'createdAt', {

    });
  }
};
