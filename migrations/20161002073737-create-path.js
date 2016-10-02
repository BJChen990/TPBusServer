'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.createTable('Paths', {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          stopId: Sequelize.INTEGER,
          sequenceNumber: Sequelize.INTEGER,
          pathAttributeId: Sequelize.INTEGER,
          createdAt: {
              type: Sequelize.DATE
          },
          updatedAt: {
              type: Sequelize.DATE
          },
      })
      .then(() => {
          return queryInterface.addIndex('Paths', ['pathAttributeId']);
      })
      .then(() => {
          return queryInterface.addIndex('Stops', ['stopId']);
      })
      .catch((err) => {
          console.error(err.stack);
      });
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeIndex('Stops', 'stopId')
      .then(() => {
          return queryInterface.removeIndex('Paths', 'pathAttributeId')
      })
      .then(() => {
          return queryInterface.dropTable('Paths');
      })
      .catch((err) => {
          console.error(err.stack);
      });
  }
};
