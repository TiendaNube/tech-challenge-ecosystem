'use strict';
/** @type {import('sequelize-cli').Migration} */

const { DataTypes } = require('sequelize');
const table = 'transactions'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(table,{
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
      },
      merchant_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references:{
          model: 'merchants',
          key: 'id'
        },
        onUpdate: 'CASCADE'
      },
      description: {
        type: DataTypes.STRING,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false
      },
      card_number: {
        type: DataTypes.CHAR(16),
        allowNull: false
      },
      card_holder:{
        type: DataTypes.STRING,
        allowNull: false
      },
      card_expiration:{
        type: DataTypes.CHAR(7),
        allowNull: false
      },
      card_cvv:{
        type: DataTypes.CHAR(3),
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }  
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(table)
  }
};
