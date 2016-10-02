module.exports = function (sequelize, DataTypes) {
    return sequelize.define("CompoundStop", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        stopIds: DataTypes.STRING,
        routeIds: DataTypes.STRING,
        nameZh: DataTypes.STRING,
        position: {
            type: DataTypes.GEOMETRY
        },
        goBack: DataTypes.INTEGER(1),
        address: DataTypes.STRING
    }, {
        indexes: [{
            name: 'geolocation',
            field: ['position'],
            type: 'SPATIAL'
        }]
    });
};
