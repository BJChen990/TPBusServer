module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Path", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        stopId: DataTypes.INTEGER,
        pathAttributeId: DataTypes.INTEGER,
        sequenceNumber: DataTypes.INTEGER
    }, {
        indexes: [{
            field: ['pathAttributeId'],
        }]
    });
};
