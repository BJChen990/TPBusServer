// @flow
import util from './util';
import {Route} from '../models';
import BlueBird from 'bluebird';

util.readFile('data/route.json', {encoding: 'utf8'})
.then((data: string): Object[] => {
    return JSON.parse(data);
})
.then((data: Object[]) => {
    return data.map((route) => {
        return {
            routeId: route.Id,
            nameZh: route.nameZh,
            pathAttributeId: route.pathAttributeId
        };
    });
})
.then((routes: Object[]) => {
    return util.sliceAndBulkCreate(routes, Route);
})
.then(() => {
    console.log('Route creation done.');
    process.exit(0);
})
.catch((err: Error) => {
    console.error(err.stack);
    process.exit(0);
});
