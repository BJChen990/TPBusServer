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
        const length = Math.ceil(routes.length * 0.01);
        const chunks = [];

        for (let i = 0; i < length; i++) {
            chunks.push(routes.slice(i * 100, (i + 1) * 100));
        }
        return BlueBird.map(chunks, (chunk: Object) => {
            return Route.bulkCreate(chunk);
        })
    })
