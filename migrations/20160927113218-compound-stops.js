'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('CompoundStops', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            stopIds: Sequelize.STRING,
            routeIds: Sequelize.STRING,
            nameZh: Sequelize.STRING,
            position: {
                type: Sequelize.GEOMETRY,
                allowNull: false
            },
            goBack: Sequelize.INTEGER(1),
            address: Sequelize.STRING,
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            },
        })
        .then(() => {
            queryInterface.addIndex('CompoundStops', ['position'], {
                indexName: 'geolocation',
                indicesType: 'SPATIAL'
            })
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeIndex('CompoundStops', 'geolocation')
            .then(() => {
                queryInterface.dropTable('CompoundStops');
            });
    }
};
