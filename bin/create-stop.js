// @flow
import util from './util';
import {Stop} from '../models';
import BlueBird from 'bluebird';

util.readFile('data/stop.json', {encoding: 'utf8'})
    .then((data: string): Object[] => {
        return JSON.parse(data);
    })
    .then((stops: Object[]) => {
        return stops.map((stop) => {
            return {
                stopId: stop.Id,
                routeId: stop.routeId,
                nameZh: stop.nameZh,
                nameEn: stop.nameEn,
                sequenceNumber: stop.seqNo,
                position: {
                    type: 'Point',
                    coordinates: [
                        parseFloat(stop.longitude),
                        parseFloat(stop.latitude)
                    ]
                },
                goBack: stop.goBack,
                address: stop.address
            }
        })
    })
    .then((formattedStops: Object[]) => {
        return util.sliceAndBulkCreate(formattedStops, Stop);
    })
    .then(() => {
        console.log('Stop creation done.');
        process.exit(0);
    })
    .catch((err: Error) => {
        console.error(err.stack);
        process.exit(0);
    });
