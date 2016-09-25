'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Stops', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            stopId: Sequelize.INTEGER,
            routeId: Sequelize.INTEGER,
            nameZh: Sequelize.STRING,
            nameEn: Sequelize.STRING,
            sequenceNumber: Sequelize.INTEGER,
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
            queryInterface.addIndex('Stops', ['position'], {
                indexName: 'geolocation',
                indicesType: 'SPATIAL'
            })
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeIndex('Stops', 'geolocation')
            .then(() => {
                queryInterface.dropTable('Stops');
            });
    }
};
