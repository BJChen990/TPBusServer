module.exports = function (sequelize, DataTypes) {
    return sequelize.define("Route", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        routeId: DataTypes.INTEGER,
        nameZh: DataTypes.STRING,
        pathAttributeId: DataTypes.INTEGER,
    }, {
        indexes: [{
            field: ['routeId'],
        }]
    });
};
