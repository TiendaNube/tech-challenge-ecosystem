'use strict';
/** @type {import('sequelize-cli').Migration} */

const { v4: uuidv4 } = require('uuid');
const table = 'merchants'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(table, [
      {
        id: uuidv4(),
        name: "Thiago Guedes"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(table, null, {});
  }
};
