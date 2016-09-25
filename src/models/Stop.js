module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Stop", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        stopId: DataTypes.INTEGER,
        routeId: DataTypes.INTEGER,
        nameZh: DataTypes.STRING,
        nameEn: DataTypes.STRING,
        sequenceNumber: DataTypes.INTEGER,
        position: {
            type: DataTypes.GEOMETRY,
        },
        goBack: DataTypes.INTEGER(1),
        address: DataTypes.STRING,
    },
    {
        indexes: [
            {
                name: 'geolocation',
                field: ['position'],
                type: 'SPATIAL'
            }
        ]
    })
}
