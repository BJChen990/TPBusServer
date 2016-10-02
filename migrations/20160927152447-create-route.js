'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Routes', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            routeId: Sequelize.INTEGER,
            nameZh: Sequelize.STRING,
            pathAttributeId: Sequelize.INTEGER,
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            },
        })
        .then(() => {
            queryInterface.addIndex('Routes', ['routeId']);
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeIndex('Routes', 'routeId')
        .then(() => {
            queryInterface.dropTable('Routes');
        });
    }
};
