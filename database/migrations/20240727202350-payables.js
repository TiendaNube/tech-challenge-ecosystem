'use strict';

/** @type {import('sequelize-cli').Migration} */

const { DataTypes } = require('sequelize');
const table = 'payables'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(table, {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      merchant_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'mechants',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      transaction_id:{
        type: DataTypes.STRING,
        allowNull: false,
        references:{
          model: 'transactions',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table)
  }
};
