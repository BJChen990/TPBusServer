// @flow

import express from 'express';
import {Stop, sequelize} from '../models';
const router = express.Router();

router.get('/pathAttributeId/:pathAttributeId', (req, res) => {
    const pathAttributeId: number = parseInt(req.params.pathAttributeId);

    sequelize.query(`
        SELECT a.stopId, a.sequenceNumber, b.nameZh, b.position
        FROM Paths as a
        JOIN Stops as b
        ON a.stopId = b.stopId
        WHERE pathAttributeId = ${pathAttributeId}
        ORDER BY a.sequenceNumber`
    )
    .then((stops) => {
        res.send(stops);
    })
    .catch((err) => {
        res.send(err.stack);
    })
});

module.exports = router;
