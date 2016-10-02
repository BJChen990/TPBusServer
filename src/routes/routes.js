// @flow

import express from 'express';
import {Route, sequelize} from '../models';
const router = express.Router();

router.get('/:routesIds/', (req, res) => {
    const routeIds: number[] = JSON.parse(req.params.routesIds);

    Route.findAll({
        attributes: ['routeId', 'nameZh', 'pathAttributeId'],
        where: {
            routeId: {
                $in: routeIds
            }
        }
    })
    .then((routes) => {
        res.send(routes);
    })
    .catch((err) => {
        res.send(err.stack)
    });
});

module.exports = router;
