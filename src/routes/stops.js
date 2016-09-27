// @flow

import express from 'express';
import {Stop, CompoundStop, sequelize} from '../models';
const router = express.Router();

function getAreaSearchString(longitude: number, latitude: number, length: number): string {
    const maxLon = longitude + length;
    const minLon = longitude - length;
    const maxLat = latitude + length;
    const minLat = latitude - length;

    return '(' +
        `${minLon} ${minLat},` +
        `${maxLon} ${minLat},` +
        `${maxLon} ${maxLat},` +
        `${minLon} ${maxLat},` +
        `${minLon} ${minLat})`;
}

router.get('/nearby/:longitude/:latitude/:areaLength?/', (req, res) => {
    const params: {[param: string]: string} = req.params;
    const areaString = getAreaSearchString(
        parseFloat(params.longitude),
        parseFloat(params.latitude),
        params.areaLength ? parseFloat(params.areaLength) : 0.01
    );

    CompoundStop.findAll({
        attributes: ['id', 'nameZh', 'position', 'goBack', 'routeIds', 'stopIds'],
        where: sequelize.literal(`MBRContains(GeomFromText('Polygon(${areaString})'), CompoundStop.position) = 1`)
    })
    .then((stops) => {
        res.send(stops);
    })
    .catch((err) => {
        res.send(err.stack)
    });
});

module.exports = router;
