'use strict';

/** @type {import('sequelize-cli').Migration} */

const { DataTypes } = require('sequelize');
const table = 'merchants'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(table, {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(table)
  }
};
