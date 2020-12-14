'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      txNr: {
        type: Sequelize.INTEGER
      },
      Amount: {
        type: Sequelize.INTEGER
      },
      Fee: {
        type: Sequelize.INTEGER
      },
      From: {
        type: Sequelize.STRING
      },
      To: {
        type: Sequelize.STRING
      },
      Signature: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
  }
};